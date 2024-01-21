// 首页
import React from "react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import route_map from "../../config/route_map";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Tooltip,
  MobileStepper,
  Grid,
  TextField,
  InputAdornment,
  Drawer,
} from "@material-ui/core";
import { Iconfont, message } from "../../lib";
import styles from "./style";
import SwipeableViews from "react-swipeable-views";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import classnames from "classnames";
import TransferModal from "../public/transfer_modal";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      search: "",
      hideZero: false,
      show: true,
      functions: [],
      tab: 0,
      open: false,
      anchor: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.changeCoin = this.changeCoin.bind(this);
  }
  componentDidMount() {
    let funs = [];
    let functions = this.props.config.functions || {};
    if (functions.exchange) {
      funs.push("币币");
    }
    if (functions.futures) {
      funs.push("合约");
      this.httpAction1();
    }
    this.setState({
      functions: funs,
    });
    // 总资产轮询
    this.props.dispatch({
      type: "layout/getTotalAsset",
      payload: {
        unit: "btc",
      },
    });
    this.httpAction();
  }
  componentDidUpdate() {
    if (this.props.ws && !this.state.subed && this.state.functions.length) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.ws.sub(
            {
              id: "balance",
              topic: "balance",
              event: "sub",
            },
            this.httpAction,
            this.callback
          );
        }
      );
    }
  }
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "ws/balance_http",
      payload,
    });
  };
  // 合约资产轮询
  httpAction1 = (payload) => {
    return this.props.dispatch({
      type: "future/getFutureAsset",
      payload: {
        unit: "btc",
      },
    });
  };
  callback = (data) => {
    data &&
      data.data &&
      data.data.length &&
      WSDATA.setData("user_balance_source", data.data);
  };

  changeCoin() {
    const v = !this.state.hideZero;
    this.setState({
      hideZero: v,
    });
  }
  handleChange(e) {
    const t = e.target;
    const n = t.name;
    const v = t.value;
    this.setState({
      [n]: v,
    });
  }
  goto(data) {
    if (data.allowDeposit) {
      window.location.href = route_map.deposit + "/" + data.tokenId;
    } else {
      message.info(
        data.tokenName + this.props.intl.formatMessage({ id: "充币已关闭" })
      );
    }
  }
  goBack() {
    window.history.go(-1);
  }
  handleStepChange = (step) => {
    this.setState({
      tab: step,
    });
  };
  change = (key) => () => {
    this.setState({
      open: key,
    });
  };
  link() {
    let downloadUrl =
      this.props.index_config &&
      this.props.index_config.shareConfig &&
      this.props.index_config.shareConfig.openUrl
        ? this.props.index_config.shareConfig.openUrl
        : "";
    this.props.enqueueSnackbar(
      this.props.intl.formatMessage({
        id: downloadUrl ? "请下载APP发起提币" : "请在全功能WEB页面发起提币",
      }),
      { variant: "info" }
    );
    if (downloadUrl) {
      setTimeout(function () {
        window.location.href = downloadUrl;
      }, 500);
    }
  }
  toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({
      anchor: open,
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const totalAssetRates =
      this.props.total_asset && this.props.total_asset.totalAsset
        ? helper.currencyValue(
            this.props.rates,
            this.props.total_asset.totalAsset,
            this.props.total_asset.unit
          )
        : ["", ""];
    const cRates2 = helper.currencyValue(
      this.props.rates,
      this.props.total_asset ? this.props.total_asset.coinAsset : 0,
      this.props.total_asset ? this.props.total_asset.unit : 0,
      this.props.unit
    );
    const cRates3 = helper.currencyValue(
      this.props.rates,
      this.props.total_asset ? this.props.total_asset.futuresCoinAsset : 0,
      this.props.total_asset ? this.props.total_asset.unit : 0,
      this.props.unit
    );
    const user_balance = this.props.user_balance || {}; // 账户资产 []
    const tokens = this.props.config.tokens; // 所有token {}
    let balances = {};
    let fix_token = [];
    Object.keys(user_balance).map((item) => {
      balances[item] = user_balance[item];
      if (!tokens[item]) {
        fix_token.push(user_balance[item]);
      }
    });
    let data = [];
    const regrep = new RegExp(this.state.search, "i");
    (window.WEB_CONFIG.token || []).map((item) => {
      let d = { ...item };
      if (balances[item.tokenId]) {
        d = { ...item, ...balances[item.tokenId] };
      }
      if (this.state.hideZero) {
        if (
          regrep.test(d["tokenName"]) &&
          d["btcValue"] &&
          d["btcValue"] >= 0.001
        ) {
          data.push(d);
        }
      } else {
        if (regrep.test(d["tokenName"])) {
          data.push(d);
        }
      }
    });
    (fix_token || []).map((item) => {
      if (this.state.hideZero) {
        if (
          regrep.test(item["tokenName"]) &&
          item["btcValue"] &&
          item["btcValue"] >= 0.001
        ) {
          data.push(item);
        }
      } else {
        if (regrep.test(item["tokenName"])) {
          data.push(item);
        }
      }
    });
    const future_data = this.props.future_asset;
    return (
      <div className={classes.finance}>
        <Grid className={classnames(classes.tit, classes.finance_tit)}>
          <Iconfont onClick={this.goBack} type="back" size="24" />
          <h2>{this.props.intl.formatMessage({ id: "资产" })}</h2>
        </Grid>
        <Grid>
          <div className={classes.total}>
            <p>
              <span>
                {this.props.intl.formatMessage({ id: "总资产折合" })}(
                {this.props.total_asset ? this.props.total_asset.unit : ""})
              </span>
              {this.state.show ? (
                <Iconfont
                  type="unhidden"
                  size="24"
                  onClick={() => {
                    this.setState({
                      show: false,
                    });
                  }}
                />
              ) : (
                <Iconfont
                  type="hidden"
                  size="24"
                  onClick={() => {
                    this.setState({
                      show: true,
                    });
                  }}
                />
              )}
            </p>
            {this.state.show ? (
              <h2>
                {this.props.total_asset && this.props.total_asset.totalAsset
                  ? helper.digits(this.props.total_asset.totalAsset, 8)
                  : ""}{" "}
                <strong>
                  {this.props.total_asset &&
                  this.props.total_asset.totalAsset &&
                  this.props.rates[this.props.total_asset.unit]
                    ? ` ≈ ${totalAssetRates[0]}${totalAssetRates[1]}`
                    : ""}
                </strong>
              </h2>
            ) : (
              <h2>
                *****<strong> *****</strong>
              </h2>
            )}

            {/* {this.state.show ? (
              <p>
                {this.props.total_asset &&
                this.props.total_asset.totalAsset &&
                this.props.rates[this.props.total_asset.unit]
                  ? `≈ ${totalAssetRates[0]}${totalAssetRates[1]}`
                  : ""}
              </p>
            ) : (
              <p>*****</p>
            )} */}
            <Grid container className={classes.action}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.toggleDrawer(true)}
                >
                  {this.props.intl.formatMessage({ id: "充币" })}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.link.bind(this)}
                >
                  {this.props.intl.formatMessage({ id: "提币" })}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.change(true)}
                >
                  {this.props.intl.formatMessage({ id: "划转" })}
                </Button>
              </Grid>
            </Grid>
          </div>
          <Grid container className={classes.tab}>
            {this.state.functions.map((item, i) => {
              return (
                <Grid item key={item}>
                  <span
                    onClick={this.handleStepChange.bind(this, i)}
                    className={this.state.tab == i ? classes.choose : ""}
                  >
                    {this.props.intl.formatMessage({
                      id:
                        item == "币币"
                          ? "钱包账户"
                          : item == "合约"
                          ? "合约账户"
                          : "",
                    })}
                  </span>
                </Grid>
              );
            })}
          </Grid>
          <SwipeableViews
            animateHeight
            enableMouseEvents
            index={this.state.tab}
            onChangeIndex={this.handleStepChange}
            className={classes.tabs}
          >
            {this.state.functions.map((item) => {
              if (item == "币币") {
                return (
                  <div key={item} className={classes.infobox}>
                    <div className={classes.info} key={item}>
                      {/* <h3>
                        {this.props.intl.formatMessage({ id: "钱包资产" })}
                      </h3> */}
                      <p>
                        {this.props.intl.formatMessage({ id: "钱包资产折合" })}(
                        {this.props.total_asset
                          ? this.props.total_asset.unit
                          : ""}
                        )
                      </p>
                      <h2>
                        {this.props.total_asset &&
                        this.props.total_asset.coinAsset &&
                        this.props.rates &&
                        this.props.rates[this.props.total_asset.unit]
                          ? helper.digits(this.props.total_asset.coinAsset, 8)
                          : ""}
                        <strong>{` ≈ ${cRates2[0]}${cRates2[1]}`}</strong>
                      </h2>
                      {/* <p>{`≈ ${cRates2[0]}${cRates2[1]}`}</p> */}
                    </div>
                  </div>
                );
              }
              if (item == "合约") {
                return (
                  <div key={item} className={classes.infobox}>
                    <div className={classes.info} key={item}>
                      {/* <h3>
                        {this.props.intl.formatMessage({ id: "合约资产" })}
                      </h3> */}
                      <p>
                        {this.props.intl.formatMessage({ id: "合约资产折合" })}(
                        {this.props.total_asset
                          ? this.props.total_asset.unit
                          : ""}
                        )
                      </p>
                      <h2>
                        {this.props.total_asset &&
                        this.props.total_asset.futuresCoinAsset &&
                        this.props.rates &&
                        this.props.rates[this.props.total_asset.unit]
                          ? helper.digits(
                              this.props.total_asset.futuresCoinAsset,
                              8
                            )
                          : ""}
                        <strong>{` ≈ ${cRates3[0]}${cRates3[1]}`}</strong>
                      </h2>
                      {/* <p>{`≈ ${cRates3[0]}${cRates3[1]}`}</p> */}
                    </div>
                  </div>
                );
              }
            })}
          </SwipeableViews>
        </Grid>
        {this.state.functions[this.state.tab] == "币币" ? (
          <Grid container className={classes.content}>
            <Grid item xs={6}>
              <Button
                color="primary"
                onClick={this.changeCoin}
                name="hideZero"
                className={classnames(
                  classes.button,
                  this.state.hideZero ? "select" : ""
                )}
              >
                {this.props.intl.formatMessage({ id: "隐藏小额币种" })}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <TextField
                placeholder={this.props.intl.formatMessage({ id: "搜索币种" })}
                name="search"
                autoComplete="off"
                value={this.state.search}
                onChange={this.handleChange}
                className={classes.input}
                InputProps={{
                  classes: { root: classes.inputHeight },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconfont type="search" size="24" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        <ul className={classes.list}>
          {(this.state.functions[this.state.tab] == "币币"
            ? data
            : this.state.functions[this.state.tab] == "合约"
            ? future_data
            : []
          ).map((item, index) => {
            const btcRates = helper.currencyValue(
              this.props.rates,
              item.btcValue,
              "BTC"
            );
            return this.state.functions[this.state.tab] == "币币" ? (
              <li key={index} onClick={this.goto.bind(this, item)}>
                <h2>{item.tokenName}</h2>
                <div className={classes.item}>
                  <div>
                    <label>
                      {this.props.intl.formatMessage({ id: "可用" })}
                    </label>
                    <p>{helper.digits(item.free, 8)}</p>
                  </div>
                  <div>
                    <label>
                      {this.props.intl.formatMessage({ id: "冻结" })}
                    </label>
                    <p>{helper.digits(item.locked, 8)}</p>
                  </div>
                  <div>
                    <label>
                      {this.props.intl.formatMessage({ id: "折合" })}(
                      {btcRates[0] || "--"})
                    </label>
                    <p>{btcRates[1]}</p>
                  </div>
                </div>
              </li>
            ) : (
              <li key={index}>
                <h2>{item.tokenName}</h2>
                <div className={classes.item}>
                  <div>
                    <label>
                      {this.props.intl.formatMessage({ id: "可用保证金" })}
                    </label>
                    <p>{helper.digits(item.availableMargin, 8)}</p>
                  </div>
                  <div>
                    <label>
                      {this.props.intl.formatMessage({ id: "仓位保证金" })}
                    </label>
                    <p>{helper.digits(item.positionMargin, 8)}</p>
                  </div>
                  <div>
                    <label>
                      {this.props.intl.formatMessage({ id: "委托保证金" })}
                    </label>
                    <p>{helper.digits(item.orderMargin, 8)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <TransferModal
          open={this.state.open}
          source_type={
            this.state.functions[this.state.tab] == "币币"
              ? this.props.account_future_index
              : this.props.account_coin_index
          }
          target_type={
            this.state.functions[this.state.tab] == "币币"
              ? this.props.account_coin_index
              : this.props.account_future_index
          }
          onCancel={this.change(false)}
          // token_id={token2_name}
          {...otherProps}
        />
        <Drawer
          anchor="left"
          open={this.state.anchor}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)}
          classes={{
            paper: classes.drawer_modal,
          }}
        >
          <div>
            <div className={classes.search_area}>
              <TextField
                placeholder={this.props.intl.formatMessage({ id: "搜索币种" })}
                name="search"
                autoComplete="off"
                value={this.state.search}
                onChange={this.handleChange}
                // className={classes.input}
                InputProps={{
                  classes: { root: classes.inputHeight },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconfont type="search" size="24" />
                    </InputAdornment>
                  ),
                }}
              />
              <Iconfont
                type="close"
                size="20"
                onClick={this.toggleDrawer(false)}
              />
            </div>
            <ul className={classes.drawer}>
              {data.map((item, index) => {
                return (
                  <li key={index} onClick={this.goto.bind(this, item)}>
                    {item.tokenName}
                  </li>
                );
              })}
            </ul>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
