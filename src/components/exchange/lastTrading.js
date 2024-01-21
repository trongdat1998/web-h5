// 行情页最新成交
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid } from "@material-ui/core";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import CONST from "../../config/const";
import moment from "moment";

class LastTradingRC extends React.Component {
  constructor() {
    super();
    this.state = { subed: false };
  }
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.qws.sub(
            {
              id: "trade" + this.props.exchange_id + "." + this.props.symbol_id,
              topic: "trade",
              event: "sub",
              limit: CONST["trade_limit"],
              symbol: this.props.exchange_id + "." + this.props.symbol_id,
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
      type: "ws/trade_http",
      payload: {
        symbol: this.props.exchange_id + "." + this.props.symbol_id,
        limit: CONST["trade_limit"],
      },
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
    if (data.f) {
      WSDATA.clear("trade_source");
    }
    data.data &&
      data.data.length &&
      WSDATA.setData("trade_source", data.data, data.id);
  };
  render() {
    const { classes, trades } = this.props;
    const data =
      trades["trade" + this.props.exchange_id + "." + this.props.symbol_id] ||
      [];
    return (
      <div className={classes.trades}>
        <Grid container>
          <Grid item xs={3}>
            <span>{this.props.intl.formatMessage({ id: "时间" })}</span>
          </Grid>
          <Grid item xs={2}>
            <span>{this.props.intl.formatMessage({ id: "类型" })}</span>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ textAlign: "right", padding: "0 10px 0 0" }}
          >
            <span>
              {this.props.intl.formatMessage({ id: "价格" })}
              {this.props.token2_name}
            </span>
          </Grid>
          <Grid item xs={3} style={{ textAlign: "right" }}>
            <span>{this.props.intl.formatMessage({ id: "数量" })}</span>
          </Grid>
        </Grid>
        {data.map((item) => {
          return (
            <Grid container style={{ lineHeight: "33px" }} key={item.v}>
              <Grid item xs={3}>
                {moment.utc(item.t).local().format("HH:mm:ss")}
              </Grid>
              <Grid
                item
                xs={2}
                style={{
                  color: item.m
                    ? window.palette.up.main
                    : window.palette.down.main,
                }}
              >
                {this.props.intl.formatMessage({
                  id: item.m ? "买入" : "卖出",
                })}
              </Grid>
              <Grid
                item
                xs={4}
                style={{ textAlign: "right", padding: "0 10px 0 0" }}
              >
                {item.p ? helper.digits(item.p, this.props.max_digits) : ""}
              </Grid>
              <Grid item xs={3} style={{ textAlign: "right" }}>
                {item.q ? helper.digits(item.q, this.props.base_precision) : ""}
              </Grid>
            </Grid>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(LastTradingRC));
