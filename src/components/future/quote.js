// 合约行情页
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Button
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import KlineRC from "./kline";
import CONST from "../../config/const";
import DepthRC from "./depth";
import Handicap from "./handicap";
import TradeRC from "./lastTrading";
import route_map from "../../config/route_map";

class IndexRC extends React.Component {
  constructor() {
    super();
    this.state = { subed: false, value: 0 };
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true
        },
        () => {
          this.props.qws.sub(
            {
              id: "broker",
              topic: "slowBroker",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary)
              }
            },
            this.httpAction,
            this.callback
          );
        }
      );
    }
  }
  httpAction = payload => {
    return this.props.dispatch({
      type: "ws/broker_quote_http",
      payload
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
  callback = data => {
    data.data &&
      data.data.length &&
      WSDATA.setData("symbol_quote_source", data.data);
  };
  init = () => {
    const symbol_id = (this.props.match.params.symbol_id || "").toUpperCase();
    const future_info = this.props.config.symbols_obj.all[symbol_id] || {};
    const exchange_id = future_info.exchangeId;

    let token2 = future_info.quoteTokenId;
    let token2_name = future_info.quoteTokenName;

    // const order_setting =
    //   this.props.order_setting[symbol_id.toUpperCase()] || {};
    // let buy_risk = "";
    // let sale_risk = "";
    // (order_setting.riskLimit || []).map(item => {
    //   if (item.side == "BUY_OPEN") {
    //     buy_risk = item.riskLimitId;
    //   }
    //   if (item.side == "SELL_OPEN") {
    //     sale_risk = item.riskLimitId;
    //   }
    // });

    WSDATA.clearAll("qws");
    this.props.dispatch({
      type: "ws/save",
      payload: {
        merged_depth: {},
        depth: {},
        trades: {}
      }
    });

    this.props.dispatch({
      type: "future/save",
      payload: {
        symbol_id: symbol_id, // 币对id
        exchange_id: exchange_id,

        // sale_quantity: "",
        // //sale_price: tokenInfo.c || "",
        // sale_lever: null, // 杠杠dom节点
        // sale_type: 0, // 0= 限价， 1 = 计划委托
        // sale_price_type: 0, // 价格类型 : price_types[n]
        // sale_trigger_price: "", // 计划委托触发价格
        // // sale_leverage:
        // //   window.localStorage[sale] || future_info.baseTokenFutures.levers[0], // 杠杆值
        // sale_progress: 0, // 买入进度条
        // sale_max: 0, // 限价买入最大值，根据用户价格进行计算
        // sale_risk, // 风险限额id

        // buy_quantity: "",
        // //buy_price: tokenInfo.c || "",
        // buy_lever: null, // 杠杠dom节点
        // buy_type: 0, // 0= 限价， 1 = 计划委托
        // buy_price_type: 0, // 价格类型 : price_types[n]
        // buy_trigger_price: "", // 计划委托触发价格
        // // buy_leverage:
        // //   window.localStorage[buy] || future_info.baseTokenFutures.levers[0], // 杠杆值
        // buy_progress: 0, // 买入进度条
        // buy_max: 0, // 限价买入最大值，根据用户价格进行计算
        // buy_risk, // 风险限额id

        digitMerge: (future_info.digitMerge || "").split(","),
        aggTrade_digits: CONST.depth[future_info.minPricePrecision],
        max_digits: CONST.depth[future_info.minPricePrecision],
        base_precision: CONST.depth[future_info.basePrecision], // 数量精度 如 8 表示小数留8位
        quote_precision: CONST.depth[future_info.quotePrecision], // 金额精度 如 8 表示小数留8位
        min_price_precision: future_info.minPricePrecision, // 价格交易step, 如 0.1
        min_trade_quantity: future_info.minTradeQuantity, // 数量交易step 如 0.1
        min_trade_amount: future_info.minTradeAmount, // 金额交易step  如 0.1

        token2,
        token2_name,
        future_info: future_info
      }
    });
  };
  goto = url => e => {
    window.open(url, "_blank");
  };
  back = () => {
    window.history.back();
    // window.location.href =
    //   route_map.trade +
    //   "/" +
    //   this.props.exchange_id +
    //   "/" +
    //   this.props.token1 +
    //   "/" +
    //   this.props.token2;
  };
  handleChangeIndex = n => {
    this.setState({
      value: n
    });
  };
  handleChange = (e, n) => {
    this.setState({
      value: n
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const symbol_quote = this.props.symbol_quote;
    const future_info = this.props.match.params.symbol_id
      ? this.props.config.symbols_obj.all[
          this.props.match.params.symbol_id.toUpperCase()
        ]
      : {};
    const quote =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]
        : {};
    const cRates =
      future_info.baseTokenFutures && quote.c
        ? helper.currencyValue(
            this.props.rates,
            quote.c,
            future_info.baseTokenFutures.displayTokenId,
            this.props.unit
          )
        : ["", ""];
    return (
      <div className={classes.exchange}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.exchange_nav}
        >
          <Grid item style={{ lineHeight: "24px" }} onClick={this.back}>
            <Iconfont type="back" size="24" style={{ float: "left" }} />
            {future_info.symbolName}
          </Grid>
          <Grid></Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          className={classes.exchange_realtime}
        >
          <Grid item>
            <strong className={Number(quote.m) >= 0 ? "green" : "red"}>
              {quote.c}
            </strong>
            <span>
              ≈ {cRates[0]}
              {cRates[1]}
            </span>
            <i className={Number(quote.m) >= 0 ? "green" : "red"}>
              {quote.m ? Math.floor(Number(quote.m) * 10000) / 100 + "%" : ""}
            </i>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <span>{this.props.intl.formatMessage({ id: "高" })}</span>
              </Grid>
              <Grid item xs={8}>
                <label>{quote.h}</label>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <span>{this.props.intl.formatMessage({ id: "低" })}</span>
              </Grid>
              <Grid item xs={8}>
                <label>{quote.l}</label>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                <span>{this.props.intl.formatMessage({ id: "24H" })}</span>
              </Grid>
              <Grid item xs={8}>
                <label>{quote.v ? Math.floor(quote.v) : ""}</label>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <KlineRC {...otherProps} />
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className={classes.tabs_info}
        >
          <Tab
            className={classes.info_tab}
            label={this.props.intl.formatMessage({ id: "深度" })}
          />
          <Tab
            className={classes.info_tab}
            label={this.props.intl.formatMessage({ id: "成交" })}
          />
        </Tabs>
        <SwipeableViews
          animateHeight
          axis={"x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <div>
            <div>
              <div>
                <DepthRC className={classes.depthRC} {...otherProps} />
              </div>
            </div>
            <Handicap limit={20} {...otherProps} />
          </div>
          <div>
            <TradeRC {...otherProps} />
          </div>
        </SwipeableViews>
        <div style={{ height: 56 }}></div>
        <Grid container className={classes.exchange_btns} spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={classes.greenBtn2}
              href={route_map.future_trade + "/" + this.props.symbol_id}
              style={{ height: 50 }}
            >
              {this.props.intl.formatMessage({ id: "开多" })}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={classes.redBtn2}
              style={{ height: 50 }}
              href={
                route_map.future_trade +
                "/" +
                this.props.symbol_id +
                "?side=sell"
              }
            >
              {this.props.intl.formatMessage({ id: "开空" })}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
