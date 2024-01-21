// 行情页
import React from "react";
import classNames from "classnames";
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
    const token1 = (this.props.match.params.token1 || "").toUpperCase();
    const token2 = (this.props.match.params.token2 || "").toUpperCase();
    const token1_name = this.props.config.tokens[token1]
      ? this.props.config.tokens[token1]["tokenName"]
      : "";
    const token2_name = this.props.config.tokens[token2]
      ? this.props.config.tokens[token2]["tokenName"]
      : "";
    const symbol_info = this.props.config.symbols[token1 + token2] || {};

    const symbol_id = symbol_info["symbolId"];
    const exchange_id = symbol_info["exchangeId"];
    if (token1) {
      this.props.dispatch({
        type: "exchange/token_info",
        payload: {
          token_id: token1
        }
      });
    }

    this.props.dispatch({
      type: "exchange/save",
      payload: {
        token1,
        token1_name,
        token2,
        token2_name,
        exchange_id,
        symbol_id,
        digitMerge: (symbol_info.digitMerge || "").split(","),
        max_digits: CONST.depth[symbol_info.minPricePrecision],
        base_precision: CONST.depth[symbol_info.basePrecision], // 数量精度 如 8 表示小数留8位
        quote_precision: CONST.depth[symbol_info.quotePrecision], // 金额精度 如 8 表示小数留8位
        min_price_precision: symbol_info.minPricePrecision, // 价格交易step, 如 0.1
        min_trade_quantity: symbol_info.minTradeQuantity, // 数量交易step 如 0.1
        min_trade_amount: symbol_info.minTradeAmount // 金额交易step  如 0.1
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
  fav = () => {
    this.props.dispatch({
      type: "layout/favorite",
      payload: {
        exchangeId: this.props.exchange_id,
        symbolId: this.props.symbol_id
      }
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const symbol_quote = this.props.symbol_quote;
    const quote =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]
        : {};
    const cRates =
      this.props.token2 && quote.c
        ? helper.currencyValue(
            this.props.rates,
            quote.c,
            this.props.token2,
            this.props.unit
          )
        : ["", ""];
    const token_info = this.props.token_info || {};
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
            {this.props.token1_name}/{this.props.token2_name}
          </Grid>
          <Grid>
            {this.props.favorite[this.props.symbol_id] ? (
              <Iconfont type="favorited" size="24" onClick={this.fav} />
            ) : (
              <Iconfont type="favorite" size="24" onClick={this.fav} />
            )}
          </Grid>
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
                <label>{quote.v ? helper.digits(quote.v, 2) : ""}</label>
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
          <Tab
            className={classes.info_tab}
            label={this.props.intl.formatMessage({ id: "简介" })}
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
          <div>
            <div className={classes.base_token_info}>
              <h2>{token_info.tokenName}</h2>
              <Grid container alignItems="center">
                <Grid item xs={5}>
                  <label>
                    {this.props.intl.formatMessage({ id: "发行时间" })}
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {token_info.publishTime || "--"}
                </Grid>
                <Grid item xs={5}>
                  <label>
                    {this.props.intl.formatMessage({ id: "发行总量" })}
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {token_info.maxQuantitySupplied
                    ? helper.format(token_info.maxQuantitySupplied)
                    : "--"}
                </Grid>
                <Grid item xs={5}>
                  <label>
                    {this.props.intl.formatMessage({ id: "流通总量" })}
                  </label>
                </Grid>
                <Grid item xs={7}>
                  {token_info.currentTurnover
                    ? helper.format(token_info.currentTurnover)
                    : "--"}
                </Grid>
              </Grid>
              <div
                className="desc"
                dangerouslySetInnerHTML={{
                  __html: token_info["description"]
                }}
              ></div>
              <List>
                <ListItem onClick={this.goto(token_info.whitePaperUrl)}>
                  <ListItemText>
                    {this.props.intl.formatMessage({ id: "白皮书" })}
                  </ListItemText>
                  <Iconfont type="arrowRight" size="20" />
                </ListItem>
                <ListItem onClick={this.goto(token_info.officialWebsiteUrl)}>
                  <ListItemText>
                    {this.props.intl.formatMessage({ id: "官网" })}
                  </ListItemText>
                  <Iconfont type="arrowRight" size="20" />
                </ListItem>
                <ListItem onClick={this.goto(token_info.exploreUrl)}>
                  <ListItemText>
                    {this.props.intl.formatMessage({ id: "区块查询" })}
                  </ListItemText>
                  <Iconfont type="arrowRight" size="20" />
                </ListItem>
              </List>
            </div>
          </div>
        </SwipeableViews>
        <div style={{ height: 56 }}></div>
        <Grid container className={classes.exchange_btns} spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={classes.greenBtn2}
              href={
                route_map.trade +
                "/" +
                this.props.token1 +
                "/" +
                this.props.token2
              }
              style={{ height: 50 }}
            >
              {this.props.intl.formatMessage({ id: "买入" })}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={classes.redBtn2}
              style={{ height: 50 }}
              href={
                route_map.trade +
                "/" +
                this.props.token1 +
                "/" +
                this.props.token2 +
                "?side=sell"
              }
            >
              {this.props.intl.formatMessage({ id: "卖出" })}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(IndexRC));
