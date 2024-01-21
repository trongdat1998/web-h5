// 交易页订单区
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Tabs,
  Tab,
  IconButton,
  MenuItem,
  Menu,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import OrderItem from "../public/orderItem";
import route_map from "../../config/route_map";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      confirm: false,
      anchorEl: null,
      subed: false,
    };
  }
  componentDidMount() {
    this.getMore("open_orders");
    this.getMore("trade_orders");
    this.loadMore();
  }
  loadMore = async () => {
    if (this.state.value === 0) {
      if (
        !this.props.open_orders_loading &&
        this.props.open_orders_more &&
        this.open_orders_status
      ) {
        const size = this.open_orders_status.getBoundingClientRect();
        if (size.top + size.height >= document.documentElement.clientHeight) {
          this.getMore("open_orders");
        }
      }
    }
    if (this.state.value === 1) {
      if (
        !this.props.trade_orders_loading &&
        this.props.trade_orders_more &&
        this.trade_orders_status
      ) {
        const size = this.trade_orders_status.getBoundingClientRect();
        if (size.top + size.height >= document.documentElement.clientHeight) {
          this.getMore("trade_orders");
        }
      }
    }
    await helper.delay(1000);
    this.loadMore();
  };
  componentDidUpdate(preProps) {
    // symbol_id存在后在订阅， 方便过滤推送的数据
    if (
      this.props.ws &&
      !this.state.subed &&
      this.props.userinfo.userId &&
      this.props.symbol_id
    ) {
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
    if (preProps.symbol_id != this.props.symbol_id) {
      WSDATA.clear("order_source");
      this.props.dispatch({
        type: "exchange/save",
        payload: {
          open_orders_loading: false,
          open_orders_more: true,
          open_orders: [],
          trade_orders_more: true,
          trade_orders_loading: false,
          trade_orders: [],
        },
      });
      this.getMore("open_orders");
      this.getMore("trade_orders");
    }
  }
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "exchange/order_http",
      payload: {
        symbol_id: this.props.symbol_id,
      },
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
        symbol_id: (
          this.props.match.params.token1 +
          this.props.match.params.token2 +
          ""
        ).toUpperCase(),
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
          payload: {
            symbol_ids: this.props.symbol_id,
          },
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
      anchorEl: null,
    });
  };
  handleChange = (e, v) => {
    this.setState({
      value: v,
    });
  };
  goto = (token1, token2) => (e) => {
    window.location.href = route_map.order;
  };
  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  handleClick = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
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
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.order}>
        <Grid container justify="space-between">
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
                classes={{
                  fullWidth: classes.orderTab,
                }}
              />
              <Tab
                value={1}
                label={this.props.intl.formatMessage({ id: "历史委托" })}
                classes={{
                  fullWidth: classes.orderTab,
                }}
              />
            </Tabs>
          </Grid>
          <Grid item>
            <IconButton
              aria-haspopup="true"
              aria-controls="long-menu"
              onClick={this.handleClick}
            >
              <Iconfont type="moreAction" size="24" />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.confirm_open}>
                {this.props.intl.formatMessage({ id: "全部撤单" })}
                {this.props.token1_name}
                {this.props.token2_name}
              </MenuItem>
              <MenuItem
                onClick={this.goto(this.props.token1, this.props.token2)}
              >
                {this.props.intl.formatMessage({ id: "查看全部订单" })}
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        {this.state.value === 0 ? (
          <div>
            {(this.props.open_orders || []).map((item, i) => {
              return (
                <OrderItem
                  key={item.orderId}
                  n={i}
                  data={item}
                  symbols_obj={this.props.config.symbols_obj}
                  cancel_order={this.cancel_order}
                />
              );
            })}
            {this.props.userinfo.userId ? (
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
            ) : (
              ""
            )}
          </div>
        ) : (
          <div>
            {(this.props.trade_orders || []).map((item, i) => {
              return (
                <OrderItem
                  key={item.orderId}
                  n={i}
                  data={item}
                  symbols_obj={this.props.config.symbols_obj}
                />
              );
            })}
            {this.props.userinfo.userId ? (
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
            ) : (
              ""
            )}
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
