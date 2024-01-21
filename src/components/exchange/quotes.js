// 行情页
import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  ButtonGroup,
  Button,
  TextField,
  Icon,
  OutlinedInput,
} from "@material-ui/core";
import TextFieldCN from "../../components/public/textfiled";
import { Iconfont } from "../../lib";
import styles from "./style";
import SwipeableViews from "react-swipeable-views";
import TokenItem from "../index/token";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";

class Quotes extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      search: false,
      search_text: "",
      quoteTokens: ["fav"],
      quoteToken: 1,
      favTokens: {},
      tab: 0,
      functions: [],
      sort: [0, 0, 0], // 成交量，最新价，涨跌幅， 0=无排序，1=从高到底，2=从低到高
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
      quoteTokens: ["fav", ...this.props.config.customQuoteToken],
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
  changeIndex = (i) => () => {
    this.setState({
      quoteToken: i,
    });
  };
  onChangeIndex = (v) => {
    this.setState({
      quoteToken: v,
    });
  };
  search = (e) => {
    this.setState({
      search_text: (e.target.value || "").toUpperCase(),
      //quoteToken: "-1"
    });
  };
  openSearch = () => {
    this.setState({
      search: true,
    });
  };
  closeSearch = (key) => (e) => {
    if (key) {
      this.setState({
        search: false,
        search_text: "",
      });
    } else {
      if (!this.state.search_text) {
        this.setState({
          search: false,
        });
      }
    }
  };
  sort = (i) => (e) => {
    let d = [0, 0, 0];
    d[i] = this.state.sort[i];
    d[i]++;
    if (d[i] > 2) {
      d[i] = 0;
    }
    this.setState({
      sort: d,
    });
  };
  changStep = (index) => () => {
    let quoteTokens = ["fav", ...this.props.config.customQuoteToken];
    if (this.state.functions[index] == "合约") {
      quoteTokens = this.props.config.futuresUnderlying;
    }
    this.setState({
      tab: index,
      quoteTokens,
      quoteToken: quoteTokens[0] == "fav" ? 1 : 0,
    });
  };
  render() {
    const { classes, config } = this.props;
    const symbols_obj = this.props.config.symbols_obj;
    const symbol_quote = this.props.symbol_quote;

    const data = [];

    const quoteToken = this.props.config.customQuoteToken;
    if (this.state.functions[this.state.tab] == "币币") {
      if (this.state.quoteToken == 0) {
        quoteToken.map((item) => {
          (item.quoteTokenSymbols || []).map((it) => {
            if (
              this.props.favorite[it.symbolId] &&
              `${it.symbolId}${it.symbolName}`.indexOf(
                (this.state.search_text || "").toUpperCase()
              ) > -1
            ) {
              if (
                data.findIndex((item) => item.symbolId == it.symbolId) == -1 &&
                it.showStatus
              ) {
                const q = symbol_quote[it.symbolId];
                data.push({ ...it, ...q, s: it.symbolId });
              }
            }
          });
        });
      }
      if (this.state.quoteToken > 0) {
        quoteToken.length &&
          (
            (quoteToken[this.state.quoteToken - 1] || {})[
              "quoteTokenSymbols"
            ] || []
          ).map((item) => {
            if (
              `${item.symbolId}${item.symbolName}`.indexOf(
                (this.state.search_text || "").toUpperCase()
              ) > -1 &&
              item.showStatus
            ) {
              const q = symbol_quote[item.symbolId];
              data.push({ ...item, ...q, s: item.symbolId });
            }
          });
      }
    } else {
      Object.keys(symbols_obj.all).map((item) => {
        const d = symbol_quote[item];
        if (!d) {
          return;
        }
        // // 币币
        // if (this.state.functions[this.state.tab] == "币币") {
        //   if (symbols_obj.coin[item] && symbols_obj.coin[item]["showStatus"]) {
        //     if (this.state.quoteToken == 0) {
        //       if (
        //         this.props.favorite[d.s] &&
        //         item.indexOf(this.state.search_text) > -1
        //       ) {
        //         data.push(d);
        //       }
        //     }
        //     if (this.state.quoteToken > 0) {
        //       const reg = new RegExp(
        //         `${this.state.quoteTokens[this.state.quoteToken]["tokenId"]}$`
        //       );
        //       if (reg.test(item) && item.indexOf(this.state.search_text) > -1) {
        //         data.push(d);
        //       }
        //     }
        //   }
        // }
        // 合约
        if (this.state.functions[this.state.tab] == "合约") {
          const s = symbols_obj.futures[item];
          if (
            s &&
            this.state.quoteTokens[this.state.quoteToken] &&
            s.firstLevelUnderlyingId ==
              this.state.quoteTokens[this.state.quoteToken]["id"]
          ) {
            data.push(d);
          }
        }
      });
    }
    // 从高到低
    data.sort((a, b) => {
      // 成交量，
      if (this.state.sort[0] > 0) {
        if (a.v == b.v) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[0] == 1) {
          return Number(a.v || 0) > Number(b.v || 0) ? -1 : 1;
        } else {
          return Number(a.v || 0) > Number(b.v || 0) ? 1 : -1;
        }
      }
      // 最新价
      if (this.state.sort[1] > 0) {
        if (a.c == b.c) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[1] == 1) {
          return Number(a.c || 0) >= Number(b.c || 0) ? -1 : 1;
        } else {
          return Number(a.c || 0) > Number(b.c || 0) ? 1 : -1;
        }
      }
      // 涨跌幅
      if (this.state.sort[2] > 0) {
        if (a.m == b.m) {
          return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
        }
        if (this.state.sort[2] == 1) {
          return Number(a.m || 0) >= Number(b.m || 0) ? -1 : 1;
        } else {
          return Number(a.m || 0) > Number(b.m || 0) ? 1 : -1;
        }
      }
      // 涨跌幅
      // if (a.m == b.m) {
      //   return a.s.toUpperCase() > b.s.toUpperCase() ? 1 : -1;
      // }
      //return a.m > b.m ? -1 : 1;
    });
    return (
      <div className={classes.quotes}>
        <Grid
          container
          alignItems="center"
          justify="center"
          className={classes.quotesTypes}
        >
          <Grid item>
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              {this.state.functions.map((item, i) => {
                if (i == this.state.tab) {
                  return (
                    <Button variant="contained" key={item}>
                      {this.props.intl.formatMessage({
                        id: this.state.functions[i],
                      })}
                    </Button>
                  );
                } else {
                  return (
                    <Button onClick={this.changStep(i)} key={item}>
                      {this.props.intl.formatMessage({
                        id: this.state.functions[i],
                      })}
                    </Button>
                  );
                }
              })}
            </ButtonGroup>
          </Grid>
        </Grid>

        <div className={classes.searchbox}>
          <div style={{ flex: 1, overflowX: "auto" }}>
            <Grid
              container
              alignItems="center"
              className={classes.quoteTokens}
              justify={
                this.state.functions[this.state.tab] == "币币"
                  ? "flex-start"
                  : "space-around"
              }
              wrap="nowrap"
            >
              {this.state.quoteTokens.map((item, i) => {
                if (item == "fav") {
                  return (
                    <Grid item key={item + i}>
                      <Button
                        color={
                          this.state.quoteToken == 0 ? "primary" : "default"
                        }
                        onClick={this.changeIndex(i)}
                        size="small"
                      >
                        {this.state.quoteToken == 0 ? (
                          <Iconfont type="favorited" size="24" />
                        ) : (
                          <Iconfont type="favorite" size="24" />
                        )}
                      </Button>
                    </Grid>
                  );
                }
                return (
                  <Grid item key={item + i}>
                    <Button
                      onClick={this.changeIndex(i)}
                      className={classes.subtitle2}
                      color={this.state.quoteToken == i ? "primary" : "default"}
                      size="small"
                      style={{
                        fontSize: "0.8rem",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name || item.tokenFullName || item.tokenName}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </div>
          {this.state.functions[this.state.tab] == "币币" ? (
            <div
              style={{
                width: this.state.search ? 120 : 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 14px 0 14px",
              }}
            >
              {this.state.search ? (
                <TextFieldCN
                  textType="OutlinedInput"
                  value={this.state.search_text}
                  autoFocus
                  onChange={this.search}
                  onBlur={this.closeSearch(0)}
                  classes={{
                    input: classes.search_input,
                  }}
                  endAdornment={
                    <Iconfont type="close" onClick={this.closeSearch(1)} />
                  }
                />
              ) : (
                <Iconfont type="search" size={24} onClick={this.openSearch} />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <Grid
          container
          className={classes.sort}
          justify="space-around"
          alignItems="center"
        >
          {this.state.sort.map((item, i) => {
            return (
              <Grid item key={"sort" + i}>
                <Button
                  size="small"
                  color={item != 0 ? "primary" : "default"}
                  variant={item != 0 ? "contained" : "text"}
                  onClick={this.sort(i)}
                >
                  {this.props.intl.formatMessage({
                    id: ["24H成交量", "最新价", "24H涨跌幅"][i],
                  })}
                  {item == 2 ? <Iconfont type="positive" /> : ""}
                  {item == 1 ? <Iconfont type="reverse" /> : ""}
                </Button>
              </Grid>
            );
          })}
        </Grid>
        <div style={{ padding: "0 0 0 24px" }}>
          {data.map((it) => {
            let type = "";
            if (symbols_obj.coin[it.s]) {
              type = "币币";
            }
            if (symbols_obj.futures[it.s]) {
              type = "合约";
            }
            if (type == this.state.functions[this.state.tab]) {
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
        {/* </SwipeableViews> */}
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Quotes));
