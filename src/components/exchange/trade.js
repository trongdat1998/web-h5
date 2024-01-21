// 交易页
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Button,
  TextField,
  Slider,
  CircularProgress,
} from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import vali from "../../utils/validator";
import math from "../../utils/mathjs";
import CONST from "../../config/const";
import cookie from "../../utils/cookie";
import route_map from "../../config/route_map";

class TradeRC extends React.Component {
  constructor() {
    super();
    this.state = {
      max: 999999999,
      slider: 0,
      subed: false,
      firstPrice: false,
    };
  }
  componentDidMount() {
    if (cookie.read("account_id")) {
      this.httpAction();
    }
    const search = this.props.history.location.search;
    if (/side=sell/i.test(search)) {
      this.props.dispatch({
        type: "exchange/save",
        payload: {
          order_side: "SELL",
        },
      });
    }
  }
  componentDidUpdate(preProps) {
    if (this.props.ws && !this.state.subed) {
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
    const symbol_quote = this.props.symbol_quote;
    const quote =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]
        : {};
    if (
      quote.c &&
      (!this.state.firstPrice || preProps.symbol_id != this.props.symbol_id)
    ) {
      this.setState(
        {
          firstPrice: true,
        },
        () => {
          this.props.dispatch({
            type: "exchange/save",
            payload: {
              buy_price: quote.c || this.props.buy_price,
              sell_price: quote.c || this.props.sell_price,
              buy_quantity: "",
              sell_quantity: "",
            },
          });
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
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data &&
      data.data &&
      data.data.length &&
      WSDATA.setData("user_balance_source", data.data);
  };
  changePriceType = (e) => {
    this.changeSide("order_type", e.target.value)();
  };
  changeSide = (key, n) => (e) => {
    const symbol_quote = this.props.symbol_quote;
    const quote =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]
        : {};
    this.props.dispatch({
      type: "exchange/save",
      payload: {
        [key]: n,
        buy_price: quote.c || this.props.buy_price,
        sell_price: quote.c || this.props.sell_price,
        buy_max:
          n == "market" ? this.props.token2_quantity : this.props.buy_max,
        buy_quantity: "",
        sell_quantity: "",
      },
    });
    this.setState({
      slider: 0,
    });
  };
  // 滑动条滑动
  sliderChange = (e, v) => {
    this.setState({
      slider: v,
    });
    if (
      this.props.order_side == "BUY" &&
      this.props.buy_price &&
      this.props.buy_max
    ) {
      this.props.dispatch({
        type: "exchange/save",
        payload: {
          buy_quantity: helper.digits(
            math
              .chain(v)
              .divide(100)
              .multiply(math.bignumber(this.props.buy_max))
              .format({ notation: "fixed" })
              .done(),
            this.props.order_type == "market"
              ? this.props.quote_precision
              : this.props.base_precision
          ),
        },
      });
    }
    if (this.props.order_side == "SELL" && this.props.token1_quantity) {
      this.props.dispatch({
        type: "exchange/save",
        payload: {
          sell_quantity: helper.digits(
            math
              .chain(v)
              .divide(100)
              .multiply(math.bignumber(this.props.token1_quantity))
              .format({ notation: "fixed" })
              .done(),
            this.props.base_precision
          ),
        },
      });
    }
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
  // 精度是否相等
  // d 100,10,1,0,0.1,0.01
  equalDigit = (v, d) => {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    let s = `${v}`.split(".");
    s = s[1] || "";
    if (d - 1 >= 0 || d == 0) {
      if (s.length > 0 || v < d) {
        return false;
      } else {
        return true;
      }
    }
    if (s.length > CONST["depth"][d]) return false;
    return true;
  };
  // 是否为精度整倍数
  // d  100，10，1，0.1，0.01，0.001
  multipleDigit = (v, d) => {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    const r = math
      .chain(math.bignumber(v))
      .divide(d)
      .format({ notation: "fixed" })
      .done();
    if (!vali.isInt(r)) {
      return false;
    }
    return true;
  };
  /**
   * 输入框判断
   * 1、价格精度判断，
   * 2、数量精度
   * 3、金额精度
   */
  handleChange = (e) => {
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
      let data = {
        [n]: "",
      };
      this.props.dispatch({
        type: "exchange/handleChange",
        payload: data,
      });
      return;
    }
    if (v && !vali.isFloat(v)) {
      return;
    }

    let data = {
      [n]: v ? v : "",
    };
    let slider = this.state.slider;

    // 买入价格
    // 精度判断
    // <= max
    if (n == "buy_price") {
      let d = v ? (Number(v) >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(
        `${d}`,
        CONST["depth"][this.props.min_price_precision]
      );
      data[n] = d;
      data.buy_auto = true;

      // 重新计算最大值
      data["buy_max"] =
        Number(d) && Number(this.props.token2_quantity)
          ? helper.digits(
              math
                .chain(math.bignumber(this.props.token2_quantity))
                .divide(math.bignumber(d))
                .format({ notation: "fixed" })
                .done(),
              this.props.base_precision
            )
          : 0;

      // 如果有数量，重新计算进度条的值
      if (
        (Number(this.props.buy_quantity) ||
          Number(this.props.buy_quantity) === 0) &&
        data["buy_max"]
      ) {
        let progress = Number(data["buy_max"])
          ? math
              .chain(this.props.buy_quantity)
              .divide(data["buy_max"])
              .multiply(100)
              .format({ notation: "fixed" })
              .done()
          : 0;
        slider = Math.max(0, Math.min(100, progress));
      }
    }
    // 买入数量
    // 精度判断,重置进度条
    // <= max
    if (n == "buy_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(
        d,
        this.props.order_type == "market"
          ? this.props.quote_precision
          : this.props.base_precision
      );
      if (d && Number(this.props.buy_max) && this.props.buy_price) {
        slider = Math.min(
          100,
          math
            .chain(d)
            .divide(this.props.buy_max)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      data = {
        [n]: d || d === 0 ? d : "",
      };
    }

    // 卖出价格
    // 精度判断
    // <= max
    if (n == "sell_price") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][this.props.min_price_precision]);
      data[n] = d;
      data.sell_auto = true;
    }
    // 卖出数量
    // 精度判断
    // <= max
    if (n == "sell_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      if (d && Number(this.props.token1_quantity)) {
        slider = Math.min(
          100,
          math
            .chain(d)
            .divide(this.props.token1_quantity)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      data = {
        [n]: d,
      };
    }
    this.setState({
      slider,
    });
    this.props.dispatch({
      type: "exchange/handleChange",
      payload: {
        ...data,
      },
    });
  };
  /**
   * 下单验证规则
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
  orderCreate = (order_type, order_side) => {
    // 最小交易价格, 最小交易数量 不存在,拒绝交易
    if (
      (!this.props.min_price_precision &&
        this.props.min_price_precision !== 0) ||
      (!this.props.min_trade_quantity && this.props.min_trade_quantity !== 0)
    ) {
      window.console.warn(
        "最小交易价格, 最小交易数量 不存在",
        this.props.min_price_precision,
        this.props.min_trade_quantity
      );
      this.props.enqueueSnackbar(
        this.props.intl.formatMessage({
          id: "价格错误，请重新输入",
        }),
        { variant: "error" }
      );
      return;
    }

    // sale
    if (order_side === "SELL") {
      // 价格不存在或=0
      if (!Number(this.props.sell_price) && order_type == "limit") {
        window.console.warn("价格不存在", this.props.sell_price);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出价格不正确",
          }),
          { variant: "error" }
        );
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.sell_price) <
          Number(this.props.min_price_precision) &&
        order_type == "limit"
      ) {
        window.console.warn(
          "价格小于最小值",
          this.props.sell_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出价格不能小于",
          }) + this.props.min_price_precision,
          { variant: "error" }
        );
        return;
      }
      // 价格大于最大值
      if (
        Number(this.props.sell_price) > this.state.max &&
        order_type == "limit"
      ) {
        window.console.warn(
          "价格大于最大值",
          this.props.sell_price,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出价格不能大于",
          }) + this.state.max,
          { variant: "error" }
        );
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.sell_price),
          this.props.min_price_precision
        ) &&
        order_type == "limit"
      ) {
        window.console.warn(
          "价格精度不正确",
          this.props.sell_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出价格精度不正确",
          }),
          { variant: "error" }
        );
        return;
      }

      // 卖出数量不存在
      if (!Number(this.props.sell_quantity)) {
        window.console.warn("卖出数量不存在", this.props.sell_quantity);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出数量不正确",
          }),
          { variant: "error" }
        );
        return;
      }
      // 卖出数量小于最小值
      if (
        Number(this.props.sell_quantity) < Number(this.props.min_trade_quantity)
      ) {
        window.console.warn(
          "卖出数量小于最小值",
          this.props.sell_quantity,
          this.props.min_trade_quantity
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出数量不能小于",
          }) + this.props.min_trade_quantity,
          { variant: "error" }
        );
        return;
      }
      // 卖出数量大于最大值
      if (Number(this.props.sell_quantity) > this.state.max) {
        window.console.warn(
          "卖出数量大于最大值",
          this.props.sell_quantity,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出数量不能大于",
          }) + this.state.max,
          { variant: "error" }
        );
        return;
      }
      // 数量大于最大值
      if (
        Number(this.props.sell_quantity) > Number(this.props.token1_quantity)
      ) {
        window.console.warn(
          "数量大于最大值",
          this.props.sell_quantity,
          this.props.token1_quantity
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "卖出数量超出余额",
          }),
          { variant: "error" }
        );
        return;
      }
      // 数量精度不正确, 非整倍数
      if (
        !this.equalDigit(
          Number(this.props.sell_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.sell_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.warn(
          "数量精度不正确",
          this.props.sell_quantity,
          this.props.base_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量精度不正确",
          }),
          { variant: "error" }
        );
        return;
      }
    }
    // buy
    if (order_side === "BUY") {
      // 价格不存在或=0
      if (!Number(this.props.buy_price) && order_type == "limit") {
        window.console.warn("价格不存在", this.props.buy_price);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入价格不正确",
          }),
          { variant: "error" }
        );
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.buy_price) < Number(this.props.min_price_precision) &&
        order_type == "limit"
      ) {
        window.console.warn(
          "价格小于最小值",
          this.props.buy_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入价格不能小于",
          }) + this.props.min_price_precision,
          { variant: "error" }
        );
        return;
      }
      // 价格大于最大值
      if (
        Number(this.props.buy_price) > Number(this.state.max) &&
        order_type == "limit"
      ) {
        window.console.warn(
          "价格大于最大值",
          this.props.buy_price,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入价格不能大于",
          }) + this.state.max,
          { variant: "error" }
        );
        return;
      }

      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_price),
          this.props.min_price_precision
        ) &&
        order_type == "limit"
      ) {
        window.console.warn(
          "价格精度不正确",
          this.props.buy_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入价格精度不正确",
          }),
          { variant: "error" }
        );
        return;
      }

      // 数量不存在
      if (!Number(this.props.buy_quantity)) {
        window.console.warn("数量不存在", this.props.buy_quantity);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入数量不正确",
          }),
          { variant: "error" }
        );
        return;
      }
      // 数量精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_quantity),
          math
            .chain(
              math.pow(
                10,
                math.bignumber(
                  this.props.order_type == "market"
                    ? -this.props.quote_precision
                    : -this.props.base_precision
                )
              )
            )
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.buy_quantity),
          math
            .chain(
              math.pow(
                10,
                math.bignumber(
                  this.props.order_type == "market"
                    ? -this.props.quote_precision
                    : -this.props.base_precision
                )
              )
            )
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.warn(
          "数量精度不正确",
          this.props.buy_quantity,
          this.props.order_type == "market"
            ? this.props.quote_precision
            : this.props.base_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入数量精度不正确",
          }),
          { variant: "error" }
        );
        return;
      }
      // 数量小于最小值
      if (
        Number(this.props.buy_quantity) <
        Number(
          this.props.order_type == "market"
            ? this.props.min_trade_amount
            : this.props.min_trade_quantity
        )
      ) {
        window.console.warn(
          "数量小于最小值",
          this.props.buy_quantity,
          this.props.order_type == "market"
            ? this.props.min_trade_amount
            : this.props.min_trade_quantity
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入数量不能小于",
          }) +
            (this.props.order_type == "market"
              ? this.props.min_trade_amount
              : this.props.min_trade_quantity),
          { variant: "error" }
        );
        return;
      }
      // 数量大于最大值
      if (Number(this.props.buy_quantity) > this.state.max) {
        window.console.warn(
          "数量大于最大值",
          this.props.buy_quantity,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入数量不能大于",
          }) + this.state.max,
          { variant: "error" }
        );
        return;
      }
      // // buy_max 为0
      // if (!this.props.buy_max) {
      //   window.console.warn("买入最大值不存在", this.props.buy_max);
      //   this.props.enqueueSnackbar(
      //     this.props.intl.formatMessage({
      //       id: "买入数量不正确"
      //     })
      //   );
      //   return;
      // }
      // 数量大于buy_max
      if (
        this.props.buy_max &&
        Number(this.props.buy_quantity) > this.props.buy_max &&
        order_type == "limit"
      ) {
        window.console.warn(
          "数量大于买入最大值",
          this.props.buy_quantity,
          this.props.buy_max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "买入数量超出余额",
          }),
          { variant: "error" }
        );
        return;
      }
    }
    this.props.dispatch({
      type: "exchange/createOrder",
      payload: {
        type: order_type,
        side: order_side,
        price:
          order_side == "SELL" ? this.props.sell_price : this.props.buy_price,
        quantity:
          order_side == "SELL"
            ? this.props.sell_quantity
            : this.props.buy_quantity,
        symbol_id: this.props.symbol_id,
        order_time: this.props.order_time,
        client_order_id: new Date().getTime(),
        account_id: this.props.userinfo.defaultAccountId,
        exchange_id: this.props.exchange_id,
      },
      enqueueSnackbar: this.props.enqueueSnackbar,
      success: () => {
        // 清空表单
        if (order_side === "SELL") {
          this.props.dispatch({
            type: "exchange/handleChange",
            payload: {
              sell_quantity: "",
            },
          });
        }
        if (order_side === "BUY") {
          this.props.dispatch({
            type: "exchange/handleChange",
            payload: {
              buy_quantity: "",
            },
          });
        }
        this.setState({
          slider: 0,
        });
        // 拉取最新资产
        // this.httpAction();
      },
    });
  };
  render() {
    const { classes, order_side, order_type } = this.props;
    const token1 = this.props.token1;
    const token2 = this.props.token2;
    const token1_name = this.props.token1_name;
    const token2_name = this.props.token2_name;
    const buy_amount = helper.digits(
      math
        .chain(math.bignumber(this.props.buy_price || 0))
        .multiply(math.bignumber(this.props.buy_quantity || 0))
        .format({ notation: "fixed" })
        .done(),
      this.props.max_digits
    );
    const buy_amount_rates = helper.currencyValue(
      this.props.rates,
      (this.props.buy_price || 0) * (this.props.buy_quantity || 0),
      token2,
      this.props.unit
    );
    const sell_amount = helper.digits(
      math
        .chain(math.bignumber(this.props.sell_price || 0))
        .multiply(math.bignumber(this.props.sell_quantity || 0))
        .format({ notation: "fixed" })
        .done(),
      this.props.max_digits
    );
    const sell_amount_rates = helper.currencyValue(
      this.props.rates,
      (this.props.sell_price || 0) * (this.props.sell_quantity || 0),
      token2,
      this.props.unit
    );
    return (
      <div className={classes.trade}>
        <Grid container>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={
                order_side == "BUY" ? classes.greenBtn : classes.defaultBtn
              }
              onClick={this.changeSide("order_side", "BUY")}
            >
              {this.props.intl.formatMessage({ id: "买入" })}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={
                order_side == "SELL" ? classes.redBtn : classes.defaultBtn
              }
              onClick={this.changeSide("order_side", "SELL")}
            >
              {this.props.intl.formatMessage({ id: "卖出" })}
            </Button>
          </Grid>
        </Grid>
        <div className={classes.order_type}>
          <select
            style={{ width: "100%", height: "100%", opacity: 0 }}
            value={order_type}
            onChange={this.changePriceType}
          >
            <option value={"limit"}>
              {this.props.intl.formatMessage({ id: "限价" })}
            </option>
            <option value={"market"}>
              {this.props.intl.formatMessage({ id: "市价" })}
            </option>
          </select>
          <Grid
            container
            justify="space-between"
            className={classes.order_type_info}
          >
            <Grid item>
              {this.props.intl.formatMessage({
                id: order_type == "limit" ? "限价" : "市价",
              })}
            </Grid>
            <Grid item>
              <Iconfont type="arrowDown" size="16" />
            </Grid>
          </Grid>
        </div>

        {order_side == "BUY" ? (
          order_type == "limit" ? (
            <TextField
              name="buy_price"
              fullWidth
              value={this.props.buy_price}
              variant="outlined"
              disabled={order_type == "market" ? true : false}
              onChange={this.handleChange}
              classes={{
                root: classes.input,
              }}
              InputProps={{
                endAdornment: (
                  <span className={classes.grey500}>{token2_name}</span>
                ),
              }}
            />
          ) : (
            <TextField
              fullWidth
              value={this.props.intl.formatMessage({
                id: "以当前最优价格交易",
              })}
              variant="outlined"
              disabled={true}
              classes={{
                root: classes.input,
              }}
            />
          )
        ) : order_type == "limit" ? (
          <TextField
            name="sell_price"
            fullWidth
            variant="outlined"
            disabled={order_type == "market" ? true : false}
            value={this.props.sell_price}
            onChange={this.handleChange}
            classes={{
              root: classes.input,
            }}
            InputProps={{
              endAdornment: (
                <span className={classes.grey500}>{token2_name}</span>
              ),
            }}
          />
        ) : (
          <TextField
            fullWidth
            value={this.props.intl.formatMessage({
              id: "以当前最优价格交易",
            })}
            variant="outlined"
            disabled={true}
            classes={{
              root: classes.input,
            }}
          />
        )}
        <div className={classes.order_type}>
          <Grid
            container
            justify="space-between"
            className={classes.order_type_info}
          >
            <Grid item>
              {this.props.intl.formatMessage({
                id:
                  order_type == "market" && order_side == "BUY"
                    ? "金额"
                    : "数量",
              })}
            </Grid>
          </Grid>
        </div>
        {order_side == "BUY" ? (
          <TextField
            name="buy_quantity"
            fullWidth
            variant="outlined"
            value={this.props.buy_quantity}
            onChange={this.handleChange}
            classes={{
              root: classes.input,
            }}
            InputProps={{
              endAdornment: (
                <span className={classes.grey500}>
                  {order_type == "market" ? token2_name : token1_name}
                </span>
              ),
            }}
          />
        ) : (
          <TextField
            name="sell_quantity"
            fullWidth
            variant="outlined"
            value={this.props.sell_quantity}
            onChange={this.handleChange}
            classes={{
              root: classes.input,
            }}
            InputProps={{
              endAdornment: (
                <span className={classes.grey500}>{token1_name}</span>
              ),
            }}
          />
        )}
        <Grid container justify="space-between" className={classes.balance}>
          <Grid item>{this.props.intl.formatMessage({ id: "可用" })}</Grid>
          <Grid item>
            {order_side == "BUY"
              ? this.props.token2_quantity
                ? helper.digits(
                    this.props.token2_quantity,
                    this.props.quote_precision
                  )
                : "--"
              : this.props.token1_quantity
              ? helper.digits(
                  this.props.token1_quantity,
                  this.props.base_precision
                )
              : "--"}
            {order_side == "BUY" ? token2_name : token1_name}
          </Grid>
        </Grid>
        <Slider
          marks={[
            {
              value: 0,
            },
            {
              value: 25,
            },
            {
              value: 50,
            },
            {
              value: 75,
            },
            {
              value: 100,
            },
          ]}
          min={0}
          max={100}
          step={1}
          value={this.state.slider}
          onChange={this.sliderChange}
          classes={{
            rail: classes.rail,
            mark: classes.mark,
            markActive: classes.markActive,
            root: classes.slider,
          }}
        />
        <div className={classes.amount}>
          {order_type == "limit" ? (
            <strong>
              {order_side == "BUY" ? buy_amount : sell_amount}
              {token2_name}
            </strong>
          ) : (
            <strong>{this.props.intl.formatMessage({ id: "金额" })}</strong>
          )}
          {order_type == "limit" ? (
            <span>
              {order_side == "BUY"
                ? `${buy_amount_rates[0]}${buy_amount_rates[1]}`
                : `${sell_amount_rates[0]}${sell_amount_rates[1]}`}
            </span>
          ) : (
            <span>--</span>
          )}
        </div>
        {this.props.userinfo.userId ? (
          Boolean(this.props.loading.effects["exchange/createOrder"]) ? (
            <Button fullWidth disabled>
              <CircularProgress size={24} color="primary" />
            </Button>
          ) : (
            <Button
              fullWidth
              disabled={Boolean(
                this.props.loading.effects["exchange/createOrder"]
              )}
              className={
                order_side == "BUY" ? classes.greenBtn2 : classes.redBtn2
              }
              onClick={this.orderCreate.bind(this, order_type, order_side)}
            >
              {this.props.intl.formatMessage({
                id: order_side == "BUY" ? "买入" : "卖出",
              })}{" "}
              {token1_name}
            </Button>
          )
        ) : (
          <Button
            fullWidth
            color="primary"
            variant="contained"
            href={
              route_map.login +
              "?redirect=" +
              encodeURIComponent(window.location.href)
            }
          >
            {this.props.intl.formatMessage({ id: "登录" })}
          </Button>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TradeRC));
