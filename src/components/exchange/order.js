// 订单区
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  TextField,
  Select,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import OrderItem from "../public/orderItem";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      confirm: false,
      anchorEl: null,
      subed: false,
      side: "ALL",
      token1: "",
      token2: "ALL",
      open: false,
    };
  }
  componentDidMount() {
    this.getMore("open_orders");
    this.getMore("trade_orders");
    this.loadMore();
  }
  loadMore = async () => {
    if (this.state.value === 0) {
      if (!this.props.open_orders_loading && this.props.open_orders_more) {
        const size = this.open_orders_status.getBoundingClientRect();
        if (size.top + size.height >= document.documentElement.clientHeight) {
          this.getMore("open_orders");
        }
      }
    }
    if (this.state.value === 1) {
      if (!this.props.trade_orders_loading && this.props.trade_orders_more) {
        const size = this.trade_orders_status.getBoundingClientRect();
        if (size.top + size.height >= document.documentElement.clientHeight) {
          this.getMore("trade_orders");
        }
      }
    }
    await helper.delay(500);
    this.loadMore();
  };
  componentDidUpdate() {
    // symbol_id存在后在订阅， 方便过滤推送的数据
    if (this.props.ws && !this.state.subed && this.props.userinfo.userId) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.ws.sub(
            {
              id: "order",
              topic: "order",
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
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "exchange/order_http",
      payload: {},
    });
  };
  callback = (data) => {
    data.data && data.data.length && WSDATA.setData("order_source", data.data);
  };
  // 获取更多
  getMore = (column) => {
    this.props.dispatch({
      type: "exchange/getOrders",
      payload: {
        column,
      },
    });
  };
  cancel_all = () => {
    this.setState(
      {
        confirm: false,
      },
      () => {
        this.props.dispatch({
          type: "exchange/order_cancel_all",
          payload: {},
          enqueueSnackbar: this.props.enqueueSnackbar,
        });
      }
    );
  };
  confirm_cancel = () => {
    this.setState({
      confirm: false,
    });
  };
  confirm_open = () => {
    this.setState({
      confirm: true,
    });
  };
  handleChange = (e, v) => {
    this.setState({
      value: v,
    });
  };
  goto = (e) => {
    window.history.back();
  };

  cancel_order = (data, i) => {
    this.props.dispatch({
      type: "exchange/orderCancel",
      payload: {
        order_id: data.orderId,
        client_order_id: new Date().getTime(),
        account_id: data.accountId,
        i,
      },
      enqueueSnackbar: this.props.enqueueSnackbar,
    });
  };
  tokenChange = (key) => (e) => {
    this.setState({
      [key]: (e.target.value || "").toUpperCase(),
    });
  };
  toggleSelelct = () => {
    this.setState({
      open: !this.state.open,
      token1: this.state.open ? "" : this.state.token1,
      token2: this.state.open ? "ALL" : this.state.token2,
      side: this.state.open ? "ALL" : this.state.side,
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.order}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.order_nav}
        >
          <Grid item onClick={this.goto}>
            <strong>
              <Iconfont type="back" size="20" />
              {this.props.intl.formatMessage({ id: "订单" })}
            </strong>
          </Grid>
          <Grid item onClick={this.toggleSelelct}>
            {this.props.intl.formatMessage({ id: "筛选" })}
            {this.state.open ? (
              <Iconfont type="arrowUp" size="24" />
            ) : (
              <Iconfont type="arrowDown" size="24" />
            )}
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          className={classes.selectSymbol}
          style={{ height: this.state.open ? 40 : 0 }}
        >
          <Grid item>
            <div className={classes.chooseSymbol}>
              <TextField
                value={this.state.token1}
                onChange={this.tokenChange("token1")}
                style={{ margin: "0 5px 0 0", width: 60 }}
                placeholder={this.props.intl.formatMessage({ id: "币种" })}
              />
              <span className={classes.grey}>/</span>
              <Select
                native
                value={this.state.token2}
                onChange={this.tokenChange("token2")}
                style={{ margin: "0 15px 0 5px" }}
              >
                <option value="ALL">
                  {this.props.intl.formatMessage({ id: "全部" })}
                </option>
                {(this.props.config.quoteToken || []).map((item) => {
                  return (
                    <option key={item.tokenId} value={item.tokenId}>
                      {item.tokenName}
                    </option>
                  );
                })}
              </Select>
              <Select
                native
                style={{ margin: "0 15px 0 0" }}
                value={this.state.side}
                onChange={this.tokenChange("side")}
              >
                <option value="ALL">
                  {this.props.intl.formatMessage({ id: "全部" })}
                </option>
                <option value="BUY">
                  {this.props.intl.formatMessage({ id: "买入" })}
                </option>
                <option value="SELL">
                  {this.props.intl.formatMessage({ id: "卖出" })}
                </option>
              </Select>
            </div>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                this.setState({
                  side: "ALL",
                  token2: "ALL",
                  token1: "",
                });
              }}
            >
              {this.props.intl.formatMessage({ id: "重置" })}
            </Button>
          </Grid>
        </Grid>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                value={0}
                label={this.props.intl.formatMessage({ id: "当前委托" })}
              />
              <Tab
                value={1}
                label={this.props.intl.formatMessage({ id: "历史委托" })}
              />
            </Tabs>
          </Grid>
          <Grid item>
            <Button size="small" onClick={this.confirm_open}>
              {this.props.intl.formatMessage({ id: "全部撤单" })}
            </Button>
          </Grid>
        </Grid>
        {this.state.value === 0 ? (
          <div>
            {(this.props.open_orders || []).map((item, i) => {
              if (
                (!this.state.token1 ||
                  item.baseTokenName.indexOf(this.state.token1) > -1 ||
                  item.baseTokenId.indexOf(this.state.token1) > -1) &&
                (item.quoteTokenId == this.state.token2 ||
                  this.state.token2 == "ALL") &&
                (item.side == this.state.side || this.state.side == "ALL")
              ) {
                return (
                  <OrderItem
                    key={item.orderId}
                    n={i}
                    data={item}
                    symbols_obj={this.props.config.symbols_obj}
                    cancel_order={this.cancel_order}
                    type="open_orders"
                  />
                );
              }
            })}
            <div
              ref={(ref) => (this.open_orders_status = ref)}
              className={classes.getMore}
            >
              {this.props.open_orders_loading ? (
                <CircularProgress color="primary" size={24} />
              ) : this.props.open_orders_more ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            {(this.props.trade_orders || []).map((item, i) => {
              if (
                (!this.state.token1 ||
                  item.baseTokenName.indexOf(this.state.token1) > -1 ||
                  item.baseTokenId.indexOf(this.state.token1) > -1) &&
                (item.quoteTokenId == this.state.token2 ||
                  this.state.token2 == "ALL") &&
                (item.side == this.state.side || this.state.side == "ALL")
              ) {
                return (
                  <OrderItem
                    key={item.orderId}
                    n={i}
                    data={item}
                    symbols_obj={this.props.config.symbols_obj}
                    cancel_order={this.cancel_order}
                    type="trade_orders"
                  />
                );
              }
            })}
            <div
              ref={(ref) => (this.trade_orders_status = ref)}
              className={classes.getMore}
            >
              {this.props.trade_orders_loading ? (
                <CircularProgress color="primary" size={24} />
              ) : this.props.trade_orders_more ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
              )}
            </div>
          </div>
        )}
        <Dialog open={this.state.confirm}>
          <DialogTitle>
            {this.props.intl.formatMessage({ id: "撤单确认" })}
          </DialogTitle>
          <DialogContent>
            <p style={{ margin: "0 0 15px" }}>
              {this.props.intl.formatMessage({
                id: "请确认您要撤销当前全部币币委托单？",
              })}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.confirm_cancel}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            <Button onClick={this.cancel_all} color="primary">
              {this.props.intl.formatMessage({ id: "确认" })}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
