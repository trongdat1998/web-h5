// 历史成交列表页
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
import OrderItem from "./history_order_item";
import route_map from "../../config/route_map";

let rcState = false;
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
    rcState = true;
    this.getMore(true);
    this.loadMore();
    this.httpAction();
  }
  componentWillUnmount() {
    rcState = false;
  }
  // 历史委托http
  httpAction = async payload => {
    if (!rcState) return;
    // 历史委托
    try {
      await this.props.dispatch({
        type: "future/updateHistoryOrder",
        payload: {
          params: {}
        }
      });
    } catch (e) {}
    await helper.delay(5000);
    this.httpAction();
  };
  loadMore = async () => {
    if (!rcState || !this.list_status) return;
    const size = this.list_status.getBoundingClientRect();
    if (
      size.top + size.height <= document.documentElement.clientHeight &&
      this.props.history_order_more
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
      type: "future/getHistoryOrder",
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
            history_order: [],
            history_order_more: true,
            history_order_loading: false
          }
        });
        this.getMore(true);
      }
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.order}>
        <div>
          {(this.props.history_order || []).map((item, i) => {
            if (item.liquidationType != "IOC") {
              return (
                <OrderItem
                  key={item.tradeId}
                  n={i}
                  data={item}
                  symbols_obj={this.props.config.symbols_obj}
                />
              );
            }
          })}
          {this.props.userinfo.userId ? (
            <div
              ref={ref => (this.list_status = ref)}
              className={classes.getMore}
            >
              {this.props.history_order_loading ? (
                <CircularProgress color="primary" size={24} />
              ) : this.props.history_order_more ? (
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
