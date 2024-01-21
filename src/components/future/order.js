// 订单区
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Grid, Tabs, Tab } from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./style";
import Position from "./position_list";
import CurrentList from "./tradingHistory";
import HistoryEntrust from "./history_entrust_list";
import HistoryOrder from "./history_order_list";

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: 0
    };
  }
  componentDidMount() {}

  componentDidUpdate() {}
  tabChange = (e, v) => {
    this.setState({
      tab: v
    });
  };
  goto = e => {
    window.history.back();
  };

  render() {
    const { classes, ...otherProps } = this.props;
    return (
      <div className={classes.future_order}>
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
          <Grid item></Grid>
        </Grid>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={this.state.tab}
          onChange={this.tabChange}
          variant="fullWidth"
          classes={{
            root: classes.tabsRoot
          }}
        >
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "持仓" })}
          />
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "当前委托" })}
          />
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "历史委托" })}
          />
          <Tab
            classes={{
              root: classes.tabRoot
            }}
            label={this.props.intl.formatMessage({ id: "历史成交" })}
          />
        </Tabs>
        {this.state.tab == 0 ? <Position {...otherProps} /> : ""}
        {this.state.tab == 1 ? <CurrentList {...otherProps} /> : ""}
        {this.state.tab == 2 ? <HistoryEntrust {...otherProps} /> : ""}
        {this.state.tab == 3 ? <HistoryOrder {...otherProps} /> : ""}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
