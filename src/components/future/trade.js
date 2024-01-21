// 合约交易页
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid, Button, TextField, Icon, Tabs, Tab } from "@material-ui/core";
import styles from "./style";
import TokenInfo from "./tokenInfo";
import FormRC from "./form";
import Handicap from "./handicap";
import TradingHistory from "./tradingHistory";
import WSDATA from "../../models/data_source";
import route_map from "../../config/route_map";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import PositionList from "./position_list";

function deadlineFormat(t) {
  const n = Number(t);
  if (!n) {
    return [0, 0, 0, 0];
  }
  const d = Math.floor(n / (24 * 60 * 60 * 1000));
  const h = Math.floor((t - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const m = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000)
  );
  const s = Math.floor(
    (t - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000
  );
  return [d, h, m, s];
}

class Quotes extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
      subed: false
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: "future/getOrderSetting",
      payload: {}
    });
    if (this.props.match.params.symbol_id) {
      this.props.dispatch({
        type: "future/funding_rates",
        payload: {}
      });
      this.run();
    }
  }
  componentDidUpdate(preProps) {
    if (this.props.qws && !this.state.subed && this.props.symbol_id) {
      this.setState(
        {
          subed: true
        },
        () => {
          const symbol_info =
            this.props.config.symbols_obj.all[this.props.symbol_id] || {};
          this.sub(
            "index" + +this.props.exchange_id + "." + this.props.symbol_id,
            symbol_info.baseTokenFutures.displayIndexToken
          );
        }
      );
    }
    // if (preProps.symbolId && preProps.symbolId != this.props.symbolId) {
    //   this.init();
    // }
    // symbol_id,exchange_id变化时，取消之前的订阅，重新订阅，重置digit
    if (
      (this.props.symbol_id != preProps.symbol_id ||
        this.props.exchange_id != preProps.exchange_id) &&
      preProps.symbol_id &&
      preProps.exchange_id
    ) {
      // 取消之前的订阅
      if (preProps.exchange_id && preProps.symbol_id) {
        this.cancel("index" + preProps.exchange_id + "." + preProps.symbol_id);
      }
      const symbol_info =
        this.props.config.symbols_obj.all[this.props.symbol_id] || {};
      // 重新订阅
      this.sub(
        "index" + this.props.exchange_id + "." + this.props.symbol_id,
        symbol_info.baseTokenFutures.displayIndexToken
      );
    }
  }
  sub = (id, symbol) => {
    this.props.qws.sub(
      {
        id: id,
        topic: "index",
        event: "sub",
        symbol: symbol,
        params: {
          org: this.props.config.orgId,
          binary: !Boolean(window.localStorage.ws_binary)
        }
      },
      this.httpAction,
      this.callback
    );
  };
  cancel = id => {
    this.props.qws && this.props.qws.cancel(id);
  };
  httpAction = payload => {
    const symbol_info =
      this.props.config.symbols_obj.all[this.props.symbol_id] || {};
    return this.props.dispatch({
      type: "ws/get_indices_data",
      payload: {
        symbol: symbol_info.baseTokenFutures.displayIndexToken
      }
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
      WSDATA.setData("indices_source", {
        [data.data[0]["symbol"]]: data.data[0]["index"]
      });
  };

  run = async () => {
    const funding_rates = this.props.funding_rates
      ? [...this.props.funding_rates]
      : [];
    let hasChange = false;
    if (window.location.pathname.indexOf(route_map.future_trade) == -1) {
      return;
    }
    funding_rates.map(item => {
      if (
        Number(item.nextSettleTime) &&
        Number(item.curServerTime) &&
        item.nextSettleTime - item.curServerTime >= 0
      ) {
        if (!item.fixTime && item.fixTime !== 0) {
          item.fixTime = item.nextSettleTime - item.curServerTime;
        } else {
          item.fixTime = Math.max(0, item.fixTime - 1000);
        }
        if (
          item.fixTime === 0 &&
          window.location.pathname.indexOf(item.tokenId) > -1
        ) {
          hasChange = true;
        }
      }
    });
    await this.props.dispatch({
      type: "future/save",
      payload: {
        funding_rates
      }
    });
    if (hasChange) {
      try {
        await this.props.dispatch({
          type: "future/funding_rates",
          payload: {}
        });
      } catch (e) {}
    }
    this.setState(
      {
        count: Number(this.state.count) + 1
      },
      () => {
        setTimeout(() => {
          this.run();
        }, 1000);
      }
    );
    //await helper.delay(1000);
  };
  tabChange = (e, v) => {
    if (v == this.state.tab) return;

    let data = {
      order_choose: v
    };
    const symbol_quote = this.props.symbol_quote;
    const symbolId = this.props.match.params.symbol_id;
    const tokenQuote = symbol_quote ? symbol_quote[symbolId] : { c: "" };

    data.buy_max = 0;
    data.buy_progress = 0;
    data.buy_price = tokenQuote ? tokenQuote.c : "";
    data.buy_type = 0;
    data.buy_price_type = 0;
    data.buy_trigger_price = 0;
    data.buy_leverage =
      window.localStorage[symbolId.toUpperCase() + v + "buy_leverage"];
    data.buy_quantity = "";
    data.buy_max = 0;

    data.sale_max = 0;
    data.sale_progress = 0;
    data.sale_price = tokenQuote ? tokenQuote.c : "";
    data.sale_type = 0;
    data.sale_price_type = 0;
    data.sale_trigger_price = 0;
    data.sale_leverage =
      window.localStorage[symbolId.toUpperCase() + v + "sale_leverage"];
    data.sale_quantity = "";
    data.sale_max = 0;

    this.setState({
      tab: v
    });
    if (v < 2) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          ...data
        }
      });
    }
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const symbolId = this.props.symbol_id;
    const symbolInfo = this.props.future_info;
    let current_funding_rates = {};
    (this.props.funding_rates || []).map(item => {
      if (item.tokenId == symbolId) {
        current_funding_rates = item;
      }
    });
    const d = deadlineFormat(current_funding_rates.fixTime);

    return (
      <div className={classes.quotes}>
        <TokenInfo {...otherProps} />
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={this.state.tab}
          onChange={this.tabChange}
          variant="fullWidth"
          classes={{
            root: classes.tabsRoot
          }}
        >
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "开仓" })}
          />
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "平仓" })}
          />
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "持仓" })}
          />
        </Tabs>
        {this.state.tab < 2 ? (
          <Grid container wrap="nowrap" style={{ padding: "0 24px" }}>
            <Grid item xs={6} style={{ margin: "0 12px 0 0" }}>
              <FormRC tab={this.state.tab} {...otherProps} />
            </Grid>
            <Grid item xs={6} style={{ margin: "0 0 0 12px" }}>
              <Handicap {...otherProps} />
              <div className={classes.fundingRate}>
                <Grid container justify="space-between">
                  <Grid item className={classes.grey500}>
                    {this.props.intl.formatMessage({ id: "标的指数" })}
                  </Grid>
                  <Grid item>
                    {symbolInfo.baseTokenFutures &&
                    this.props.indices[
                      symbolInfo.baseTokenFutures.displayIndexToken
                    ]
                      ? helper.digits(
                          this.props.indices[
                            symbolInfo.baseTokenFutures.displayIndexToken
                          ],
                          CONST.depth[symbolInfo.minPricePrecision]
                        )
                      : "--"}
                  </Grid>
                </Grid>
                <Grid container justify="space-between">
                  <Grid item className={classes.grey500}>
                    {this.props.intl.formatMessage({ id: "资金费率" })}
                  </Grid>
                  <Grid item>
                    {current_funding_rates.fundingRate
                      ? helper.digits(
                          current_funding_rates.fundingRate * 100,
                          4
                        ) + "%"
                      : current_funding_rates.fundingRate}
                    {/* {Number(current_funding_rates.fundingRate) ||
                    Number(current_funding_rates.fundingRate) === 0
                      ? Number(current_funding_rates.fundingRate) >= 0
                        ? this.props.intl.formatMessage({ id: "多仓付" })
                        : this.props.intl.formatMessage({ id: "空仓付" })
                      : "--"} */}
                  </Grid>
                </Grid>
                <Grid container justify="space-between">
                  <Grid item className={classes.grey500}>
                    {this.props.intl.formatMessage({ id: "结算时间" })}
                  </Grid>
                  <Grid item>
                    {d[1] < 10 ? "0" + d[1] : d[1]}:
                    {d[2] < 10 ? "0" + d[2] : d[2]}:
                    {d[3] < 10 ? "0" + d[3] : d[3]}
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {this.state.tab < 2 ? <TradingHistory {...otherProps} /> : ""}
        {this.state.tab == 2 ? <PositionList {...otherProps} /> : ""}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Quotes));
