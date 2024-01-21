// 交易页
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid, Drawer, ListItem, Button, List } from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import CONST from "../../config/const";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      quoteTokens: ["fav"],
      quoteToken: 1,
      open: false,
    };
  }
  componentDidMount() {
    this.init();
  }
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
        min_trade_amount: symbol_info.minTradeAmount, // 金额交易step  如 0.1
      },
    });
  };
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
          quoteTokens: ["fav", ...this.props.config.customQuoteToken],
        },
        () => {
          this.props.qws.sub(
            {
              id: "broker",
              topic: "slowBroker",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary),
              },
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
      type: "ws/broker_quote_http",
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
    data.data &&
      data.data.length &&
      WSDATA.setData("symbol_quote_source", data.data);
  };
  changeIndex = (i) => () => {
    this.setState({
      quoteToken: i,
    });
  };
  close = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  goto = (exchangeId, baseTokenId, quoteTokenId) => () => {
    const url = route_map.trade + "/" + baseTokenId + "/" + quoteTokenId;
    this.props.history.push(url);
    this.close();
    setTimeout(() => {
      this.init();
    }, 0);
  };
  toExchange = (url) => (e) => {
    window.location.href = url;
  };
  render() {
    const { classes } = this.props;
    const symbol_quote = this.props.symbol_quote;
    const quoteToken = this.props.config.customQuoteToken;
    const m =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]["m"]
        : 0;
    const data = [];
    const symbols_obj = this.props.config.symbols_obj || {};
    if (this.state.quoteToken == 0) {
      quoteToken.map((item) => {
        (item.quoteTokenSymbols || []).map((it) => {
          if (
            this.props.favorite[it.symbolId] &&
            `${it.symbolId}${it.symbolName}`.indexOf(
              (this.state.search_text || "").toUpperCase()
            ) > -1
          ) {
            if (
              data.findIndex((item) => item.symbolId == it.symbolId) == -1 &&
              it.showStatus
            ) {
              const q = symbol_quote[it.symbolId];
              data.push({ ...it, ...q, s: it.symbolId });
            }
          }
        });
      });
    }
    if (this.state.quoteToken > 0) {
      quoteToken.length &&
        (
          (quoteToken[this.state.quoteToken - 1] || {})["quoteTokenSymbols"] ||
          []
        ).map((item) => {
          if (
            `${item.symbolId}${item.symbolName}`.indexOf(
              (this.state.search_text || "").toUpperCase()
            ) > -1 &&
            item.showStatus
          ) {
            const q = symbol_quote[item.symbolId];
            data.push({ ...item, ...q, s: item.symbolId });
          }
        });
    }
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
            <strong>
              {this.props.token1_name}/{this.props.token2_name}
            </strong>
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
                route_map.exchange +
                  "/" +
                  this.props.token1 +
                  "/" +
                  this.props.token2
              )}
            />
          </Grid>
        </Grid>
        <Drawer open={this.state.open} onClose={this.close}>
          <div className={classes.selectTokens}>
            <h2>{this.props.intl.formatMessage({ id: "币币" })}</h2>
            <Grid container justify="space-around">
              {this.state.quoteTokens.map((item, i) => {
                if (item == "fav") {
                  return (
                    <Grid item key={item + i}>
                      <Button
                        color={
                          this.state.quoteToken == 0 ? "primary" : "default"
                        }
                        onClick={this.changeIndex(i)}
                      >
                        {this.state.quoteToken == 0 ? (
                          <Iconfont type="favorited" size="24" />
                        ) : (
                          <Iconfont type="favorite" size="24" />
                        )}
                      </Button>
                    </Grid>
                  );
                }
                return (
                  <Grid item key={item + i}>
                    <Button
                      onClick={this.changeIndex(i)}
                      className={classes.subtitle2}
                      color={this.state.quoteToken == i ? "primary" : "default"}
                    >
                      {item.tokenName}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
            <div className={classes.token_list}>
              <List>
                {data.map((item) => {
                  const quote = this.props.symbol_quote[item.symbolId];
                  return (
                    <ListItem
                      className={classes.bottomLine}
                      key={item.symbolId}
                    >
                      <Grid
                        container
                        justify="space-between"
                        onClick={this.goto(
                          item.exchangeId,
                          item.baseTokenId,
                          item.quoteTokenId
                        )}
                      >
                        <Grid item>
                          <strong>{item.baseTokenName}</strong>/
                          <span>{item.quoteTokenName}</span>
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
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
