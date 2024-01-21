import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import { injectIntl } from "react-intl";
import styles from "./order.item.style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../lib";
import moment from "moment";
import CONST from "../../config/const";
import helper from "../../utils/helper";

class OrderItemRC extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }
  cancel_order = (data, n) => async e => {
    await this.setState({
      loading: true
    });
    try {
      await this.props.cancel_order(data, n);
    } catch (e) {}
    this.setState({
      loading: false
    });
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
    const order_type = this.props.order_type;
    if (order_type == "STOP_LOSS") {
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
                </label>
                {data.symbolName}
              </strong>
              <span className={classes.grey} style={{ margin: "0 0 0 10px" }}>
                {data.time
                  ? moment
                      .utc(Number(data.time))
                      .local()
                      .format("HH:mm:ss MM/DD")
                  : ""}
              </span>
            </Grid>
            <Grid item>
              {this.state.loading ? (
                <CircularProgress size={16} />
              ) : (
                <Iconfont
                  type="close"
                  size="18"
                  onClick={this.cancel_order(data, this.props.n)}
                />
              )}
            </Grid>
          </Grid>
          <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "触发价" })}(
                {displayTokenId})
              </span>
              <br />
              {data.triggerPrice}
            </Grid>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "类型" })}
              </span>
              <br />
              {data.planOrderType
                ? this.props.intl.formatMessage({ id: data.planOrderType })
                : ""}
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "状态" })}:
              </span>
              <br />
              {this.props.intl.formatMessage({ id: data.status })}
            </Grid>
          </Grid>
        </div>
      );
    }
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
                {data.side.indexOf("CLOSE") > -1 ? "" : `·${data.leverage}X`}
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
            {this.state.loading ? (
              <CircularProgress size={16} />
            ) : (
              <Iconfont
                type="close"
                size="18"
                onClick={this.cancel_order(data, this.props.n)}
              />
            )}
          </Grid>
        </Grid>
        {data.type == "LIMIT" ? (
          <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "价格" })}({displayTokenId}
                )
              </span>
              <br />
              {data.priceType && data.priceType == "MARKET_PRICE" ? (
                <span>--</span>
              ) : (
                data.price
              )}
            </Grid>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "数量" })}(
                {this.props.intl.formatMessage({ id: "张" })})
              </span>
              <br />
              {data.origQty}
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "类型" })}:
              </span>
              <br />
              {data.priceType
                ? this.props.intl.formatMessage({ id: data.priceType })
                : ""}
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {data.type == "STOP" ? (
          <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "触发价" })}(
                {displayTokenId})
              </span>
              <br />
              {data.triggerPrice}
            </Grid>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "类型" })}
              </span>
              <br />
              {data.priceType
                ? this.props.intl.formatMessage({ id: data.priceType })
                : ""}
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "时间" })}:
              </span>
              <br />
              {data.time
                ? moment
                    .utc(Number(data.time))
                    .local()
                    .format("HH:mm:ss MM/DD")
                : ""}
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {data.type == "LIMIT" ? (
          <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "成交均价" })}(
                {displayTokenId})
              </span>
              <br />
              {data.avgPrice}
            </Grid>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "已成交数量" })}(
                {this.props.intl.formatMessage({ id: "张" })})
              </span>
              <br />
              {data.executedQty}
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "保证金" })}(
                {displayTokenId})
              </span>
              <br />
              {data.margin}
            </Grid>
          </Grid>
        ) : (
          ""
        )}
        {data.type == "STOP" ? (
          <Grid container alignItems="center" style={{ margin: "0 0 5px" }}>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "委托价" })}(
                {displayTokenId})
              </span>
              <br />
              {data.priceType && data.priceType == "MARKET_PRICE"
                ? "--"
                : data.price}
            </Grid>
            <Grid item xs={4}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "委托数量" })}(
                {this.props.intl.formatMessage({ id: "张" })})
              </span>
              <br />
              {data.origQty}
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <span className={classes.grey}>
                {this.props.intl.formatMessage({ id: "状态" })}
              </span>
              <br />
              {this.props.intl.formatMessage({ id: data.status })}
            </Grid>
          </Grid>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(OrderItemRC));
