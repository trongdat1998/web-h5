// 划转modal
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./transfer_style";
import { injectIntl } from "react-intl";
import helper from "../../utils/helper";
import vali from "../../utils/validator";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Input,
} from "@material-ui/core";
import { Iconfont } from "../../lib";

class TransferModal extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      token_id: "",
      quantity: "",
      source_type: 0,
      target_type: 1,
      msg: "",
      coin_tokens: [],
      token_obj: {},
      account_msg: "",
    };
    this.hide = this.hide.bind(this);
    this.submit = this.submit.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.quickSwitch = this.quickSwitch.bind(this);
  }
  componentDidMount() {
    // 拉取永续合约的币种
    // this.props.dispatch({
    //   type: "layout/coin_tokens",
    //   payload: {}
    // });

    this.setState({
      token_id: this.props.token_id,
    });
    this.get_account_balance(this.state.source_type);
  }
  // 修改数量或划转币种
  handleChange(type, e) {
    const t = e.target;
    const n = t.name;
    let v = t.value;
    if (n === "quantity") {
      // 非数字提示
      this.setState({
        msg: v.match(/[^0-9\.]/)
          ? this.props.intl.formatMessage({ id: "请输入数字" })
          : "",
      });
      v = v
        .replace(/[^0-9\.]/, "")
        .replace(/^0{1,}/, "0")
        .replace(/^(0)([1-9])/, ($1, $2) => {
          return $2;
        })
        .replace(/^\./, "0.");
      let d = v.split(".");
      if (d[1] && d[1].length > 8) {
        v = d[0] + "." + d[1].slice(0, 8);
      }
      if (v && !vali.isFloat(v)) {
        return;
      }
    } else {
      this.setState({
        quantity: "",
      });
    }
    this.setState({
      [type]: v,
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    let open = this.props.open;
    // if (this.props.source_type != nextProps.source_type) {
    //   this.get_account_balance(nextProps.source_type);
    // }

    // if (
    //   this.props.token1 != nextProps.token1 ||
    //   this.props.token2 != nextProps.token2 ||
    //   this.props.symbol_id != nextProps.symbol_id
    // ) {
    //   this.setState({
    //     token_id: nextProps.token_id
    //   });
    // }
    if (!open && nextProps.open) {
      this.show();
    } else if (open && !nextProps.open) {
      this.hide();
    }
    if (
      !this.props.child_account_list.length &&
      nextProps.child_account_list.length
    ) {
      this.get_account_balance(this.state.source_type);
    }
  }
  // token_id，source_type，变化时拉取可划转资产
  componentDidUpdate(preProps, preState) {
    if (
      preState.token_id != this.state.token_id ||
      preState.source_type != this.state.source_type
    ) {
      this.get_account_balance(this.state.source_type);
    }
  }
  show() {
    this.setState(
      {
        open: true,
        token_id: this.props.token_id,
        target_type: this.props.target_type,
        source_type: this.props.source_type,
        account_msg: "",
      },
      () => {
        this.filterCoin();
        this.get_account_balance(this.state.source_type);
      }
    );
  }
  hide() {
    this.props.onCancel && this.props.onCancel();
    this.setState({
      open: false,
      msg: "",
      quantity: "",
      token_id: "",
      source_type: 0,
      target_type: 1,
      account_msg: "",
    });
  }
  // 快速转换
  quickSwitch() {
    let source_type = this.state.target_type;
    let target_type = this.state.source_type;
    this.setState(
      {
        source_type: source_type,
        target_type: target_type,
        quantity: "",
        account_msg: "",
      },
      () => {
        this.filterCoin();
      }
    );
    // const d = this.props.child_account_list[source_type] || {};
    // if (d && d.accountId) {
    //   // 查询账户余额
    //   this.props.dispatch({
    //     type: "layout/child_account_balance",
    //     payload: {
    //       account_type: d.accountType,
    //       account_index: d.accountIndex,
    //       account_id: d.accountId,
    //       account_name: d.accountName
    //     }
    //   });
    // }
  }
  // 全部转换
  changeQuantity() {
    this.setState({
      quantity: helper.digits(this.available(), 8),
    });
  }
  submit() {
    const { token_id, quantity, source_type, target_type } = this.state;
    const f = this.props.child_account_list[source_type];
    const t = this.props.child_account_list[target_type];
    if (!f || !t) {
      this.setState({
        account_msg: this.props.intl.formatMessage({
          id: "划转账户不能为空",
        }),
      });
      return;
    }

    let available = this.available(); // 可用划转

    // 只能 钱包主账户 与 其他账户互转
    const f_is_main = f.accountType == 1 && f.accountIndex == 0;
    const t_is_main = t.accountType == 1 && t.accountIndex == 0;
    if (!f_is_main && !t_is_main) {
      this.setState({
        account_msg: this.props.intl.formatMessage({
          id: "只能钱包主账户与其他账户进行转账",
        }),
      });
      return;
    }
    if (!quantity || quantity == 0) {
      this.setState({
        msg: this.props.intl.formatMessage({ id: "数量为空" }),
      });
      return;
    }
    if (Number(quantity) > Number(available)) {
      this.setState({
        msg: this.props.intl.formatMessage({ id: "可用额度不足" }),
      });
      return;
    }

    let params = {
      token_id: token_id,
      amount: quantity,
      from_account_type: f.accountType,
      from_account_index: f.accountIndex,
      from_account_id: f.accountId,
      to_account_type: t.accountType,
      to_account_index: t.accountIndex,
      to_account_id: t.accountId,
    };
    this.setState({
      msg: "",
    });
    this.props.dispatch({
      type: "layout/assetTransfer",
      payload: params,
      callback: () => {
        this.hide();
      },
      enqueueSnackbar: this.props.enqueueSnackbar,
    });
  }
  get_account_balance = (n) => {
    const d = this.props.child_account_list.length
      ? this.props.child_account_list[n]
      : {};
    if (d && d.accountId && this.state.token_id) {
      // 查询账户余额
      this.props.dispatch({
        type: "layout/child_account_balance",
        payload: {
          account_type: d.accountType,
          account_index: d.accountIndex,
          account_id: d.accountId,
          account_name: d.accountName,
          token_id: this.state.token_id,
        },
      });
    }
  };
  // 选择账户
  changeChoose = (key) => (e) => {
    const v = e.target.value;
    const d = this.props.child_account_list[v] || {};
    let f = this.state.source_type;
    let t = this.state.target_type;
    if (key == "source_type") {
      // source 选择了 钱包主账户, target已经选择了主账户
      // if (
      //   d.accountType == 1 &&
      //   d.accountIndex == 0 &&
      //   (this.props.child_account_list[t]["accountIndex"] == 0 || t == v)
      // ) {
      //   return;
      // }
      this.get_account_balance(v);
    }
    // if (key == "target_type") {
    //   // target 选择了 钱包主账户, source已经选择了主账户
    //   if (
    //     d.accountType == 1 &&
    //     d.accountIndex == 0 &&
    //     (f == v || this.props.child_account_list[f]["accountIndex"] == 0)
    //   ) {
    //     return;
    //   }
    // }
    // this.setState({
    //   source_type: f,
    //   target_type: t
    // });
    this.setState(
      {
        [key]: v,
        account_msg: "",
      },
      () => {
        this.filterCoin();
      }
    );
  };
  // 根据账户，筛选可转账币种
  filterCoin = () => {
    const { token, optionCoinToken, futuresCoinToken } = this.props.config;
    const coin_token = token;
    const option_coin_token = optionCoinToken;
    const futures_coin_token = futuresCoinToken;
    let token_obj = {};
    // 券商上已有的币
    let tokens = coin_token.map((item) => {
      token_obj[item.tokenId] = item;
      return item.tokenId;
    });
    // 子账户资产上的币
    const data =
      this.props.child_account_list &&
      this.props.child_account_list.length &&
      this.props.child_account_list[this.state.source_type]
        ? this.props.child_account_list[this.state.source_type]
        : {};
    const balance =
      data.accountId && this.props.child_account_balance[data.accountId]
        ? this.props.child_account_balance[data.accountId]
        : [];
    if (balance.length) {
      balance.map((item) => {
        if (!tokens.includes(item.tokenId)) {
          tokens.push(item.tokenId);
        }
      });
    }
    // 主账户上的币
    const user_balance = this.props.user_balance;
    if (user_balance.length) {
      user_balance.map((item) => {
        if (!tokens.includes(item.tokenId)) {
          tokens.push(item.tokenId);
        }
      });
    }

    let target_tokens = [];
    let source_tokens = [];
    if (this.props.child_account_list.length) {
      const t = this.props.child_account_list[this.state.target_type] || {};
      const f = this.props.child_account_list[this.state.source_type] || {};

      switch (t.accountType) {
        case 1:
          target_tokens = tokens;
          break;
        case 2:
          target_tokens = option_coin_token;
          break;
        case 3:
          target_tokens = futures_coin_token;
          break;
        default:
          target_tokens = tokens;
      }
      switch (f.accountType) {
        case 1:
          source_tokens = tokens;
          break;
        case 2:
          source_tokens = option_coin_token;
          break;
        case 3:
          source_tokens = futures_coin_token;
          break;
        default:
          source_tokens = tokens;
      }
    }
    const len = Math.max(target_tokens.length, source_tokens.length);
    let a = new Set();
    new Array(len).fill(1).map((item, i) => {
      if (source_tokens[i] && target_tokens.includes(source_tokens[i])) {
        a.add(source_tokens[i]);
      }
      if (target_tokens[i] && source_tokens.includes(target_tokens[i])) {
        a.add(target_tokens[i]);
      }
    });
    a = Array.from(a);
    this.setState({
      coin_tokens: a,
      token_obj,
      token_id: a.includes(this.state.token_id) ? this.state.token_id : a[0],
    });
  };
  // 查询余额
  available = () => {
    let d = 0;
    const data =
      this.props.child_account_list &&
      this.props.child_account_list.length &&
      this.props.child_account_list[this.state.source_type]
        ? this.props.child_account_list[this.state.source_type]
        : {};
    const balance =
      data.accountId && this.props.child_account_balance[data.accountId]
        ? this.props.child_account_balance[data.accountId]
        : [];
    if (this.state.token_id && balance.length) {
      balance.map((item) => {
        if (item.tokenId == this.state.token_id) {
          d = item.free || 0;
        }
      });
    }
    return d;
  };
  render() {
    const { classes, child_account_list } = this.props;
    const { source_type, target_type, token_id } = this.state;
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>
          {this.props.intl.formatMessage({ id: "资产划转" })}
        </DialogTitle>
        <DialogContent>
          <div className={classes.content}>
            <div className={classes.whole}>
              <div className="item" style={{ margin: 0 }}>
                <label>{this.props.intl.formatMessage({ id: "从" })}</label>
                <Select
                  value={source_type}
                  onChange={this.changeChoose("source_type")}
                  className={classes.select}
                  classes={{ icon: classes.icon }}
                  inputProps={{
                    name: "source_type",
                    id: "source_type",
                  }}
                >
                  {(child_account_list || []).map((item, index) => {
                    return (
                      <MenuItem
                        value={index}
                        key={index}
                        className={classes.menuItem}
                      >
                        {item.accountName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
              <Iconfont
                onClick={this.quickSwitch}
                className={classes.transIcon}
                type="transaction"
                size="20"
              />
              <div className="item" style={{ margin: 0 }}>
                <label>{this.props.intl.formatMessage({ id: "划入" })}</label>
                <Select
                  value={target_type}
                  onChange={this.changeChoose("target_type")}
                  className={classes.select}
                  classes={{ icon: classes.icon }}
                  inputProps={{
                    name: "target_type",
                    id: "target_type",
                  }}
                >
                  {(child_account_list || []).map((item, index) => {
                    return (
                      <MenuItem
                        value={index}
                        key={index}
                        className={classes.menuItem}
                      >
                        {item.accountName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>
            <p className={classes.account_msg}>{this.state.account_msg}</p>
            <div className="item">
              <label>{this.props.intl.formatMessage({ id: "划转币种" })}</label>
              <Select
                value={token_id}
                onChange={this.handleChange.bind(this, "token_id")}
                className={classes.select}
                classes={{ icon: classes.icon }}
                inputProps={{
                  name: "token_id",
                  id: "token_id",
                }}
              >
                {this.state.coin_tokens && this.state.coin_tokens.length
                  ? this.state.coin_tokens.map((item, index) => {
                      return (
                        <MenuItem
                          value={item}
                          key={index}
                          className={classes.menuItem}
                        >
                          {this.state.token_obj[item]
                            ? this.state.token_obj[item]["tokenName"]
                            : item}
                        </MenuItem>
                      );
                    })
                  : ""}
              </Select>
            </div>
            <div className="item">
              <label>
                {this.props.intl.formatMessage({ id: "划转金额" })}
                <span>
                  {this.props.intl.formatMessage({ id: "可用" })}：
                  {helper.digits(this.available(), 8)} {token_id}
                </span>
              </label>
              <Input
                value={this.state.quantity}
                className={classes.select}
                onChange={this.handleChange.bind(this, "quantity")}
                name="quantity"
                autoComplete="off"
                endAdornment={
                  <span className={classes.total} onClick={this.changeQuantity}>
                    {this.props.intl.formatMessage({ id: "全部" })}
                  </span>
                }
              />
            </div>
            <p className={classes.tip}>{this.state.msg}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.hide} color="primary">
            {this.props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button
            onClick={this.submit}
            color="primary"
            disabled={this.state.source_type == this.state.target_type}
            autoFocus
          >
            {this.props.intl.formatMessage({ id: "确认划转" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
TransferModal.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(injectIntl(TransferModal));
