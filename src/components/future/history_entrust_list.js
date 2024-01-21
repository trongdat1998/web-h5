// 历史委托列表页
// 交易页订单区; 当前委托
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle
} from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import OrderItem from "./history_entrust_item";
import CopyToClipboard from "react-copy-to-clipboard";
import CONST from "../../config/const";
import moment from "moment";

let rcState = false;
class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      order_type: "LIMIT", // LIMIT|STOP
      anchorEl: null,
      subed: false,
      open: false,
      details: [],
      order_info: {},
      dialog: false,
      dialog_info: {
        time: "",
        symbol_name: "",
        price: "",
        liquidationPrice: ""
      }
    };
  }
  componentDidMount() {
    rcState = true;
    this.getMore(true);
    this.loadMore();
  }
  componentWillUnmount() {
    rcState = false;
  }
  componentDidUpdate(preProps) {
    if (this.props.ws && !this.state.subed && this.props.userinfo.userId) {
      this.setState(
        {
          subed: true
        },
        () => {
          // 当前委托
          this.props.ws.sub(
            {
              id: "futures_order",
              topic: "futures_order",
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
    const order_notice = WSDATA.getData("order_notice");
    if (order_notice > 0) {
      this.props.enqueueSnackbar(
        this.props.intl.formatMessage(
          { id: "order_notice" },
          { n: order_notice }
        ),
        { variant: "success" }
      );
      WSDATA.clear("order_notice");
    }
  }
  // 历史委托http
  httpAction = payload => {
    // 历史委托
    return this.props.dispatch({
      type: "future/updateHistoryEntrust",
      payload: {
        order_type: this.state.order_type
      }
    });
  };
  callback = data => {
    data && data.data && WSDATA.setData("future_order_source", data.data);
  };
  loadMore = async () => {
    if (!rcState || !this.list_status) return;
    const size = this.list_status.getBoundingClientRect();
    if (
      size.top + size.height <= document.documentElement.clientHeight &&
      this.props.history_entrust_more
    ) {
      this.getMore();
    }
    await helper.delay(1000);
    this.loadMore();
  };
  // 获取更多
  getMore = firstReq => {
    let params = {};
    params.firstReq = Boolean(firstReq);
    let obj = { ...params };
    obj.type = this.state.order_type;
    obj.order_type = this.state.order_type;
    this.props.dispatch({
      type: "future/getHistoryEntrust",
      payload: obj
    });
  };
  handleChange = (e, v) => {
    if (v == this.state.order_type) return;
    this.setState(
      {
        order_type: v
      },
      () => {
        this.props.dispatch({
          type: "future/save",
          payload: {
            history_entrust: [],
            history_entrust_more: true,
            history_entrust_loading: false
          }
        });
        this.getMore(true);
      }
    );
  };
  dialog = (type, record) => e => {
    if (type == "close") {
      this.setState({
        dialog: false,
        dialog_info: {
          time: "",
          symbol_name: "",
          price: "",
          liquidationPrice: ""
        }
      });
      return;
    }
    if (type == "open" && record) {
      this.setState({
        dialog: true,
        dialog_info: {
          time: record.time,
          symbol_name: record.symbolName,
          price: record.price,
          liquidationPrice: record.liquidationPrice
        }
      });
    }
  };
  showDetails = data => {
    if (
      (this.state.order_type == "STOP_LOSS" && data.executedOrderId == 0) ||
      (this.state.order_type != "STOP_LOSS" &&
        ((data.status == "CANCELED" && data.executedQty <= 0) ||
          data.type !== "LIMIT"))
    ) {
      return;
    }
    if (data.liquidationType == "IOC") {
      return this.dialog("open", data)();
    }
    this.setState(
      {
        open: true,
        details: [],
        order_info: data
      },
      () => {
        const stop_loss =
          data.type == "STOP" && data.planOrderType != "STOP_COMMON" ? 1 : 0;
        this.props.dispatch({
          type: "future/getHistoryEntrustDetails",
          payload: {
            order_id: stop_loss ? data.executedOrderId : data.orderId
          },
          url: stop_loss ? "futures_order_get" : "futures_match_info",
          callback: res => {
            if (res.code == "OK") {
              this.setState({
                details:
                  Object.prototype.toString.call(res.data) === "[object Object]"
                    ? [res.data]
                    : res.data
              });
            }
          }
        });
      }
    );
  };
  closeDetails = () => {
    this.setState(
      {
        open: false
      },
      () => {
        this.setState({
          details: [],
          order_info: {}
        });
      }
    );
  };
  copy = () => {
    this.props.enqueueSnackbar &&
      this.props.enqueueSnackbar("复制成功", { variant: "success" });
  };
  render() {
    const { classes } = this.props;
    const symbols_obj = this.props.config.symbols_obj;
    const data = this.state.order_info || {};
    const sideMap = CONST["sideMap"];
    const displayTokenId =
      data.symbolId &&
      symbols_obj.all[data.symbolId] &&
      symbols_obj.all[data.symbolId]["baseTokenFutures"]
        ? symbols_obj.all[data.symbolId]["baseTokenFutures"]["displayTokenId"]
        : "";
    return (
      <div className={classes.order}>
        <Grid
          container
          justify="space-between"
          className={classes.borderBottom}
        >
          <Grid item>
            <Tabs
              value={this.state.order_type}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                value="LIMIT"
                label={this.props.intl.formatMessage({ id: "普通委托" })}
                classes={{
                  fullWidth: classes.orderTab
                }}
              />
              <Tab
                value="STOP"
                label={this.props.intl.formatMessage({ id: "计划委托" })}
                classes={{
                  fullWidth: classes.orderTab
                }}
              />
              <Tab
                value="STOP_LOSS"
                label={this.props.intl.formatMessage({ id: "止盈止损" })}
                classes={{
                  fullWidth: classes.orderTab
                }}
              />
            </Tabs>
          </Grid>
          <Grid item></Grid>
        </Grid>
        <div>
          {(this.props.history_entrust || []).map((item, i) => {
            if (this.state.order_type == "STOP_LOSS") {
              if (item.type == "STOP" && item.planOrderType != "STOP_COMMON") {
                return (
                  <OrderItem
                    key={item.orderId}
                    n={i}
                    data={item}
                    order_type="STOP_LOSS"
                    symbols_obj={this.props.config.symbols_obj}
                    showDetails={this.showDetails}
                  />
                );
              }
            }
            return (
              <OrderItem
                key={item.orderId}
                n={i}
                data={item}
                symbols_obj={this.props.config.symbols_obj}
                showDetails={this.showDetails}
              />
            );
          })}
          {this.props.userinfo.userId ? (
            <div
              ref={ref => (this.list_status = ref)}
              className={classes.getMore}
            >
              {this.props.history_entrust_loading ? (
                <CircularProgress color="primary" size={24} />
              ) : this.props.history_entrust_more ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <Dialog open={this.state.open} onClose={this.closeDetails}>
          <DialogTitle>
            {this.props.intl.formatMessage({
              id: this.state.order_type == "STOP_LOSS" ? "订单详情" : "成交详情"
            })}
          </DialogTitle>
          <DialogContent>
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
                      data.side == "BUY_OPEN" ? classes.green : classes.red
                    }
                  >
                    {data.side && sideMap[data.side]
                      ? this.props.intl.formatMessage({
                          id: sideMap[data.side]
                        })
                      : ""}
                  </label>{" "}
                  {data.symbolName}{" "}
                </strong>
                {data.status
                  ? this.props.intl.formatMessage({ id: data.status })
                  : ""}{" "}
                {data.liquidationType == "IOC"
                  ? "(" + this.props.intl.formatMessage({ id: "强平" }) + ")"
                  : data.liquidationType == "ADL"
                  ? "(" + this.props.intl.formatMessage({ id: "减仓" }) + ")"
                  : ""}
              </Grid>
              <Grid item></Grid>
            </Grid>
            {this.state.details.map(item => {
              if (this.state.order_type == "STOP_LOSS") {
                return (
                  <Grid
                    container
                    className={classes.detailItem}
                    key={item.orderId}
                  >
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "合约" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {item.symbolName}
                    </Grid>
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "时间" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {moment
                        .utc(Number(item.time))
                        .local()
                        .format("HH:mm:ss YYYY-MM-DD")}
                    </Grid>
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "类型" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {data.priceType
                        ? this.props.intl.formatMessage({ id: data.priceType })
                        : ""}
                    </Grid>
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "方向" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {sideMap[item.side]
                        ? this.props.intl.formatMessage({
                            id: sideMap[item.side]
                          })
                        : ""}
                    </Grid>
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "数量" })}(
                        {this.props.intl.formatMessage({ id: "张" })})
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {item.origQty}
                    </Grid>
                    {/* <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "价格" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {item.priceType && item.priceType == "MARKET_PRICE"
                        ? "--"
                        : item.price}
                    </Grid> */}
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "成交均价" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {item.avgPrice}
                    </Grid>
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "已成交数量" })}(
                        {this.props.intl.formatMessage({ id: "张" })})
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {item.executedQty}
                    </Grid>
                    <Grid item xs={5}>
                      <span className={classes.grey500}>
                        {this.props.intl.formatMessage({ id: "状态" })}
                      </span>
                    </Grid>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      {this.props.intl.formatMessage({
                        id: item.status
                      })}
                      {item.liquidationType == "IOC"
                        ? "(" +
                          this.props.intl.formatMessage({ id: "强平" }) +
                          ")"
                        : item.liquidationType == "ADL"
                        ? "(" +
                          this.props.intl.formatMessage({ id: "减仓" }) +
                          ")"
                        : ""}
                    </Grid>
                  </Grid>
                );
              }
              return (
                <Grid
                  container
                  className={classes.detailItem}
                  key={item.tradeId}
                >
                  <Grid item xs={5}>
                    <span className={classes.grey500}>
                      {this.props.intl.formatMessage({ id: "时间" })}
                    </span>
                  </Grid>
                  <Grid item xs={7} style={{ textAlign: "right" }}>
                    {moment
                      .utc(Number(item.time))
                      .local()
                      .format("HH:mm:ss YYYY-MM-DD")}
                  </Grid>
                  <Grid item xs={5}>
                    <span className={classes.grey500}>
                      {this.props.intl.formatMessage({ id: "价格" })}
                    </span>
                  </Grid>
                  <Grid item xs={7} style={{ textAlign: "right" }}>
                    {item.price}
                  </Grid>
                  <Grid item xs={5}>
                    <span className={classes.grey500}>
                      {this.props.intl.formatMessage({ id: "数量" })}
                    </span>
                  </Grid>
                  <Grid item xs={7} style={{ textAlign: "right" }}>
                    {item.quantity}
                  </Grid>
                  <Grid item xs={5}>
                    <span className={classes.grey500}>
                      {this.props.intl.formatMessage({ id: "手续费" })}
                    </span>
                  </Grid>
                  <Grid item xs={7} style={{ textAlign: "right" }}>
                    {item.fee} {item.feeTokenName}
                  </Grid>
                  <Grid item xs={5}>
                    <span className={classes.grey500}>
                      {this.props.intl.formatMessage({ id: "盈亏" })}
                    </span>
                  </Grid>
                  <Grid item xs={7} style={{ textAlign: "right" }}>
                    {item.pnl} {item.quoteTokenName}
                  </Grid>
                  <Grid item xs={5}>
                    <span className={classes.grey500}>
                      {this.props.intl.formatMessage({ id: "成交单号" })}
                    </span>
                  </Grid>
                  <Grid item xs={7} style={{ textAlign: "right" }}>
                    <CopyToClipboard text={item.tradeId} onCopy={this.copy}>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end"
                        }}
                      >
                        {item.tradeId}
                        <Iconfont type="paste1" size="16" />
                      </p>
                    </CopyToClipboard>
                  </Grid>
                </Grid>
              );
            })}
            <div className={classes.getMore}>
              {this.props.loading &&
              this.props.loading.effects &&
              this.props.loading.effects["future/getHistoryEntrustDetails"] ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.closeDetails}
            >
              {this.props.intl.formatMessage({ id: "确定" })}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={this.state.dialog} onClose={this.dialog("close")}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "强平明细" })}
          </DialogTitle>
          <DialogContent>
            <p>
              {this.props.intl.formatMessage({
                id: "您的仓位保证金低于仓位维持保证金，所以触发强制平仓。"
              })}
            </p>
            <div style={{ margin: "10px 0" }}>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "时间" })}
                </Grid>
                <Grid item>
                  {this.state.dialog_info.time &&
                  Number(this.state.dialog_info.time)
                    ? moment
                        .utc(Number(this.state.dialog_info.time))
                        .local()
                        .format("YYYY-MM-DD HH:mm:ss")
                    : ""}
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "合约" })}
                </Grid>
                <Grid item>{this.state.dialog_info.symbol_name}</Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "强平价格" })}
                </Grid>
                <Grid item>{this.state.dialog_info.liquidationPrice}</Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                className={classes.qplayer}
              >
                <Grid item>
                  {this.props.intl.formatMessage({ id: "破产价格" })}
                </Grid>
                <Grid item>{this.state.dialog_info.price}</Grid>
              </Grid>
            </div>
            <span className={classes.qpdesc}>
              {this.props.intl.formatMessage({
                id:
                  "该仓位将按照破产价格（仓位保证金率=0时的价格）被强平引擎接管，并按照该委托价格结算仓位的收益。"
              })}
            </span>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={this.dialog("close")}
            >
              {this.props.intl.formatMessage({ id: "确认" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
