// 交易页订单区; 当前委托
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
  CircularProgress
} from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import OrderItem from "./currentItem";
import route_map from "../../config/route_map";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      order_type: "LIMIT", // LIMIT|STOP
      anchorEl: null,
      subed: false
    };
  }
  componentDidMount() {
    this.getMore(true);
  }
  componentDidUpdate(preProps) {
    if (
      this.props.ws &&
      !this.state.subed &&
      this.props.userinfo.userId &&
      (window.location.href.indexOf(route_map.future_order) == -1
        ? this.props.symbol_id
        : true)
    ) {
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
          // 当前持仓
          // this.props.ws.sub(
          //   {
          //     id: "futures_position",
          //     topic: "futures_position",
          //     event: "sub",
          //     params: {
          //       org: this.props.config.orgId,
          //       binary: !Boolean(window.localStorage.ws_binary)
          //     }
          //   },
          //   this.httpAction2,
          //   this.callback2
          // );
        }
      );
    }
    if (preProps.symbol_id && preProps.symbol_id != this.props.symbol_id) {
      WSDATA.clear("future_order_source");
      this.props.dispatch({
        type: "future/save",
        payload: {
          current_list_loading: false,
          current_list_more: true,
          current_list: []
        }
      });
      this.getMore(true);
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
  // 当前委托http
  httpAction = payload => {
    // 当前委托
    return this.props.dispatch({
      type: "future/updateCurrentEntrust",
      payload: {
        order_type: this.state.order_type
      }
    });
  };
  callback = data => {
    data && data.data && WSDATA.setData("future_order_source", data.data);
  };
  // 获取更多
  getMore = firstReq => {
    let params = {};
    params.firstReq = firstReq;
    let obj = { ...params };
    obj.type = this.state.order_type;
    obj.order_type = this.state.order_type;
    obj.symbol_id = this.props.match.params.symbol_id || "";
    this.props.dispatch({
      type: "future/getCurrentEntrust",
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
            current_list: [],
            current_list_more: true,
            current_list_loading: false
          }
        });
        this.getMore(true);
      }
    );
  };
  goto = (token1, token2) => e => {
    window.location.href = route_map.future_order;
  };
  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };
  handleClick = e => {
    this.setState({
      anchorEl: e.currentTarget
    });
  };
  cancel_order = (data, i) => {
    return this.props.dispatch({
      type: "future/cancelOrder",
      payload: {
        order_id: data.orderId,
        client_order_id: new Date().getTime(),
        account_id: data.accountId,
        type: data.type,
        i
      },
      enqueueSnackbar: this.props.enqueueSnackbar
    });
  };
  cancel_loss_order = (data, i) => {
    return this.props.dispatch({
      type: "future/cancelOrder",
      payload: {
        order_id: data.orderId,
        client_order_id: new Date().getTime(),
        account_id: data.accountId,
        type: "STOP"
      },
      enqueueSnackbar: this.props.enqueueSnackbar
    });
  };
  render() {
    const { classes } = this.props;
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
          <Grid item>
            {window.location.href.indexOf(route_map.future_order) == -1 ? (
              <IconButton
                aria-haspopup="true"
                aria-controls="long-menu"
                onClick={this.handleClick}
              >
                <Iconfont type="moreAction" size="24" />
              </IconButton>
            ) : (
              ""
            )}
            <Menu
              id="long-menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.goto()}>
                {this.props.intl.formatMessage({ id: "查看全部订单" })}
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>
        <div>
          {(this.props.current_list || []).map((item, i) => {
            if (this.state.order_type == "STOP_LOSS") {
              if (item.type == "STOP" && item.planOrderType != "STOP_COMMON") {
                return (
                  <OrderItem
                    key={item.orderId}
                    n={i}
                    data={item}
                    order_type="STOP_LOSS"
                    symbols_obj={this.props.config.symbols_obj}
                    cancel_order={this.cancel_loss_order}
                  />
                );
              }
            }
            return (
              <OrderItem
                key={item.orderId}
                n={i}
                data={item}
                order_type="LIMIT|STOP"
                symbols_obj={this.props.config.symbols_obj}
                cancel_order={this.cancel_order}
              />
            );
          })}
          {this.props.userinfo.userId ? (
            <div
              ref={ref => (this.current_list_status = ref)}
              className={classes.getMore}
            >
              {this.props.current_list_loading ? (
                <CircularProgress color="primary" size={24} />
              ) : this.props.current_list_more ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
