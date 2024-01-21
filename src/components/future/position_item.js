import React from "react";
import { Grid, Button } from "@material-ui/core";
import { injectIntl } from "react-intl";
import styles from "./order.item.style";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import CONST from "../../config/const";
import helper from "../../utils/helper";

class OrderItemRC extends React.Component {
  constructor() {
    super();
  }
  cancel_order = (data, n) => e => {
    this.props.cancel_order && this.props.cancel_order(data, n);
  };
  changeModal = (side, item) => {
    this.props.changeItem(side, item);
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_margin: true
      }
    });
  };
  openStop = (symbol_id, is_long, tokenName, exchange_id) => e => {
    this.props.openStop(symbol_id, is_long, tokenName, exchange_id);
  };
  openPosition = data => e => {
    this.props.openPosition(data);
  };
  render() {
    const { classes, symbols_obj } = this.props;
    const data = this.props.data || {};
    const symbol_info = symbols_obj.all[data.symbolId] || {
      baseTokenFutures: {}
    };
    const basePrecision =
      Number(symbol_info.basePrecision) > 0.1
        ? 0
        : CONST["depth"][symbol_info.basePrecision];
    const minPricePrecision =
      Number(symbol_info.minPricePrecision) > 0.1
        ? 0
        : CONST["depth"][symbol_info.minPricePrecision];
    const minTradeQuantity = symbol_info.minTradeQuantity;
    const exchangeId = symbol_info.exchangeId;
    const marginPrecision =
      CONST["depth"][symbol_info.baseTokenFutures.marginPrecision];
    const displayTokenId =
      symbols_obj.all[data.symbolId] &&
      symbols_obj.all[data.symbolId]["baseTokenFutures"]
        ? symbols_obj.all[data.symbolId]["baseTokenFutures"]["displayTokenId"]
        : "";
    return (
      <div className={classes.orderItem} key={this.props.key}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.type}
        >
          <Grid item>
            <strong>
              {data.symbolName}{" "}
              <label
                className={
                  Number(data.isLong) > 0 ? classes.green : classes.red
                }
              >
                {this.props.intl.formatMessage({
                  id: Number(data.isLong) > 0 ? "多仓" : "空仓"
                })}{" "}
                {data.leverage + "X"}
              </label>
            </strong>{" "}
            <span className={classes.grey} style={{ margin: "0 0 0 10px" }}>
              {data.time && data.type == "LIMIT"
                ? moment
                    .utc(Number(data.time))
                    .local()
                    .format("HH:mm:ss MM/DD")
                : ""}
            </span>
          </Grid>
          <Grid item></Grid>
        </Grid>
        <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
          <Grid item xs={6}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "开仓均价" })}(
              {displayTokenId})
            </span>
            <br />
            {Number(data.avgPrice)
              ? helper.digits(Number(data.avgPrice), minPricePrecision)
              : ""}
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "未实现盈亏" })}(
              {symbol_info.baseTokenFutures.coinToken})
            </span>
            <br />
            {data.unrealisedPnl}
          </Grid>
        </Grid>
        <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
          <Grid item xs={6}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "预估强评价" })}(
              {displayTokenId})
            </span>
            <br />
            {data.liquidationPrice
              ? helper.digits(data.liquidationPrice, minPricePrecision)
              : data.liquidationPrice}
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "收益率" })}(
              {symbol_info.baseTokenFutures.coinToken})
            </span>
            <br />
            <i
              className={
                Number(data.profitRate) >= 0 ? classes.green : classes.red
              }
            >
              {Number(data.profitRate)
                ? Math.floor(data.profitRate * 10000) / 100 + "%"
                : data.profitRate}
            </i>
          </Grid>
        </Grid>
        <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
          <Grid item xs={5}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "仓位保证金" })}(
              {symbol_info.baseTokenFutures.coinToken})
            </span>
            <br />
            {data.margin && marginPrecision
              ? helper.digits(data.margin, marginPrecision)
              : data.margin}
          </Grid>
          <Grid item xs={3}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "仓位" })}
              {window.localStorage.lang == "zh-cn"
                ? `(${this.props.intl.formatMessage({ id: "张" })})`
                : ""}
            </span>
            <br />
            {data.total}
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "仓位价值" })}(
              {symbol_info.baseTokenFutures.coinToken})
            </span>
            <br />
            {data.positionValues
              ? helper.digits(data.positionValues, marginPrecision)
              : data.positionValues}
          </Grid>
        </Grid>
        <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
          <Grid item xs={5}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "保证金率" })}
            </span>
            <br />
            {Math.floor(data.marginRate * 10000) / 100}%
          </Grid>
          <Grid item xs={3}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "可平量" })}
              {window.localStorage.lang == "zh-cn"
                ? `(${this.props.intl.formatMessage({ id: "张" })})`
                : ""}
            </span>
            <br />
            {data.available}
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }}>
            <span className={classes.grey}>
              {this.props.intl.formatMessage({ id: "标的指数" })}
            </span>
            <br />
            {data.indices
              ? helper.digits(data.indices, minPricePrecision)
              : data.indices}
          </Grid>
        </Grid>
        <Grid container justify="space-between">
          <Grid item>
            <Button
              onClick={this.changeModal.bind(this, "add", data)}
              size="small"
              color="primary"
              variant="contained"
              style={{ padding: 4 }}
            >
              {this.props.intl.formatMessage({ id: "调整保证金" })}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={this.openStop(
                data.symbolId,
                data.isLong,
                displayTokenId,
                data.exchangeId
              )}
              size="small"
              color="primary"
              variant="contained"
              style={{ padding: 4 }}
            >
              {this.props.intl.formatMessage({ id: "止盈止损" })}
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="small"
              onClick={this.openPosition(data)}
              color="primary"
              variant="contained"
              style={{ padding: 4 }}
            >
              {this.props.intl.formatMessage({ id: "平仓" })}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(OrderItemRC));
