// 交易页
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Drawer,
  ListItem,
  Button,
  List,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import CONST from "../../config/const";
import ModalRisk from "./modal_risk";
import ModalSetting from "./modal_setting";
import ModalCalculator from "./modal_calculator";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      quoteTokens: [],
      quoteToken: 0,
      open: false,
      anchorEl: null
    };
  }
  componentDidMount() {
    this.init();
    this.setState({
      quoteTokens: [...this.props.config.futuresUnderlying]
    });
  }
  init = () => {
    const symbol_id = (this.props.match.params.symbol_id || "").toUpperCase();

    let future_info = this.props.config.symbols_obj.all[symbol_id];
    const exchange_id = future_info.exchangeId;
    let token2 = future_info.quoteTokenId;
    let token2_name = future_info.quoteTokenName;
    const symbol_quote = this.props.symbol_quote;
    const tokenInfo = symbol_quote[symbol_id] || {};
    const buy =
      symbol_id.toUpperCase() + this.props.order_choose + "buy_leverage";
    const sale =
      symbol_id.toUpperCase() + this.props.order_choose + "sale_leverage";

    const order_setting =
      this.props.order_setting[symbol_id.toUpperCase()] || {};
    let buy_risk = "";
    let sale_risk = "";
    (order_setting.riskLimit || []).map(item => {
      if (item.side == "BUY_OPEN") {
        buy_risk = item.riskLimitId;
      }
      if (item.side == "SELL_OPEN") {
        sale_risk = item.riskLimitId;
      }
    });
    const len = future_info.baseTokenFutures.levers.length;

    this.props.dispatch({
      type: "future/save",
      payload: {
        symbol_id: symbol_id, // 币对id
        exchange_id: exchange_id,

        sale_quantity: "",
        sale_price: tokenInfo.c || "",
        sale_lever: null, // 杠杠dom节点
        sale_type: 0, // 0= 限价， 1 = 计划委托
        sale_price_type: 0, // 价格类型 : price_types[n]
        sale_trigger_price: "", // 计划委托触发价格
        sale_leverage:
          window.localStorage[sale] ||
          future_info.baseTokenFutures.levers[
            Math.max(0, Math.ceil(len / 2) - 1)
          ], // 杠杆值
        sale_progress: 0, // 买入进度条
        sale_max: 0, // 限价买入最大值，根据用户价格进行计算
        sale_risk, // 风险限额id

        buy_quantity: "",
        buy_price: tokenInfo.c || "",
        buy_lever: null, // 杠杠dom节点
        buy_type: 0, // 0= 限价， 1 = 计划委托
        buy_price_type: 0, // 价格类型 : price_types[n]
        buy_trigger_price: "", // 计划委托触发价格
        buy_leverage:
          window.localStorage[buy] ||
          future_info.baseTokenFutures.levers[
            Math.max(0, Math.ceil(len / 2) - 1)
          ], // 杠杆值
        buy_progress: 0, // 买入进度条
        buy_max: 0, // 限价买入最大值，根据用户价格进行计算
        buy_risk, // 风险限额id

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
  changeIndex = i => () => {
    this.setState({
      quoteToken: i
    });
  };
  close = () => {
    this.setState({
      open: !this.state.open
    });
  };
  goto = (exchangeId, symbolId) => () => {
    const url = route_map.future_trade + "/" + symbolId;
    this.props.history.push(url);
    this.close();
    setTimeout(() => {
      this.init();
    }, 0);
  };
  toExchange = url => e => {
    window.location.href = url;
  };
  handleClick = e => {
    this.setState({
      anchorEl: e.currentTarget
    });
  };
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };
  // 开发风险限额
  changeRisk = key => e => {
    this.handleClose();
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_risk: true,
        key_risk: key
      }
    });
  };
  openSetting = () => {
    this.handleClose();
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_setting: true
      }
    });
  };
  openStopLoss = () => {
    this.handleClose();
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_calculator: true
      }
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const symbol_quote = this.props.symbol_quote;
    const m =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]["m"]
        : 0;
    const data = [];
    const symbols_obj = this.props.config.symbols_obj || {};
    (Object.keys(symbols_obj.futures) || []).map(item => {
      const obj = symbols_obj.futures[item];
      if (
        obj &&
        obj.firstLevelUnderlyingId ==
          (this.state.quoteTokens[this.state.quoteToken] || {})["id"]
      ) {
        data.push(obj);
      }
    });
    // data.sort((a, b) => {
    //   return a.symbolId.toUpperCase() > b.symbolId.toUpperCase() ? 1 : -1;
    // });

    return (
      <div className={classes.tokenInfo}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          className={classes.token_info}
        >
          <Grid
            item
            alignItems="center"
            style={{ display: "flex" }}
            onClick={this.close}
          >
            <strong>{(this.props.future_info || {}).symbolName}</strong>
            <Iconfont type="arrowDown" size="24" />
          </Grid>
          <Grid item alignItems="center">
            <span className={Number(m) >= 0 ? classes.green : classes.red}>
              {Math.floor(Number(m) * 10000) / 100}%
            </span>{" "}
            <Iconfont
              type="candels"
              size="24"
              onClick={this.toExchange(
                route_map.future_quotes + "/" + this.props.symbol_id
              )}
            />
            <IconButton
              aria-haspopup="true"
              aria-controls="long-menu"
              onClick={this.handleClick}
            >
              <Iconfont type="moreAction" size="24" />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.openStopLoss}>
                {this.props.intl.formatMessage({ id: "合约计算器" })}
              </MenuItem>
              {this.props.userinfo.userId ? (
                <MenuItem onClick={this.changeRisk("buy_risk")}>
                  {this.props.intl.formatMessage({ id: "开多风险限额" })}
                </MenuItem>
              ) : (
                ""
              )}
              {this.props.userinfo.userId ? (
                <MenuItem onClick={this.changeRisk("sale_risk")}>
                  {this.props.intl.formatMessage({ id: "开空风险限额" })}
                </MenuItem>
              ) : (
                ""
              )}
              {this.props.userinfo.userId ? (
                <MenuItem onClick={this.openSetting}>
                  {this.props.intl.formatMessage({ id: "设置" })}
                </MenuItem>
              ) : (
                ""
              )}
            </Menu>
          </Grid>
        </Grid>
        <Drawer open={this.state.open} onClose={this.close}>
          <div className={classes.selectTokens}>
            <h2>{this.props.intl.formatMessage({ id: "合约" })}</h2>
            <Grid container justify="space-around">
              {this.state.quoteTokens.map((item, i) => {
                return (
                  <Grid item key={item + i}>
                    <Button
                      onClick={this.changeIndex(i)}
                      className={classes.subtitle2}
                      color={this.state.quoteToken == i ? "primary" : "default"}
                    >
                      {item.name}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
            <div className={classes.token_list}>
              <List>
                {data.map(item => {
                  const quote = this.props.symbol_quote[item.symbolId];
                  return (
                    <ListItem
                      className={classes.bottomLine}
                      key={item.symbolId}
                    >
                      <Grid
                        container
                        justify="space-between"
                        onClick={this.goto(item.exchangeId, item.symbolId)}
                      >
                        <Grid item>
                          <strong>{item.symbolName}</strong>
                        </Grid>
                        <Grid item>
                          {quote ? (
                            <i
                              className={
                                Number(quote.m) >= 0
                                  ? classes.green
                                  : classes.red
                              }
                            >
                              {quote.c}
                            </i>
                          ) : (
                            <i>--</i>
                          )}
                        </Grid>
                      </Grid>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </Drawer>
        <ModalRisk open={this.props.modal_risk} {...otherProps} />
        <ModalSetting open={this.props.modal_setting} {...otherProps} />
        <ModalCalculator open={this.props.modal_calculator} {...otherProps} />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
