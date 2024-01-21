import React from "react";
import { Grid } from "@material-ui/core";
import { injectIntl } from "react-intl";
import styles from "./orderItem.style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../lib";
import moment from "moment";
import CONST from "../../config/const";
import helper from "../../utils/helper";

class OrderItemRC extends React.Component {
  constructor() {
    super();
  }
  cancel_order = (data, n) => (e) => {
    this.props.cancel_order && this.props.cancel_order(data, n);
  };
  render() {
    const { classes, symbols_obj } = this.props;
    const data = this.props.data || {};
    return (
      <div className={classes.orderItem} data-key={this.props.key}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.type}
        >
          <Grid item>
            <strong>
              <label
                className={data.side == "BUY" ? classes.green : classes.red}
              >
                {this.props.intl.formatMessage({
                  id: data.type == "LIMIT" ? "限价" : "市价",
                })}{" "}
                {this.props.intl.formatMessage({
                  id: data.side == "BUY" ? "买入" : "卖出",
                })}
              </label>
              {data.baseTokenName}/{data.quoteTokenName}
            </strong>
          </Grid>
          <Grid item>
            <span>
              {data.time
                ? moment
                    .utc(Number(data.time))
                    .local()
                    .format("YYYY/MM/DD HH:mm:ss")
                : ""}
            </span>
          </Grid>
        </Grid>
        <Grid container wrap="wrap" alignItems="center">
          <Grid item xs={4}>
            <span>{this.props.intl.formatMessage({ id: "委托总量" })}:</span>
          </Grid>
          <Grid item xs={8}>
            {symbols_obj.all[data.symbolId]
              ? data.type === "LIMIT" ||
                (data.type == "MARKET" && data.side == "SELL")
                ? helper.digits(
                    data.origQty,
                    CONST["depth"][
                      symbols_obj.all[data.symbolId]["basePrecision"]
                    ]
                  ) +
                  " " +
                  data.baseTokenName
                : helper.digits(
                    data.origQty,
                    CONST["depth"][
                      symbols_obj.all[data.symbolId]["quotePrecision"]
                    ]
                  ) +
                  " " +
                  data.quoteTokenName
              : ""}
          </Grid>
          <Grid item xs={4}>
            <span>{this.props.intl.formatMessage({ id: "价格" })}:</span>
          </Grid>
          <Grid item xs={8}>
            {data.type === "MARKET"
              ? this.props.intl.formatMessage({ id: data.type })
              : ""}
            {symbols_obj.all[data.symbolId] && data.type !== "MARKET"
              ? helper.digits(
                  data.price,
                  CONST["depth"][
                    symbols_obj.all[data.symbolId]["minPricePrecision"]
                  ]
                ) +
                " " +
                data.quoteTokenName
              : ""}
          </Grid>
          {Number(data.avgPrice) ? (
            <Grid item xs={4}>
              <span>{this.props.intl.formatMessage({ id: "成交均价" })}:</span>
            </Grid>
          ) : (
            ""
          )}
          {Number(data.avgPrice) ? (
            <Grid item xs={8}>
              {symbols_obj.all[data.symbolId]
                ? helper.digits(
                    data.avgPrice,
                    CONST["depth"][
                      symbols_obj.all[data.symbolId]["minPricePrecision"]
                    ]
                  ) +
                  " " +
                  data.quoteTokenName
                : ""}
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={4}>
            <span>{this.props.intl.formatMessage({ id: "成交数量" })}:</span>
          </Grid>
          <Grid item xs={4}>
            {symbols_obj.all[data.symbolId]
              ? helper.digits(
                  data.executedQty,
                  CONST["depth"][
                    symbols_obj.all[data.symbolId]["basePrecision"]
                  ]
                ) +
                " " +
                data.baseTokenName
              : ""}
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}>
            {data.status === "NEW" || data.status == "PARTIALLY_FILLED" ? (
              <Iconfont
                type="close"
                size="18"
                onClick={this.cancel_order(data, this.props.n)}
              />
            ) : (
              this.props.intl.formatMessage({ id: data.status })
            )}
          </Grid>
          {Number(data.executedAmount) ? (
            <Grid item xs={4}>
              <span>{this.props.intl.formatMessage({ id: "成交额" })}:</span>
            </Grid>
          ) : (
            ""
          )}
          {Number(data.executedAmount) ? (
            <Grid item xs={8}>
              {symbols_obj.all[data.symbolId]
                ? helper.digits(data.executedAmount, 8) +
                  " " +
                  data.quoteTokenName
                : ""}
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(OrderItemRC));
