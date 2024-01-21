import React from "react";
import TradingView from "../../utils/charting_library.min";
import DataFeed from "./dataFeed";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import moment from "moment-timezone";
import CONST from "../../config/const";
import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { CircularProgress, Grid, Button } from "@material-ui/core";
import { Iconfont } from "../../lib";
import { injectIntl } from "react-intl";
import WSDATA from "../../models/data_source";

function toFullScreen(dom) {
  if (dom.requestFullscreen) {
    return dom.requestFullscreen();
  } else if (dom.webkitEnterFullScreen) {
    return dom.webkitEnterFullScreen();
  } else if (dom.webkitRequestFullScreen) {
    return dom.webkitRequestFullScreen();
  } else if (dom.mozRequestFullScreen) {
    return dom.mozRequestFullScreen();
  } else if (dom.msRequestFullscreen) {
    return dom.msRequestFullscreen();
  }
}

let datafeed;
class KlineRC extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      resolution: 15,
      res: "15m",
      // k线价格精度
      k: {
        0: 1,
        1: 10,
        2: 100,
        3: 1000,
        4: 10000,
        5: 100000,
        6: 1000000,
        7: 10000000,
        8: 100000000,
        9: 1000000000,
        10: 10000000000,
        11: 100000000000,
        12: 1000000000000,
      },
      kline_type: ["1", "15", "60", "240", "720", "1440", "10080", "44640"],
      kline_btns: [
        {
          slug: "Time",
          resolution: "1",
          res: "Time",
          chartType: 3, // 图表类型
        },

        {
          slug: "1分",
          resolution: "1",
          res: "1m",
        },

        {
          slug: "15分",
          resolution: "15",
          res: "15m",
        },

        {
          slug: "1时",
          resolution: "60",
          res: "1h",
        },

        {
          slug: "4时",
          resolution: "240",
          res: "4h",
        },
        {
          slug: "日线",
          resolution: "1440",
          res: "1d",
        },
        {
          slug: "周线",
          resolution: "10080",
          res: "1w",
        },
        {
          slug: "月线",
          resolution: "44640",
          res: "1M",
        },
      ],
      theme: {
        up: window.palette.up.main,
        down: window.palette.down.main,
        bg: window.palette.background.dark,
        grid: window.palette.grey[500],
        cross: "rgba(104,119,139,.7)",
        border: window.palette.background.dark,
        text: "rgba(104,119,139,.7)",
        areatop: helper.hex_to_rgba(window.palette.primary.main, 0.5),
        areadown: helper.hex_to_rgba(window.palette.primary.main, 0.01),
        showLegend: true,
      },
      overrides: function (t) {
        return {
          volumePaneSize: "medium",
          "scalesProperties.lineColor": t.text,
          "scalesProperties.textColor": t.text,
          "paneProperties.background": t.bg,
          "paneProperties.vertGridProperties.color": t.grid,
          "paneProperties.horzGridProperties.color": t.grid,
          "paneProperties.crossHairProperties.color": t.cross,
          "paneProperties.legendProperties.showLegend": !!t.showLegend,
          "paneProperties.legendProperties.showStudyArguments": !0,
          "paneProperties.legendProperties.showStudyTitles": !0,
          "paneProperties.legendProperties.showStudyValues": !0,
          "paneProperties.legendProperties.showSeriesTitle": !0,
          "paneProperties.legendProperties.showSeriesOHLC": !0,
          "mainSeriesProperties.candleStyle.upColor": t.up,
          "mainSeriesProperties.candleStyle.downColor": t.down,
          "mainSeriesProperties.candleStyle.drawWick": !0,
          "mainSeriesProperties.candleStyle.drawBorder": !0,
          "mainSeriesProperties.candleStyle.borderColor": t.border,
          "mainSeriesProperties.candleStyle.borderUpColor": t.up,
          "mainSeriesProperties.candleStyle.borderDownColor": t.down,
          "mainSeriesProperties.candleStyle.wickUpColor": t.up,
          "mainSeriesProperties.candleStyle.wickDownColor": t.down,
          "mainSeriesProperties.candleStyle.barColorsOnPrevClose": !1,
          "mainSeriesProperties.hollowCandleStyle.upColor": t.up,
          "mainSeriesProperties.hollowCandleStyle.downColor": t.down,
          "mainSeriesProperties.hollowCandleStyle.drawWick": !0,
          "mainSeriesProperties.hollowCandleStyle.drawBorder": !0,
          "mainSeriesProperties.hollowCandleStyle.borderColor": t.border,
          "mainSeriesProperties.hollowCandleStyle.borderUpColor": t.up,
          "mainSeriesProperties.hollowCandleStyle.borderDownColor": t.down,
          "mainSeriesProperties.hollowCandleStyle.wickColor": t.line,
          "mainSeriesProperties.haStyle.upColor": t.up,
          "mainSeriesProperties.haStyle.downColor": t.down,
          "mainSeriesProperties.haStyle.drawWick": !0,
          "mainSeriesProperties.haStyle.drawBorder": !0,
          "mainSeriesProperties.haStyle.borderColor": t.border,
          "mainSeriesProperties.haStyle.borderUpColor": t.up,
          "mainSeriesProperties.haStyle.borderDownColor": t.down,
          "mainSeriesProperties.haStyle.wickColor": t.border,
          "mainSeriesProperties.haStyle.barColorsOnPrevClose": !1,
          "mainSeriesProperties.barStyle.upColor": t.up,
          "mainSeriesProperties.barStyle.downColor": t.down,
          "mainSeriesProperties.barStyle.barColorsOnPrevClose": !1,
          "mainSeriesProperties.barStyle.dontDrawOpen": !1,
          "mainSeriesProperties.lineStyle.color": t.border,
          "mainSeriesProperties.lineStyle.linewidth": 1,
          "mainSeriesProperties.lineStyle.priceSource": "close",
          "mainSeriesProperties.areaStyle.color1": t.areatop,
          "mainSeriesProperties.areaStyle.color2": t.areadown,
          "mainSeriesProperties.areaStyle.linecolor": t.border,
          "mainSeriesProperties.areaStyle.linewidth": 1,
          "mainSeriesProperties.areaStyle.priceSource": "close",
        };
      },
      tvwidget: null,
      datafeed: null,
      fullScreen: false,
      safari_iphone: false,
    };
  }
  componentDidMount() {
    this.start();
    const safari_iphone = Boolean(/iPhone/i.test(window.navigator.platform));
    this.setState({
      safari_iphone,
    });

    window.addEventListener(
      "online",
      () => {
        this.resetKline(1);
      },
      false
    );
  }
  componentDidUpdate() {
    if (this.props.qws && !this.state.subed && this.props.exchange_id) {
      this.setState(
        {
          subed: true,
        },
        () => {
          this.sub(this.props.exchange_id, this.props.symbol_id);
        }
      );
    }
  }
  tradviewAction = (key) => (e) => {
    if (this.state.tvwidget) {
      this.state.tvwidget.chart().executeActionById(key);
    }
  };
  resetKline = async (t) => {
    // 重置k线
    const symbol_info = this.props.config.symbols[this.props.symbol_id] || {};
    if (this.state.datafeed) {
      this.state.datafeed.getonResetCacheNeededCallback();
      if (t) {
        await this.state.datafeed.history("", "");
      }
    }
    if (this.state.tvwidget && this.state.tvwidget._ready) {
      //await this.state.tvwidget.chart().resetData();
      this.state.tvwidget.chart().setSymbol(symbol_info.symbolName);
      this.tradviewAction("chartReset")();
      this.tradviewAction("timeScaleReset")();
    }
    // 重新订阅
    this.sub(this.props.exchange_id, this.props.symbol_id);
  };
  // ws重连成功后，重新读取k线历史数据
  reopen = (id, reopen) => {
    if (reopen) {
      this.resetKline(1);
    }
  };
  sub = (exchange_id, symbol_id) => {
    this.props.qws.sub(
      {
        id: "kline_" + this.getResolition(),
        topic: `kline_${this.getResolition()}`,
        event: "sub",
        symbol: exchange_id + "." + symbol_id,
        params: {
          binary: window.ws_binary,
          klineType: this.getResolition(),
        },
      },
      this.httpAction,
      this.callback,
      this.reopen
    );
  };
  // 取消之前的订阅
  cancel = (id) => {
    if (this.props.qws && id) {
      this.props.qws.cancel(id);
    }
  };
  getResolition = () => {
    let interval = this.state.resolution;

    if (interval == "60") {
      interval = "1h";
    }
    if (interval == "120") {
      interval = "2h";
    }
    if (interval == "240") {
      interval = "4h";
    }
    if (interval == "360") {
      interval = "6h";
    }
    if (interval == "720") {
      interval = "12h";
    }
    if (interval == "1440") {
      interval = "1d";
    }
    if (interval == "10080") {
      interval = "1w";
    }
    if (interval == "44640") {
      interval = "1M";
    }
    if (/^\d{1,}$/g.test(interval)) {
      interval += "m";
    }
    return interval || "1m";
  };
  httpAction = () => {
    return this.props.dispatch({
      type: "ws/kline_http",
      payload: {
        interval: this.getResolition(),
        symbol: (
          this.props.exchange_id +
          "." +
          this.props.symbol_id
        ).toUpperCase(),
        from: "",
        to: "",
      },
    });
  };
  /**
   * data={
   *   topic:'kline_15m',
   *   params:{},
   *   f: true/false,
   *   id: 'kline_15m,
   *   shared: true/false,
   *   data:[]
   * }
   */
  callback = (data) => {
    data.data &&
      data.data.length &&
      WSDATA.setData("kline_source", data.data, data.id);
  };
  start = () => {
    if (!this.props.max_digits) {
      return setTimeout(this.start, 200);
    }
    const t = this.state.theme;
    const buttons = this.state.kline_btns;
    const overrides = this.state.overrides(t);
    let tvwidget;
    const token1 = this.props.match.params.token1.toUpperCase();
    const token2 = this.props.match.params.token2.toUpperCase();

    const token1_name = this.props.config.tokens[token1]
      ? this.props.config.tokens[token1]["tokenName"]
      : "";
    const token2_name = this.props.config.tokens[token2]
      ? this.props.config.tokens[token2]["tokenName"]
      : "";

    datafeed = new DataFeed(
      token1 + token2,
      "",
      "stock",
      this.state.kline_type,
      this.state.k[this.props.max_digits],
      this.props.base_precision,
      this.props.max_digits,
      tvwidget,
      this.props.exchange_id,
      this.props.symbol_id
    );

    const that = this;
    tvwidget = new TradingView.widget({
      //debug: true, // uncomment this line to see Library errors and warnings in the window.console
      //fullscreen: true,
      autosize: true,
      symbol: `${token1_name}${token2_name}`,
      interval: this.state.resolution,
      theme: "Dark",
      //timeframe: "1D",
      timezone: moment.tz.guess(),
      container_id: "tv_chart_container",
      //	BEWARE: no trailing slash is expected in feed URL
      datafeed,
      library_path: "/static/charting_library/",
      locale: this.props.kline_locale[window.localStorage.lang],
      //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: {
        type: "black",
        tools: [
          {
            name: "Regression Trend",
          },
        ],
      },
      // 隐藏项
      disabled_features: [
        //"compare_symbol",
        "display_market_status",
        "go_to_date",
        "header_chart_type",
        "header_compare",
        "header_interval_dialog_button",
        "header_resolutions",
        "header_screenshot",
        "header_symbol_search",
        "header_undo_redo",
        "header_saveload",
        //"legend_context_menu",
        "show_hide_button_in_legend",
        "show_interval_dialog_on_key_press",
        "snapshot_trading_drawings",
        //"symbol_info",
        //"timeframes_toolbar",
        "use_localstorage_for_settings",
        //"volume_force_overlay"
      ],
      // 展示项
      enabled_features: [
        "dont_show_boolean_study_arguments",
        "hide_last_na_study_output",
        "move_logo_to_main_pane",
        "same_data_requery",
        "side_toolbar_in_fullscreen_mode",
        "disable_resolution_rebuild",
        "keep_left_toolbar_visible_on_small_screens",
        "layout_about_to_be_changed",
      ],
      //charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.13",
      // client_id: "tradingview.com",
      // user_id: "public_user_id",
      custom_css_url: "20.02.25.css",
      width: "100%",
      height: "310",
      preset: "mobile",
      customFormatters: {
        timeFormatter: {
          format: function (date) {
            const _format_str = "%h:%m";
            let h = date.getUTCHours();
            if (h < 10) {
              h = "0" + h;
            }
            let m = date.getUTCMinutes();
            if (m < 10) {
              m = "0" + m;
            }
            let s = date.getUTCSeconds();
            if (s < 10) {
              s = "0" + s;
            }
            return _format_str
              .replace("%h", h, 2)
              .replace("%m", m, 2)
              .replace("%s", s, 2);
          },
        },
        dateFormatter: {
          format: function (date) {
            let h = date.getUTCHours();
            if (h < 10) {
              h = "0" + h;
            }
            let m = date.getUTCMinutes();
            if (m < 10) {
              m = "0" + m;
            }
            // let s = date.getUTCSeconds();
            // if (s < 10) {
            //   s = "0" + s;
            // }
            let d = ``;
            if (
              that.props.resolution == "1w" ||
              that.props.resolution == "1M"
            ) {
              d = ` ${h}:${m}`;
            }
            return (
              date.getUTCFullYear() +
              "/" +
              (date.getUTCMonth() + 1) +
              "/" +
              date.getUTCDate() +
              d
            );
          },
        },
      },
      overrides,
    });

    tvwidget.onChartReady(() => {
      const dom = window.document.querySelector("#tv_chart_mark");
      dom && (dom.style.display = "none");
      this.setState({
        tvwidget,
        datafeed,
      });
    });
  };
  changeResolition = (data) => (e) => {
    const { resolution, res, chartType } = data;
    this.cancel("kline_" + this.getResolition());
    this.setState(
      {
        resolution: resolution,
        res: res,
      },
      () => {
        if (this.state.datafeed) {
          this.state.datafeed.getonResetCacheNeededCallback();
          this.state.datafeed.setResolition(resolution);
        }
        if (this.state.tvwidget) {
          this.state.tvwidget.chart().resetData();
          this.state.tvwidget.chart().setChartType(chartType ? chartType : 1);
          this.state.tvwidget.chart().setResolution(resolution);
        }
        this.sub(this.props.exchange_id, this.props.symbol_id);
      }
    );
  };
  fullScreen = () => {
    this.setState(
      {
        fullScreen: !this.state.fullScreen,
      },
      () => {
        if (this.state.fullScreen) {
          toFullScreen(this.kline);
        } else {
          window.document.exitFullscreen
            ? window.document.exitFullscreen()
            : window.document.documentElement.requestFullscreen();
        }
      }
    );
  };
  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.kline} ref={(ref) => (this.kline = ref)}>
        <Grid container className={classes.kline_btns} alignItems="center">
          <Grid item style={{ flex: 1, overflow: "auto" }}>
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              {this.state.kline_btns.map((item) => {
                return (
                  <span
                    className={item.res == this.state.res ? "selected" : ""}
                    key={item.res}
                    onClick={this.changeResolition(item)}
                  >
                    {item.slug == "Time"
                      ? "Time"
                      : this.props.intl.formatMessage({ id: item.slug })}
                  </span>
                );
              })}
            </div>
          </Grid>
          <Grid item>
            {this.state.safari_iphone ? (
              ""
            ) : (
              <Iconfont type="fullscreen" size="24" onClick={this.fullScreen} />
            )}
          </Grid>
        </Grid>
        <div id="tv_chart_container" className={classes.chart} />
        <div className={classes.kline_mark} id="tv_chart_mark">
          <CircularProgress size={24} color="primary" />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(KlineRC));
