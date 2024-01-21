// 平仓弹窗
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputAdornment
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import style from "./style";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import { message } from "../../lib";
import vali from "../../utils/validator";

class ModalPosition extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 99999999,
      buy_price: "",
      buy_price_msg: "",
      buy_price_type: 0,
      price_types: ["INPUT", "MARKET_PRICE", "OPPONENT", "QUEUE", "OVER"],
      price_types_desc: ["限价", "市价", "对手价", "排队价", "超价"],
      quantity: "",
      quantity_msg: ""
    };
  }
  componentDidUpdate(preProps) {
    if (!preProps.open && this.props.open) {
      const quotes = this.props.symbol_quote || {};
      const data = this.props.data || {};
      const q = quotes[data.symbolId] || {};
      this.setState({
        buy_price: q.c || ""
      });
    }
  }
  changePriceType = e => {
    this.setState({
      buy_price_type: e.target.value,
      buy_price_msg: ""
    });
  };
  resetQuantity = () => {
    const data = this.props.data;
    const available = Number(data.available);
    if (Number(this.state.quantity) > available) {
      this.setState({
        quantity: available
      });
    }
  };
  setTotalQuantity = () => {
    const data = this.props.data;
    const available = Number(data.available);
    this.setState({
      quantity: available
    });
  };
  /**
   * 下单验证规则
   * @param {string} order_side BUY|SELL
   * @param {boolean} where 下单按钮=true, 弹窗确认按钮=false
   * 限价买
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 限价卖
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 市价买
   * 金额：最小值(min_trade_amount)，精度(quote_precision)及精度倍数

   * 市价卖
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   *
   */
  orderCreate = async e => {
    const data = this.props.data;
    // let msg = "";
    if (this.state.buy_price_type == 0 && !this.state.buy_price) {
      this.setState({
        buy_price_msg: this.props.intl.formatMessage({ id: "请填写价格" })
      });
      return;
    }
    if (!this.state.quantity) {
      this.setState({
        quantity_msg: this.props.intl.formatMessage({ id: "请填写数量" })
      });
      return;
    }
    if (this.state.quantity > Math.abs(data.available)) {
      this.setState({
        quantity_msg:
          this.props.intl.formatMessage({ id: "平仓数量不能大于" }) +
          data.available
      });
      return;
    }
    // if (item.exitQuantity < item.minTradeQuantity) {
    //   this.changePositionInfo({
    //     id: item.positionId,
    //     name: "quantityMsg",
    //     value:
    //       this.props.intl.formatMessage({ id: "交易数量不能小于" }) +
    //       item.minTradeQuantity
    //   });
    //   return;
    // }

    // 确认弹窗
    // const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    // const order_setting = this.props.order_setting[symbolId];
    // if (
    //   order_setting &&
    //   order_setting.orderSetting &&
    //   Boolean(order_setting.orderSetting.isConfirm) &&
    //   where
    // ) {
    //   this.props.dispatch({
    //     type: "future/save",
    //     payload: {
    //       // order_side: this.props.order_sides.findIndex(
    //       //   item => item == order_side
    //       // ),
    //       modal_order: true
    //     }
    //   });
    //   return;
    // }
    const item = this.props.data;
    let params = {
      symbol_id: item.symbolId,
      side: Number(item.isLong) > 0 ? "SELL_CLOSE" : "BUY_CLOSE",
      type: "LIMIT",
      //trigger_price: "",
      price_type: this.state.price_types[this.state.buy_price_type],
      //leverage: item.leverage,
      //time_in_force: "",
      price: this.state.buy_price_type == 0 ? this.state.buy_price : "",
      quantity: this.state.quantity,
      exchange_id: item.exchangeId,
      client_order_id: new Date().getTime(),
      futures: true,
      order_side: item.positionId
    };
    this.props.dispatch({
      type: "future/createOrder",
      payload: params,
      success: () => {
        this.handleClose(false)();
      },
      enqueueSnackbar: this.props.enqueueSnackbar
    });
  };
  handleClose = type => e => {
    // 平仓
    if (type) {
      this.orderCreate();
      return;
    }
    // 取消
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_position: false
      }
    });
    this.setState({
      buy_price: "",
      buy_price_msg: "",
      buy_price_type: 0,
      price_types: ["INPUT", "MARKET_PRICE", "OPPONENT", "QUEUE", "OVER"],
      price_types_desc: ["限价", "市价", "对手价", "排队价", "超价"],
      quantity: "",
      quantity_msg: ""
    });
  };
  /**
   * 精度判断
   * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
   * @param {Number} digits   -10,-1,1,2,3,4
   */
  fix_digits = (v, digits) => {
    if (!digits) {
      return v ? Math.floor(v) : v;
    }
    if (!v && v !== 0) return v;
    if (digits <= 0) {
      return Math.floor(v);
    }
    let string_v = `${v}`;
    let d = string_v.split(".");
    if (!d[1] || d[1].length <= digits) {
      return string_v;
    }
    d[1] = d[1].split("");
    d[1].length = digits;
    d[1] = d[1].join("");
    return d[0] + "." + d[1];
  };
  /**
   * 输入框判断
   * 1、价格精度判断，
   * 2、数量精度
   * 3、金额精度
   */
  handleChange = e => {
    const t = e.target;
    const n = t.name;
    let v = t.type == "checkbox" ? t.checked : t.value;
    v = v
      .replace(/[^0-9\.]/, "")
      .replace(/^0{1,}/, "0")
      .replace(/^(0)([1-9])/, ($1, $2) => {
        return $2;
      })
      .replace(/^\./, "0.");
    if (!v) {
      this.setState({
        [n]: ""
      });
      return;
    }
    if (v && !vali.isFloat(v)) {
      return;
    }
    const data = this.props.data;
    const symbol_info = this.props.config.symbols_obj.all[data.symbolId];
    const min_price_precision = symbol_info
      ? symbol_info.minPricePrecision
      : "";
    const base_precision = symbol_info ? symbol_info.basePrecision : "";
    const available = Number(data.available);

    // 买入价格
    // 精度判断
    // <= max
    if (n == "buy_price") {
      let d = v ? (Number(v) >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(`${d}`, CONST["depth"][min_price_precision]);

      this.setState({
        buy_price: d,
        buy_price_msg: "",
        buy_auto: true
      });
    }

    // 买入数量
    // 精度判断,重置进度条
    // <= max
    if (n == "quantity") {
      let d = v ? (v >= available ? `${available}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][base_precision]);

      this.setState({
        quantity: d,
        quantity_msg: ""
      });
    }
  };

  render() {
    const { classes } = this.props;
    const data = this.props.data || {};
    const symbolId = data.symbolId || "";

    let symbol_info = this.props.config.symbols_obj.all[symbolId.toUpperCase()];

    return (
      <Dialog onClose={this.handleClose(false)} open={this.props.open}>
        <DialogTitle className={classes.sides}>
          {data.symbolName}{" "}
          <label
            className={Number(data.isLong) > 0 ? classes.green : classes.red}
          >
            {this.props.intl.formatMessage({
              id: Number(data.isLong) > 0 ? "多仓" : "空仓"
            })}{" "}
            {data.leverage + "X"}
          </label>
        </DialogTitle>

        <DialogContent>
          <Grid container style={{ margin: "10px 0 0" }} alignItems="flex-end">
            <Grid item style={{ flex: 1 }}>
              <TextField
                error={this.state.buy_price_msg ? true : false}
                className={classes.input}
                name="buy_price"
                value={this.state.buy_price}
                onChange={this.handleChange}
                disabled={Boolean(Number(this.state.buy_price_type))}
                placeholder={this.props.intl.formatMessage({
                  id: this.state.price_types_desc[this.state.buy_price_type]
                })}
                autoComplete="off"
                InputProps={{
                  classes: {
                    root: classes.filed,
                    disabled: classes.filed_diabled
                  }
                }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Select
                name="buy_price_type"
                value={this.state.buy_price_type}
                onChange={this.changePriceType}
                className={classes.filed}
              >
                {this.state.price_types.map((item, i) => {
                  return (
                    <MenuItem value={i} key={i}>
                      {this.props.intl.formatMessage({
                        id: this.state.price_types_desc[i]
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
          </Grid>
          <p style={{ margin: "0 0 10px", height: 20 }} className={classes.red}>
            {this.state.buy_price_msg}
          </p>
          <TextField
            className={classes.whole}
            value={this.state.quantity}
            autoComplete="off"
            onChange={this.handleChange}
            name="quantity"
            onBlur={this.resetQuantity}
            // placeholder={item.available}
            error={this.state.quantity_msg ? true : false}
            InputProps={{
              classes: { root: classes.filed },
              endAdornment: (
                <InputAdornment position="end">
                  <span className={classes.un} onClick={this.setTotalQuantity}>
                    {this.props.intl.formatMessage({
                      id: "全部"
                    })}
                  </span>
                </InputAdornment>
              )
            }}
            fullWidth
            helperText={this.state.quantity_msg}
          />
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.handleClose(false)}>
            {this.props.intl.formatMessage({ id: "取消" })}
          </Button>
          <Button color="primary" onClick={this.handleClose(true)}>
            {this.props.intl.formatMessage({ id: "平仓" })}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(style)(injectIntl(ModalPosition));
