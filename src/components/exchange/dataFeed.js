import Requset from "../../utils/request";
import URLS from "../../config/api";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";
import WSDATA from "../../models/data_source";

let that;
class DataFeed {
  constructor(
    name,
    desc,
    type,
    resolutions,
    max_digits,
    base_precision,
    max_digits_number,
    tvwidget,
    exchangeId,
    symbold_id
  ) {
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.resolutions = resolutions;
    this.exchangeId = exchangeId;
    this.subcb = null;
    this.onHistoryCallback = null;
    this.resolution = null; // 当前分辨率
    this.timer = null; // 读取实时数据
    this.bar = [];
    this._subscribers = {};
    this.ticker = {}; // 实时数据

    this.max_digits = max_digits; // 价格精度 100000
    this.max_digits_number = max_digits_number; // 5
    this.base_precision = base_precision; // 数量精度
    this.changeIesolution = true; //
    this.firstDataRequest = true;
    this.tvwidget = tvwidget;

    this.exchange_id = exchangeId;
    this.symbold_id = symbold_id;
    this.loading = false;

    //this.timezone = moment.tz.guess();

    this.readTicker();
    that = this;
  }
  periodLengthSeconds(resolution, requiredPeriodsCount) {
    var daysCount = 0;
    if (resolution === "1440") {
      daysCount = requiredPeriodsCount;
    } else if (resolution === "44640") {
      daysCount = 31 * requiredPeriodsCount;
    } else if (resolution === "10080") {
      daysCount = 7 * requiredPeriodsCount;
    } else {
      daysCount = (requiredPeriodsCount * parseInt(resolution, 10)) / (24 * 60);
    }
    return daysCount * 24 * 60 * 60;
  }

