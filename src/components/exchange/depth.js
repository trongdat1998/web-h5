// 交易页深度
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid } from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import Acc from "../../utils/acc";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      gap: 0,
      subed: false,
      limit: 100,
      color: {
        text: window.palette.grey[500],
        sell: window.palette.down.main,
        buy: window.palette.up.main,
      },
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.pageResize, false);
    this.reset();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.pageResize, false);
  }
  pageResize = () => {
    const width = this.des.parentNode.parentNode.offsetWidth * 2;
    if (width == this.state.width) return;
    this.reset();
  };
  componentDidUpdate(preProps, preState) {
    if (this.props.qws && !this.state.subed && this.props.max_digits) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.sub(this.props.exchange_id, this.props.symbol_id);
        }
      );
    }
    // symbol_id,exchange_id变化时，取消之前的订阅，重新订阅，重置digit
    if (
      (this.props.symbol_id != preProps.symbol_id ||
        this.props.exchange_id != preProps.exchange_id) &&
      preProps.symbol_id &&
      preProps.exchange_id
    ) {
      // 取消之前的订阅
      if (preProps.exchange_id && preProps.symbol_id) {
        this.cancel(preProps.exchange_id + "." + preProps.symbol_id);
      }
      // 重新订阅
      this.sub(this.props.exchange_id, this.props.symbol_id);
    }
    this.draw();
  }
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "ws/depth_http",
      payload: {
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        limit: this.state.limit,
      },
    });
  };
  /**
   * data={
   *   topic:'depth',
   *   params:{},
   *   f: true/false,
   *   id: 'mergedDepth2,
   *   shared: true/false,
   *   data:[{a:[ [120,1],[111,2] ],b:[ [12,3], [123,13] ]}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("depth_source", data.data, data.id);
  };
  sub = (exchange_id, symbol_id) => {
    this.props.qws.sub(
      {
        id: "depth" + exchange_id + "." + symbol_id,
        topic: "depth",
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        limit: this.state.limit,
        params: {
          binary: !Boolean(window.localStorage.ws_binary),
        },
      },
      this.httpAction,
      this.callback
    );
  };
  // 取消之前的订阅
  cancel = (id) => {
    if (this.props.qws && id) {
      this.props.qws.cancel(id);
    }
  };
  reset = (cb) => {
    const width = this.des.parentNode.parentNode.offsetWidth * 2;
    const height = this.des.parentNode.parentNode.offsetHeight * 2;

    this.des.setAttribute("width", width);
    this.des.setAttribute("height", height);

    const sizes = this.des.parentNode.parentNode.getBoundingClientRect();
    let data = {
      width,
      height,
      canvasPageX: Acc.add(sizes.left, window.pageXOffset),
      canvasPageY: Acc.add(sizes.top, window.pageYOffset),
      ctx: this.des.getContext("2d"),
    };
    this.setState(data, () => {
      this.draw();
    });
  };
  setDepthData = (data) => {
    let buy = data && data.b ? data.b : [];
    let sell = data && data.a ? data.a : [];
    let maxAmount = 0;
    let b = [];
    let s = [];

    for (let i = 0; i < Math.min(buy.length, this.state.limit); i++) {
      if (i > 0) {
        if (Math.abs((buy[i][0] - buy[0][0]) / buy[0][0]) <= 0.6) {
          b.push([...buy[i], Number(b[b.length - 1][2]) + Number(buy[i][1])]);
          maxAmount = Math.max(maxAmount, b[b.length - 1][2]);
        }
      } else {
        b[0] = [...buy[0], Number(buy[0][1])];
        maxAmount = Number(b[0][2]);
      }
    }
    for (let i = 0; i < Math.min(sell.length, this.state.limit); i++) {
      if (i > 0) {
        if (Math.abs((sell[i][0] - sell[0][0]) / sell[0][0]) <= 0.6) {
          s.push([...sell[i], Number(s[s.length - 1][2]) + Number(sell[i][1])]);
          maxAmount = Math.max(maxAmount, s[s.length - 1][2]);
        }
      } else {
        s[0] = [...sell[0], Number(sell[0][1])];
        maxAmount = Math.max(maxAmount, s[0][2]);
      }
    }
    return {
      sell: s,
      buy: b,
      maxAmount: maxAmount * 1.1,
    };
  };
  draw = () => {
    // 价格精度
    const max_digits = this.props.max_digits || 4;
    // 数量精度
    const base_precision = this.props.base_precision || 4;

    let { width, gap, height, color } = this.state;
    let datas = this.props.depth[
      "depth" + this.props.exchange_id + "." + this.props.symbol_id
    ];
    if (!datas) {
      this.fristPrice.innerText = "--";
      this.secondPrice.innerText = "--";
      this.maxAmount.innerText = "--";
      this.halfAmount.innerText = "--";
      this.zeroAmount.innerText = "--";
      this.clear();
      return;
    }
    let { sell, buy, maxAmount } = this.setDepthData(datas);
    this.fristPrice.innerText =
      buy && buy.length
        ? helper.digits(buy[buy.length - 1][0], max_digits)
        : "--";
    this.secondPrice.innerText =
      sell && sell.length
        ? helper.digits(sell[sell.length - 1][0], max_digits)
        : "--";
    this.maxAmount.innerText = maxAmount
      ? helper.digits(maxAmount, base_precision)
      : "--";
    this.halfAmount.innerText = maxAmount
      ? helper.digits(maxAmount / 2, base_precision)
      : "--";
    this.zeroAmount.innerText = maxAmount ? 0 : "--";

    let context = this.des.getContext("2d");

    const min_buy_price = buy.length ? buy[buy.length - 1][0] : 0;
    const max_buy_price = buy.length ? buy[0][0] : 0;
    const fix_buy = max_buy_price - min_buy_price;
    const min_sell_price = sell.length ? sell[0][0] : 0;
    const max_sell_price = sell.length ? sell[sell.length - 1][0] : 0;
    const fix_sell = max_sell_price - min_sell_price;

    let x = 0,
      y = 0;
    if (buy.length) {
      //开始一个连续绘制路径
      context.beginPath();
      //从中间向上、向左绘制买单图 buy
      let total = 0; // 累计数量
      for (let i = 0; i < buy.length; i++) {
        x =
          (width / 2 - gap) *
          (fix_buy ? 1 - (max_buy_price - buy[i][0]) / fix_buy : 0);
        y = height - (buy[i][2] / maxAmount) * height;
        if (i === 0) {
          context.moveTo(width / 2, height);
          x = width / 2;
        }
        context.lineTo(x, y);
      }

      context.lineTo(0, y); //延伸到最左侧边缘
      context.lineTo(0, height);
      context.lineTo(width / 2, height);

      context.fillStyle = color.buy; //设置买入区域填充颜色

      context.fill(); //形成一个封装区域 并按fillStyle指定的颜色填充
      context.closePath();
    }
    //同上 开始绘制卖单深度图 sell
    if (sell.length) {
      context.beginPath();

      for (let i = 0; i < sell.length; i++) {
        x =
          width / 2 +
          (width / 2) *
            (fix_sell ? 1 - (max_sell_price - sell[i][0]) / fix_sell : 0) +
          gap;
        y = height - (sell[i][2] / maxAmount) * height;
        if (i === 0) {
          context.moveTo(width / 2, height);
          x = width / 2;
        }
        context.lineTo(x, y);
      }

      context.lineTo(width + gap, y);
      context.lineTo(width + gap, height);
      context.lineTo(width / 2, height);

      context.fillStyle = color.sell;

      context.fill();
      context.closePath();
    }
  };
  clear = () => {
    let ctx = this.des.getContext("2d");
    ctx.clearRect(0, 0, 30000, 30000);
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={this.props.className || classes.depth}>
        <canvas
          ref={(canvas) => (this.des = canvas)}
          style={{ width: "100%" }}
        />
        <Grid container justify="space-between" className={classes.depth_price}>
          <Grid item ref={(ref) => (this.fristPrice = ref)}></Grid>
          <Grid item ref={(ref) => (this.secondPrice = ref)}></Grid>
        </Grid>
        <Grid
          container
          className={classes.depth_amount}
          direction="column"
          justify="space-between"
        >
          <Grid item ref={(ref) => (this.maxAmount = ref)}></Grid>
          <Grid item ref={(ref) => (this.halfAmount = ref)}></Grid>
          <Grid item ref={(ref) => (this.zeroAmount = ref)}></Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
