// 全网明细
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from "react-intl";
import { Grid, CircularProgress } from "@material-ui/core";
import classnames from "classnames";
import { Iconfont } from "../../lib";
import styles from "./card_style";
import moment from "moment";
import { parse, build } from "search-params";
import Scroll from "./scroll";
import Helper from "../../utils/helper";

class Card extends React.Component {
  constructor() {
    super();
    this.state = {
      channel: "1",
      needFixed: false,
    };
    this.parseSearch = this.parseSearch.bind(this);
    this.getMore = this.getMore.bind(this);
    this.changeChannel = this.changeChannel.bind(this);
    this.getCardCount = this.getCardCount.bind(this);
  }
  componentDidMount() {
    this.getCardCount();
    this.getMore(this.state.channel);
    this.someFunction();
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: "user/clearTableData",
      payload: {},
    });
  }
  someFunction = () => {
    window.onscroll = () => {
      let scrollTop = Math.max(
        document.body.scrollTop,
        document.documentElement.scrollTop
      );
      //控制元素块A随鼠标滚动固定在顶部
      this.setState({ needFixed: scrollTop > 1 });
    };
  };
  getMore(channel, newlist) {
    this.props.dispatch({
      type: "user/getTableData",
      payload: {
        status: channel,
        newlist: newlist ? true : false,
      },
      api: "card",
    });
  }
  getCardCount() {
    this.props.dispatch({
      type: "user/getCardCount",
      payload: {},
    });
  }
  parseSearch() {
    let search = (
      this.props.location.search || `page=0&size=${this.props.rowsPerPage}`
    ).replace("?", "");
    search = parse(search);
    return search;
  }
  renderStatus(classes, item) {
    let classname = item.status == 2 || item.status == 3 ? classes.used : "";
    let statusArr = { 1: "未解锁", 2: "已解锁", 3: "已过期" };
    return (
      <div className={classnames(classes.status, classname)}>
        {item.status == 1 ? (
          <Iconfont className={classes.iconColor} type="locked" size="20" />
        ) : (
          ""
        )}
        <span>
          {this.props.intl.formatMessage({ id: statusArr[item.status] })}
        </span>
      </div>
    );
  }
  async changeChannel(channel) {
    this.setState({
      channel: channel,
    });
    await this.props.dispatch({
      type: "user/clearTableData",
      payload: {},
    });
    this.getMore(channel, true);
  }
  renderItem(classes) {
    const search = this.parseSearch();
    let statusArr = { 1: "未解锁", 2: "已解锁", 3: "已过期" };
    if (
      !this.props.tableData.length &&
      this.props.loading.effects &&
      !this.props.loading.effects["user/getTableData"]
    ) {
      return (
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ height: 40 * 10 + "px" }}
        >
          <div className={classes.noData}>
            <img src={require("../../assets/noData.png")} />
            <p>{this.props.intl.formatMessage({ id: "这里还是空的" })}</p>
          </div>
        </Grid>
      );
    }
    return this.props.tableData.map((item, i) => {
      return (
        <div className={classes.item} key={i}>
          <div
            className={classnames(
              classes.card,
              item.status == 2 || item.status == 3 ? classes.expired : ""
            )}
          >
            <div className={classes.cardInfo}>
              <p>
                {item.cardName
                  ? this.props.intl.formatMessage({ id: item.cardName })
                  : ""}
              </p>
              <strong>
                {Helper.digits(item.parValue, 2)} {item.token.toUpperCase()}
              </strong>
              <em>
                {this.props.intl.formatMessage({ id: "有效期" })}:{" "}
                {moment
                  .utc(Number(item.startTime))
                  .local()
                  .format("YYYY/MM/DD")}{" "}
                -{moment.utc(Number(item.endTime)).local().format("YYYY/MM/DD")}
              </em>
              <p className={item.status == 1 ? "" : classes.grey}>
                {item.status == 1 ? (
                  <Iconfont
                    className={classes.iconColor}
                    type="locked"
                    size="16"
                  />
                ) : (
                  ""
                )}
                {this.props.intl.formatMessage({ id: statusArr[item.status] })}
              </p>
            </div>
            {this.renderStatus(classes, item)}
          </div>
          <div className={classes.info}>
            <div>
              <span>{this.props.intl.formatMessage({ id: "币券名称" })}:</span>
              <em>
                {item.cardName
                  ? this.props.intl.formatMessage({ id: item.cardName })
                  : ""}
              </em>
            </div>
            <div>
              <span>{this.props.intl.formatMessage({ id: "发放日期" })}:</span>
              <em>
                {moment
                  .utc(Number(item.releaseTime))
                  .local()
                  .format("YYYY/MM/DD HH:mm")}
              </em>
            </div>
            <div>
              <span>{this.props.intl.formatMessage({ id: "有效期" })}:</span>
              <em>
                {moment
                  .utc(Number(item.startTime))
                  .local()
                  .format("YYYY/MM/DD")}{" "}
                -{moment.utc(Number(item.endTime)).local().format("YYYY/MM/DD")}
              </em>
            </div>
            <div>
              <span>{this.props.intl.formatMessage({ id: "解锁条件" })}:</span>
              {item.type == 1 || item.type == 4 ? (
                <em>
                  {this.props.intl.formatMessage({
                    id:
                      item.type == 1
                        ? "用户成功完成一次交易且实名认证即可解锁"
                        : "本卡券无条件，自动解锁",
                  })}
                </em>
              ) : (
                <FormattedHTMLMessage
                  id={
                    item.type == 2
                      ? "被邀请人充值额到达{desc}{unit}后解锁"
                      : "户交易额每增加{desc}{unit}, 可按顺序解锁一张卡券"
                  }
                  values={{
                    desc: item.unlockValue,
                    unit: item.unlockToken,
                  }}
                  tagName="em"
                />
              )}
            </div>
            <div>
              <span>{this.props.intl.formatMessage({ id: "解锁时间" })}:</span>
              <em>
                {Number(item.unlockTime) == 0
                  ? this.props.intl.formatMessage({ id: "未解锁" })
                  : moment
                      .utc(Number(item.unlockTime))
                      .local()
                      .format("YYYY/MM/DD HH:mm")}
              </em>
            </div>
          </div>
        </div>
      );
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.list}>
        <div
          className={classnames(
            classes.nav,
            this.state.needFixed ? classes.navShadow : ""
          )}
        >
          <p
            className={this.state.channel === "1" ? classes.active : ""}
            onClick={this.changeChannel.bind(this, "1")}
          >
            {this.props.intl.formatMessage({ id: "未解锁" })}(
            {this.props.cardCount["1"] || 0})
          </p>
          <p
            className={this.state.channel === "2" ? classes.active : ""}
            onClick={this.changeChannel.bind(this, "2")}
          >
            {this.props.intl.formatMessage({ id: "已解锁" })}(
            {this.props.cardCount["2"] || 0})
          </p>
          <p
            className={this.state.channel === "3" ? classes.active : ""}
            onClick={this.changeChannel.bind(this, "3")}
          >
            {this.props.intl.formatMessage({ id: "已过期" })}(
            {this.props.cardCount["3"] || 0})
          </p>
        </div>
        <Scroll
          getMore={this.getMore}
          hasmore={this.props.hasmore}
          loading={
            this.props.loading.effects &&
            this.props.loading.effects["user/getTableData"]
          }
        >
          {this.renderItem(classes)}
        </Scroll>
        {/* {this.renderItem(classes)} */}
      </div>
    );
  }
}
export default withStyles(styles)(injectIntl(Card));
