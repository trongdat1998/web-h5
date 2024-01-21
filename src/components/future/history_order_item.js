import React from "react";
import { Grid } from "@material-ui/core";
import { injectIntl } from "react-intl";
import styles from "./order.item.style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../lib";
import moment from "moment";
import CONST from "../../config/const";

class OrderItemRC extends React.Component {
  constructor() {
    super();
  }
  cancel_order = (data, n) => e => {
    this.props.cancel_order && this.props.cancel_order(data, n);
  };
  render() {
    const { classes, symbols_obj } = this.props;
    const data = this.props.data || {};
    const sideMap = CONST["sideMap"];
    const displayTokenId =
      symbols_obj.all[data.symbolId] &&
      symbols_obj.all[data.symbolId]["baseTokenFutures"]
        ? symbols_obj.all[data.symbolId]["baseTokenFutures"]["displayTokenId"]
        : "";
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
                className={
                  data.side == "BUY_OPEN" || data.side == "BUY_CLOSE"
                    ? classes.green
                    : classes.red
                }
              >
                {sideMap[data.side]
                  ? this.props.intl.formatMessage({
                      id: sideMap[data.side]
                    })
                  : ""}
                {/* {this.props.intl.formatMessage({
                  id: data.type == "LIMIT" ? "限价" : "市价"
                })}{" "}
                {this.props.intl.formatMessage({
                  id: data.side == "BUY" ? "买入" : "卖出"
                })} */}
                {/* ·{data.side.indexOf("CLOSE") > -1 ? "--" : data.leverage + "X"} */}
              </label>
              {data.symbolName}
            </strong>
            <span className={classes.grey} style={{ margin: "0 0 0 10px" }}>
              {data.time && data.type == "LIMIT"
                ? moment
                    .utc(Number(data.time))
                    .local()
                    .format("HH:mm:ss MM/DD")
                : ""}
            </span>
          </Grid>
          <Grid item>
            {/* <Iconfont
              type="close"
              size="18"
              onClick={this.cancel_order(data, this.props.n)}
            /> */}
          </Grid>
        </Grid>
        <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
          <Grid item xs={6}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "成交价" })}({displayTokenId}
              )
            </span>
            <br />
            {data.price}
          </Grid>
          <Grid item xs={6}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "数量" })}(
              {this.props.intl.formatMessage({ id: "张" })})
            </span>
            <br />
            {data.quantity}
          </Grid>
          <Grid item xs={6}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "盈亏" })}
            </span>
            <br />
            {data.pnl} {data.quoteTokenName}
          </Grid>
          <Grid item xs={6}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "手续费" })}
            </span>
            <br />
            {data.fee} {data.feeTokenName}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(OrderItemRC));