  update(listenerGuid, lastBar) {
    // 已取消监听
    if (!this._subscribers.hasOwnProperty(listenerGuid)) {
      return;
    }
    let subscriptionRecord = this._subscribers[listenerGuid];
    if (
      subscriptionRecord.lastBarTime !== null &&
      lastBar.time < subscriptionRecord.lastBarTime
    ) {
      return;
    }

    const isNewBar =
      subscriptionRecord.lastBarTime !== null &&
      lastBar.time > subscriptionRecord.lastBarTime;
    if (isNewBar) {
      subscriptionRecord.lastBarTime = lastBar.time;
    }
    subscriptionRecord.listener(lastBar);
  }
  // 循环读取实时数据
  async readTicker() {
    if (window.location.pathname.indexOf(route_map.exchange) == -1) {
      return;
    }

    const tickers = WSDATA.getData("kline_source");
    const g_k_ticker = tickers["kline_" + this.getResolition()];

    // 接收到新数据后，与上次数据对比，如果超出1.5个分辨率，意味k线断掉，数据有漏掉，需要刷新整个页面重新加载数据：k线，最新成交，订单等；
    // const now = g_k_ticker ? g_k_ticker["t"] : 0;
    // const ss = this.resolution ? this.resolution * 1.5 * 60 * 1000 : 0;
    // let nextTime = true; // 默认true = 数据是连续的, false = 数据断档
    // if (window.g_k_update_time) {
    //   if (now && ss && now - window.g_k_update_time > ss) {
    //     nextTime = false;
    //   }
    // }
    // window.g_k_update_time = now;

    // if (!nextTime) {
    //   //window.location.reload();
    //   return;
    // }
    if (g_k_ticker && !this.loading) {
      for (let listenerGuid in this._subscribers) {
        let d = {
          time: g_k_ticker.t,
          open: Number(helper.digits(g_k_ticker.o, this.max_digits_number)),
          high: Number(helper.digits(g_k_ticker.h, this.max_digits_number)),
          low: Number(helper.digits(g_k_ticker.l, this.max_digits_number)),
          close: Number(helper.digits(g_k_ticker.c, this.max_digits_number)),
          volume: Number(g_k_ticker.v),
        };
        this.update(listenerGuid, d);
      }
      WSDATA.clear("kline_source");
    }
    await helper.delay(300);
    this.readTicker();
  }
  onReady(cb) {
    setTimeout(() => {
      cb({
        exchanges: [],
        symbols_types: [],
        supports_time: true,
        supported_resolutions: this.resolutions,
        supports_marks: false,
        supports_timescale_marks: false,
      });
    }, 0);
  }
  // 重置  resolveSymbol, name, digits等
  // this.name = name;
  //   this.max_digits = max_digits; // 价格精度 100000
  //   this.max_digits_number = max_digits_number; // 5
  //   this.base_precision = base_precision; // 数量精度
  reset(name, max_digits, base_precision, max_digits_number) {
    that.name = name;
    that.max_digits = max_digits;
    that.base_precision = base_precision;
    that.max_digits_number = max_digits_number;
    // that.
    that.onSymbolResolvedCallback &&
      that.onSymbolResolvedCallback({
        name: that.name,
        minmov: 1,
        minmov2: 0,
        pricescale: that.max_digits, // 价格精度
        //volumescale: 3,
        has_intraday: true, // 分钟数据
        has_daily: true, // 日k线诗句
        has_weekly_and_monthly: true, // 月，周数据
        has_no_volume: false,
        description: "",
        volume_precision: that.base_precision, // 成交量小数位
        type: that.type,
        session: "24x7",
        //timezone: this.timezone,
        supported_resolutions: that.resolutions,
        ticker: that.name,
      });
    //that.resolveSymbol(that.name, that.onSymbolResolvedCallback);
  }
  // 商品信息
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    var data = {
      name: symbolName,
      minmov: 1,
      minmov2: 0,
      pricescale: this.max_digits, // 价格精度
      //volumescale: 3,
      has_intraday: true, // 分钟数据
      has_daily: true, // 日k线诗句
      has_weekly_and_monthly: true, // 月，周数据
      has_no_volume: false,
      description: this.desc,
      volume_precision: this.base_precision, // 成交量小数位
      type: this.type,
      session: "24x7",
      //timezone: this.timezone,
      supported_resolutions: this.resolutions,
      ticker: symbolName,
    };
    if (!this.onSymbolResolvedCallback) {
      this.onSymbolResolvedCallback = onSymbolResolvedCallback;
    }
    setTimeout(function () {
      onSymbolResolvedCallback(data);
    }, 0);
  }

  // 获取历史数据
  getBars(
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    this.firstDataRequest = firstDataRequest;
    this.onHistoryCallback = onHistoryCallback;
    this.resolution = resolution;

    this.history(from * 1000, to * 1000, onHistoryCallback);
  }
  getResolition(resolution) {
    let interval = resolution || this.resolution;

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
  }
  getRes() {
    return this.resolution;
  }
  setResolition(resolution) {
    this.resolution = resolution;
  }
  async history(from, to, cb, httploop) {
    this.loading = true;
    //window.g_k_line_loading = false;
    let interval = this.getResolition();
    let noData = false;

    // 2010/01/01 00:00:00
    if (to && to < 1262275200000) {
      this.bar = [];
      cb([], {
        noData: true,
      });
      this.loading = false;
      return;
    }
    let bar = [];
    try {
      const result = await Requset(URLS.kline_history, {
        body: {
          symbol: this.exchangeId + "." + this.name.toUpperCase(),
          interval: /[a-z]/i.test(interval) ? interval : interval + "m",
          from: from ? Math.max(from, 0) : "",
          to: to ? Math.max(to, 0) : "",
        },
        method: "get",
      });

      if (window.location.pathname.indexOf(route_map.exchange) === -1) {
        return;
      }
      if (result.code === "OK") {
        if (result.data.data && result.data.data.length) {
          const len = result.data.data.length;
          let d;
          for (let i = 0; i <= len - 1; i++) {
            d = result.data.data[i];
            bar.push({
              time: d.t,
              open: Number(d.o),
              high: Number(d.h),
              low: Number(d.l),
              close: Number(d.c),
              volume: Number(d.v),
            });
          }

          cb(bar, {
            noData: false,
            //nextTime: bar[0]["time"]
          });
        } else {
          cb([], {
            noData: true,
          });
        }
      } else {
        cb([], {
          noData: true,
        });
      }
    } catch (err) {}
    window.g_k_line_loading = false;
    this.loading = false;
    this.bar = bar;
  }
  getonResetCacheNeededCallback() {
    return this.onResetCacheNeededCallback && this.onResetCacheNeededCallback();
  }
  // 订阅最新数据
  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    listenerGuid,
    onResetCacheNeededCallback
  ) {
    this.onResetCacheNeededCallback &&
      (this.onResetCacheNeededCallback = onResetCacheNeededCallback);
    if (this._subscribers.hasOwnProperty(listenerGuid)) {
      //window.console.log(
      //   "DataPulseProvider: already has subscriber with id=" + listenerGuid
      // );
      return;
    }
    this._subscribers[listenerGuid] = {
      lastBarTime: null,
      listener: onRealtimeCallback,
      resolution: resolution,
      symbolInfo: symbolInfo,
    };
  }
  unsubscribeBars(subscriberUID) {
    delete this._subscribers[subscriberUID];
  }
  getServerTime(callback) {
    Requset(URLS.serverTime, {
      method: "get",
    }).then((data) => {
      callback(data.data.time);
    });
  }
}

export default DataFeed;
