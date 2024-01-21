// 交易页,行情页 盘口
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid } from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import route_map from "../../config/route_map";

let prices = {};

class TokenInfoRC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      digit: "",
      subed: false,
      limit: props.limit || 14,
      type: 0, // 数量=0，累计=1
      show: "all", // 0=all, 1 = buy, 2 = sell
    };
  }
  componentDidMount() {
    this.scrollTo();
  }
  scrollTo = () => {
    if (this.handicapListRef) {
      this.handicapListRef.scrollTop = Math.floor(
        (this.state.limit * 2 * 22 + 22 - this.handicapListRef.offsetHeight) / 2
      );
    }
  };
  componentDidUpdate(preProps, preState) {
    // 当前委托订单价格集合
    prices = {};
    (this.props.open_orders || []).map((item) => {
      if (item.price) {
        prices[helper.digits(item.price, this.state.digit)] = 1;
      }
    });
    if (this.props.qws && !this.state.subed && this.props.max_digits) {
      this.setState(
        {
          subed: true,
          digit: this.state.digit === "" ? this.props.max_digits : "",
        },
        () => {
          this.sub(
            this.props.exchange_id,
            this.props.symbol_id,
            this.state.digit === "" ? this.props.max_digits : this.state.digit
          );
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
        this.cancel(
          preProps.exchange_id + "." + preProps.symbol_id + preState.digit
        );
      }
      this.setState(
        {
          digit: this.props.max_digits,
        },
        () => {
          // 重新订阅
          this.sub(
            this.props.exchange_id,
            this.props.symbol_id,
            this.state.digit
          );
        }
      );
    }
  }
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "ws/merge_depth_http",
      payload: {
        dumpScale:
          this.state.digit <= 0 ? this.state.digit - 1 : this.state.digit,
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        limit: this.state.limit,
      },
    });
  };
  /**
   * data={
   *   topic:'mergedDepth',
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
      WSDATA.setData("mergedDepth_source", data.data, data.id);
  };
  sub = (exchange_id, symbol_id, digit) => {
    this.props.qws.sub(
      {
        id: exchange_id + "." + symbol_id + "" + digit,
        topic: "mergedDepth",
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        limit: this.state.limit,
        params: {
          dumpScale: digit <= 0 ? digit - 1 : digit,
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
  changeDigit = (e) => {
    // 取消之前的订阅
    this.cancel(
      this.props.exchange_id + "." + this.props.symbol_id + this.state.digit
    );
    this.setState(
      {
        digit: e.target.value,
      },
      () => {
        this.sub(
          this.props.exchange_id,
          this.props.symbol_id,
          this.state.digit
        );
      }
    );
  };
  countShadow = () => {
    const digit = this.state.digit;
    if (
      !this.props.symbol_id ||
      this.state.digit === "" ||
      !this.props.merged_depth[
        this.props.exchange_id + "." + this.props.symbol_id + digit
      ]
    ) {
      return {
        a: [],
        b: [],
        fix: 0,
      };
    }
    const data = this.props.merged_depth[
      this.props.exchange_id + "." + this.props.symbol_id + digit
    ];
    if (!data) {
      return {
        a: [],
        b: [],
        fix: 0,
      };
    }
    let a = []; // [price, amount, amount + a[a.length-1][1]]
    let b = [];
    let fix = 0; // 累计最大值
    let ar = new Array(this.state.limit).fill(1);
    // sell数据反转
    ar.map((item, i) => {
      const d = data.a[i];
      if (d && Number(d[0]) >= 0 && this.state.digit !== "") {
        a.push([helper.digits(d[0], this.state.digit), d[1]]);
        a[a.length - 1][2] =
          Number(a[a.length - 1][1]) +
          (a.length - 2 >= 0 ? Number(a[a.length - 2][2]) : 0);
        fix = Math.max(fix, a[a.length - 1][2]);
      }
    });
    a.length = this.state.limit;
    const pathname = window.location.pathname;
    if (pathname.indexOf(route_map.trade) > -1) {
      a.reverse();
    }
    ar.map((it, i) => {
      const item = data.b[i];
      if (item && Number(item[0]) >= 0 && this.state.digit !== "") {
        b.push([helper.digits(item[0], this.state.digit), item[1]]);
        b[b.length - 1][2] =
          Number(b[b.length - 1][1]) +
          (b.length - 2 >= 0 ? Number(b[b.length - 2][2]) : 0);
        fix = Math.max(fix, b[b.length - 1][2]);
      }
    });
    b.length = this.state.limit;
    return {
      a,
      b,
      fix,
    };
  };
  setPrice = (price) => (e) => {
    this.props.dispatch({
      type: "exchange/save",
      payload: {
        buy_price: price,
        sell_price: price,
      },
    });
  };
  renderItem = (n, type, datas, fix) => {
    const { classes } = this.props;
    return (
      <div
        className={classes.handicapItem}
        key={type + n}
        onClick={this.setPrice(datas[n] ? datas[n][0] : "")}
      >
        <span
          className={type == "BUY" ? classes.bg_green : classes.bg_red}
          style={{
            width:
              datas[n] && datas[n][2] && fix
                ? Math.min((datas[n][2] / fix) * 100, 100) + "%"
                : "0",
            opacity: 0.1,
          }}
        ></span>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          style={{ height: 22 }}
        >
          <Grid
            item
            className={type == "BUY" ? classes.green : classes.red}
            style={{ display: "flex", alignItems: "center" }}
          >
            {datas[n] ? datas[n][0] : ""}
            {datas[n] && datas[n][0] && prices[datas[n][0]] == 1 ? (
              <i
                style={{
                  fontSize: 16,
                  lineHeight: "22px",
                  margin: "0 0 0 5px",
                }}
              >
                •
              </i>
            ) : (
              ""
            )}
          </Grid>
          <Grid item>
            {datas[n]
              ? helper.digits(
                  this.state.type == 0 ? datas[n][1] : datas[n][2],
                  this.props.base_precision
                )
              : ""}
          </Grid>
        </Grid>
      </div>
    );
  };
  renderItemEx = (n, type, datas, fix) => {
    const { classes } = this.props;
    return (
      <div
        className={classes.handicapItemEx}
        key={type + n}
        onClick={this.setPrice(datas[n] ? datas[n][0] : "")}
      >
        <span
          className={type == "BUY" ? classes.bg_green : classes.bg_red}
          style={{
            width:
              datas[n] && datas[n][2] && fix
                ? Math.min((datas[n][2] / fix) * 100, 100) + "%"
                : "0",
            opacity: 0.1,
            right: type == "BUY" ? 0 : "auto",
            left: type == "BUY" ? "auto" : 0,
          }}
        ></span>
        {type == "BUY" ? (
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              {datas[n]
                ? helper.digits(
                    this.state.type == 0 ? datas[n][1] : datas[n][2],
                    this.props.base_precision
                  )
                : ""}
            </Grid>
            <Grid item className={classes.green}>
              {datas[n] ? datas[n][0] : ""}
            </Grid>
          </Grid>
        ) : (
          <Grid container justify="space-between" alignItems="center">
            <Grid item className={classes.red}>
              {datas[n] ? datas[n][0] : ""}
            </Grid>
            <Grid item>
              {datas[n]
                ? helper.digits(
                    this.state.type == 0 ? datas[n][1] : datas[n][2],
                    this.props.base_precision
                  )
                : ""}
            </Grid>
          </Grid>
        )}
      </div>
    );
  };
  change = (key) => (e) => {
    const v = e.target.value;
    this.setState(
      {
        [key]: v,
      },
      () => {
        if (key == "show" && v == "all") {
          this.scrollTo();
        }
      }
    );
  };
  // 交易页
  renderTrade = () => {
    const { classes } = this.props;
    const data = this.countShadow();
    const symbol_quote = this.props.symbol_quote;
    const quote =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]
        : {};
    const cRates = quote.c
      ? helper.currencyValue(
          this.props.rates,
          quote.c,
          this.props.token2,
          this.props.unit
        )
      : ["", ""];
    const ar = new Array(this.state.limit).fill(1);
    return (
      <div className={classes.handicap}>
        <Grid
          container
          justify="space-between"
          className={classes.handicapTitle}
        >
          <Grid item>{this.props.intl.formatMessage({ id: "价格" })}</Grid>
          <Grid item>
            <div className={classes.handicap_type}>
              <select value={this.state.type} onChange={this.change("type")}>
                <option value={0}>
                  {this.props.intl.formatMessage({ id: "数量" })}
                </option>
                <option value={1}>
                  {this.props.intl.formatMessage({ id: "累计" })}
                </option>
              </select>
              <span>
                {this.props.intl.formatMessage({
                  id: this.state.type == 0 ? "数量" : "累计",
                })}

                <Iconfont type="arrowDown" size={12} />
              </span>
            </div>
          </Grid>
        </Grid>
        <div
          className={classes.handicapList}
          ref={(ref) => (this.handicapListRef = ref)}
        >
          {this.state.show != "buy" ? (
            <div>
              {ar.map((item, i) => {
                return this.renderItem(i, "SELL", data.a, data.fix);
              })}
            </div>
          ) : (
            ""
          )}

          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.handicapInfo}
          >
            <Grid
              item
              onClick={this.setPrice(
                quote.c ? helper.digits(quote.c, this.props.max_digits) : ""
              )}
            >
              <strong className={quote.m >= 0 ? classes.green : classes.red}>
                {quote.c ? helper.digits(quote.c, this.props.max_digits) : ""}
              </strong>
            </Grid>
            <Grid item>
              <span>
                ≈ {cRates[0]}
                {cRates[1]}
              </span>
            </Grid>
          </Grid>
          {this.state.show != "sell" ? (
            <div>
              {ar.map((item, i) => {
                return this.renderItem(i, "BUY", data.b, data.fix);
              })}
            </div>
          ) : (
            ""
          )}
        </div>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          style={{ margin: "4px 0 0" }}
        >
          <Grid item>
            <div className={classes.digit}>
              <select value={this.state.digit} onChange={this.changeDigit}>
                {(this.props.digitMerge || []).map((item) => {
                  return (
                    <option value={CONST.depth[item]} key={item}>
                      {Math.abs(
                        CONST.depth[item] <= 0
                          ? Number(CONST.depth[item]) + 1
                          : CONST.depth[item]
                      )}
                      {this.props.intl.formatMessage({
                        id: CONST.depth[item] > 0 ? "位小数" : "位整数",
                      })}
                    </option>
                  );
                })}
              </select>
              <span>
                {this.state.digit > 0
                  ? this.state.digit
                  : 1 - Number(this.state.digit)}
                {this.props.intl.formatMessage({
                  id: this.state.digit > 0 ? "位小数" : "位整数",
                })}
                <Iconfont type="arrowDown" size={12} />
              </span>
            </div>
          </Grid>
          <Grid item>
            <div className={classes.digit}>
              <select
                value={this.state.show}
                onChange={this.change("show")}
                style={{ width: 24 }}
              >
                <option value="all">
                  {this.props.intl.formatMessage({ id: "全部" })}
                </option>
                <option value="buy">
                  {this.props.intl.formatMessage({ id: "只看买盘" })}
                </option>
                <option value="sell">
                  {this.props.intl.formatMessage({ id: "只看卖盘" })}
                </option>
              </select>
              {window.localStorage.up_down != 1 ? (
                <img
                  src={require(`../../assets/icon_${this.state.show}@2x.png`)}
                />
              ) : (
                ""
              )}
              {window.localStorage.up_down == 1 && this.state.show == "all" ? (
                <img
                  style={{ transform: "rotateX(180deg)" }}
                  src={require(`../../assets/icon_${this.state.show}@2x.png`)}
                />
              ) : (
                ""
              )}
              {window.localStorage.up_down == 1 && this.state.show == "buy" ? (
                <img src={require(`../../assets/icon_sell@2x.png`)} />
              ) : (
                ""
              )}
              {window.localStorage.up_down == 1 && this.state.show == "sell" ? (
                <img src={require(`../../assets/icon_buy@2x.png`)} />
              ) : (
                ""
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };
  renderExchange = () => {
    const { classes } = this.props;
    const data = this.countShadow();
    const ar = new Array(this.state.limit).fill(1);
    return (
      <Grid container className={classes.handicap_exchange}>
        <Grid item xs={6}>
          <Grid
            container
            justify="space-between"
            className={classes.handicapTitle}
          >
            <Grid item>
              <div className={classes.handicap_type}>
                <select value={this.state.type} onChange={this.change("type")}>
                  <option value={0}>
                    {this.props.intl.formatMessage({ id: "数量" })}
                  </option>
                  <option value={1}>
                    {this.props.intl.formatMessage({ id: "累计" })}
                  </option>
                </select>
                <span style={{ right: "auto", left: 0 }}>
                  {this.props.intl.formatMessage({
                    id: this.state.type == 0 ? "数量" : "累计",
                  })}
                  (
                  {this.props.token1_name
                    ? this.props.intl.formatMessage({
                        id: this.props.token1_name,
                      })
                    : ""}
                  )
                  <Iconfont type="arrowDown" size={12} />
                </span>
              </div>
            </Grid>
            <Grid item>{this.props.intl.formatMessage({ id: "价格" })}</Grid>
          </Grid>
          <div style={{ padding: "0 4px 0 0" }}>
            {ar.map((item, i) => {
              return this.renderItemEx(i, "BUY", data.b, data.fix);
            })}
          </div>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            justify="space-between"
            className={classes.handicapTitle}
          >
            <Grid item>{this.props.token2_name}</Grid>
            <Grid item>
              <div className={classes.handicap_type}>
                <select value={this.state.type} onChange={this.change("type")}>
                  <option value={0}>
                    {this.props.intl.formatMessage({ id: "数量" })}
                  </option>
                  <option value={1}>
                    {this.props.intl.formatMessage({ id: "累计" })}
                  </option>
                </select>
                <span>
                  {this.props.intl.formatMessage({
                    id: this.state.type == 0 ? "数量" : "累计",
                  })}
                  (
                  {this.props.token1_name
                    ? this.props.intl.formatMessage({
                        id: this.props.token1_name,
                      })
                    : ""}
                  )
                  <Iconfont type="arrowDown" size={12} />
                </span>
              </div>
            </Grid>
          </Grid>
          <div style={{ padding: "0 0 0 4px" }}>
            {ar.map((item, i) => {
              return this.renderItemEx(i, "SELL", data.a, data.fix);
            })}
          </div>
        </Grid>
      </Grid>
    );
  };
  render() {
    const pathname = window.location.pathname;
    if (pathname.indexOf(route_map.trade) > -1) {
      return this.renderTrade();
    }
    return this.renderExchange();
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
