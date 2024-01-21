// 首页
import React from "react";
import { injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { withStyles } from "@material-ui/core/styles";
import { MobileStepper, Grid } from "@material-ui/core";
import { Iconfont } from "../../lib";
import styles from "./index_style";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import TokenItem from "./token";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import CONST from "../../config/const";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      activeStep2: 0,
      tab: 0,
      functions: [],
      subed: false,
    };
  }
  componentDidMount() {
    let funs = [];
    let functions = this.props.config.functions || {};
    if (functions.exchange) {
      funs.push("币币");
    }
    if (functions.futures) {
      funs.push("合约");
    }
    this.setState({
      functions: funs,
    });
  }
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.props.qws.sub(
            {
              id: "broker",
              topic: "slowBroker",
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
  }
  httpAction = (payload) => {
    return this.props.dispatch({
      type: "ws/broker_quote_http",
      payload,
    });
  };
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("symbol_quote_source", data.data);
  };
  handleStepChange = (key) => (step) => {
    this.setState({
      [key]: step,
    });
  };
  changStep = (index) => () => {
    this.setState({
      tab: index,
    });
  };
  goto = (url) => (e) => {
    window.location.href = url;
  };
  render() {
    const { classes } = this.props;
    const banners =
      this.props.index_config && this.props.index_config.banners
        ? this.props.index_config.banners
        : [];
    const announcements =
      this.props.index_config && this.props.index_config.announcements
        ? this.props.index_config.announcements
        : [];
    const symbols_obj = this.props.config.symbols_obj;
    const data = [];
    Object.keys(this.props.symbol_quote).map((item) => {
      if (symbols_obj.coin[item]) {
        if (symbols_obj.coin[item]["showStatus"]) {
          data.push(this.props.symbol_quote[item]);
        }
      } else {
        data.push(this.props.symbol_quote[item]);
      }
    });
    data.sort((a, b) => {
      if (a.m == b.m) {
        return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
      }
      return a.m > b.m ? -1 : 1;
    });
    return (
      <div className={classes.home}>
        <div className={classes.banner}>
          <AutoPlaySwipeableViews
            axis={"x-reverse"}
            index={this.state.activeStep}
            onChangeIndex={this.handleStepChange("activeStep")}
            interval={10000}
            enableMouseEvents
          >
            {banners.map((step, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  height: 150,
                  background: `url(${step.imgUrl}) no-repeat center / auto 100%`,
                }}
              >
                {step.directUrl ? (
                  <a
                    href={step.directUrl}
                    style={{ width: "100%", height: "100%", display: "block" }}
                  ></a>
                ) : (
                  ""
                )}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            variant="dots"
            steps={banners.length}
            position="static"
            activeStep={this.state.activeStep}
            classes={{
              root: classes.stepper,
              dot: classes.dot,
              dotActive: classes.dotActive,
            }}
          ></MobileStepper>
        </div>
        <Grid container className={classes.messages} alignItems="center">
          <Grid item style={{ padding: "0 6px 0 0" }}>
            <Iconfont type="announcement" size="20" />
          </Grid>
          <Grid item style={{ height: 24, overflow: "hidden", flex: 1 }}>
            {announcements.length ? (
              <AutoPlaySwipeableViews
                axis="y"
                index={this.state.activeStep2}
                onChangeIndex={this.handleStepChange("activeStep2")}
                interval={6000}
                enableMouseEvents
                containerStyle={{ height: 24 }}
              >
                {announcements.map((step, index) => (
                  <div key={index} className={classes.announcements}>
                    {step.isDirect ? (
                      <a href={step.directUrl}>{step.title}</a>
                    ) : (
                      step.directUrl
                    )}
                  </div>
                ))}
              </AutoPlaySwipeableViews>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
        <div className={classes.recommend}>
          <Grid
            container
            alignItems="center"
            style={{
              width: `${
                ((this.props.config.recommendSymbols.length || 0) / 3) * 100
              }%`,
              padding: "12px 0",
            }}
            justify="space-around"
          >
            {(this.props.config.recommendSymbols || []).map((item) => {
              const info = symbols_obj.all[item.symbolId] || {};
              const d = this.props.symbol_quote[item.symbolId] || {};
              const isCoin = Boolean(symbols_obj.coin[item.symbolId]);
              const coin_qv = info.baseTokenFutures
                ? info.baseTokenFutures.displayTokenId
                : info.quoteTokenId;
              const cRates = d.c
                ? helper.currencyValue(
                    this.props.rates,
                    d.c,
                    coin_qv,
                    this.props.unit
                  )
                : ["", "--"];
              return (
                <Grid
                  item
                  key={item.symbolId}
                  className={classes.recommendItem}
                  onClick={this.goto(
                    isCoin
                      ? route_map.exchange +
                          "/" +
                          info.baseTokenId +
                          "/" +
                          info.quoteTokenId
                      : `${route_map.future_quotes}/${info.symbolId}`
                  )}
                >
                  <p>
                    {isCoin
                      ? `${info.baseTokenName}/${info.quoteTokenName}`
                      : info.symbolName}
                  </p>
                  <strong className={d.m >= 0 ? "green" : "red"}>
                    {d.c
                      ? helper.digits(
                          d.c,
                          CONST["depth"][info["minPricePrecision"]]
                        )
                      : "--"}
                  </strong>
                  <span className={d.m >= 0 ? "green" : "red"}>
                    {d.m > 0 ? "+" : ""}
                    {d.m || Number(d.m) === 0
                      ? Math.floor(d.m * 10000) / 100 + "%"
                      : "--"}
                  </span>
                  <span>
                    ≈ {cRates[0]}
                    {cRates[1]}
                  </span>
                </Grid>
              );
            })}
          </Grid>
        </div>

        <div className={classes.content}>
          <h2>{this.props.intl.formatMessage({ id: "24H涨幅榜" })}</h2>
          <Grid container className={classes.tab}>
            {this.state.functions.map((item, i) => {
              // {/* {["币币"].map((item, i) => { */}
              return (
                <Grid item key={item}>
                  <span
                    onClick={this.changStep(i)}
                    className={this.state.tab == i ? classes.choose : ""}
                  >
                    {this.props.intl.formatMessage({ id: item })}
                  </span>
                </Grid>
              );
            })}
          </Grid>
        </div>
        <SwipeableViews
          animateHeight
          enableMouseEvents
          index={this.state.tab}
          onChangeIndex={this.handleStepChange("tab")}
          className={classes.tabs}
        >
          {this.state.functions.map((item, i) => {
            return (
              <div className={classes.tokenList} key={item}>
                {data.map((it) => {
                  let type = "";
                  if (symbols_obj.coin[it.s]) {
                    type = "币币";
                  }
                  if (symbols_obj.futures[it.s]) {
                    type = "合约";
                  }
                  if (
                    type == this.state.functions[this.state.tab] &&
                    i == this.state.tab
                  ) {
                    return (
                      <TokenItem
                        key={it.s}
                        type={type}
                        data={it}
                        rates={this.props.rates}
                        unit={this.props.unit}
                        symbols_obj={symbols_obj}
                      />
                    );
                  }
                })}
              </div>
            );
          })}
        </SwipeableViews>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
