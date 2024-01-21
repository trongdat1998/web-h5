// ws推送数据源
import CONST from "../config/const";
let count = 0;
const obj = {
  // 24小时行情
  symbol_quote_source: {},
  // 用户资产
  user_balance_source: {},
  // 合并深度订阅
  mergedDepth_source: {
    // 301.BTCUSDT2: {
    //   a: [], b: []
    // }
  },
  depth_source: {
    // 301.BTCUSDT: {
    //   a: [], b: []
    // }
  },
  trade_source: {
    // 301BTCUSDT:[]
  },
  kline_source: {
    // kline_15m: {},
  },
  order_source: [],
  order_notice: 0,

  // 指数
  indices_source: {},
  // 永续合约资产
  future_balance_source: {},
  // 永续合约可交易信息
  future_tradeable_source: {},
  // 永续合约订单推送 当前委托
  future_order_source: [],
  // 永续合约订单推送 当前持仓
  future_position_source: [],
};

export default {
  clearAll: (type) => {
    if (type === "qws") {
      obj.symbol_quote_source = {};
      obj.mergedDepth_source = {};
      obj.depth_source = {};
      obj.trade_source = {};
      obj.kline_source = {};
    }
    if (type === "ws") {
      obj.order_source = [];
      obj.user_balance_source = {};
      obj.option_order_source = [];
      // obj.option_position_source = [];
      obj.option_balance_source = {};
      obj.option_tradeable_source = {};
      obj.future_balance_source = {};
      obj.future_tradeable_source = {};
      obj.future_order_source = [];
      // obj.future_position_source = [];
      obj.futures_order_filled = [];
    }
    obj.order_notice = 0;
  },
  clear: (name) => {
    if (name === "option_balance_source" || name == "option_tradeable_source") {
      obj[name] = {};
    }
    if (name === "future_balance_source" || name == "future_tradeable_source") {
      obj[name] = {};
      return;
    }
    if (name === "order_notice") {
      obj[name] = 0;
      return;
    }
    if (name == "indices") {
      obj.indices_source = {};
    }
    if (name === "user_balance_source" || name === "symbol_quote_source") {
      obj[name] = {};
      return;
    }
    if (
      name === "depth_source" ||
      name === "mergedDepth_source" ||
      name === "trade_source" ||
      name === "kline_source"
    ) {
      obj[name] = {};
      return;
    }
    if (
      name === "order_source" ||
      name === "option_order_source" ||
      name === "option_position_source" ||
      name == "future_order_source" ||
      name == "future_position_source" ||
      name == "futures_order_filled"
    ) {
      obj[name] = [];
      return;
    }
  },
  getData: (name) => {
    return obj[name];
  },
  setData: (name, data, type) => {
    count++;
    if (name === "user_balance_source") {
      if (!data.length) return;
      data.map((item) => {
        obj.user_balance_source[item["tokenId"]] = item;
      });
      return;
    }
    if (name === "order_notice") {
      if (type) {
        obj.order_notice = data;
      } else {
        obj.order_notice = Number(obj.order_notice) + Number(data);
      }
      return;
    }
    if (name === "depth_source" || name === "mergedDepth_source") {
      if (!data || !data[0] || !type) return;
      obj[name][type] = {
        a: data[0].a,
        b: data[0].b,
      };
      return;
    }
    if (name == "indices_source") {
      if (!Object.keys(data).length) return;
      obj["indices_source"] = { ...obj["indices_source"], ...data };
    }
    if (name === "trade_source") {
      if (!data || !type) return;
      if (type) {
        obj[name][type] = obj[name][type]
          ? data.reverse().concat(obj[name][type])
          : data.reverse();
        obj[name][type].length = Math.min(
          obj[name][type].length,
          CONST.trade_limit
        );
      }
    }
    if (name === "kline_source") {
      if (!data || !type) return;
      obj[name][type] = data[data.length - 1];
    }
    if (name === "symbol_quote_source") {
      if (!data.length) return;
      data.map((item) => {
        obj.symbol_quote_source[item.s] = item;
      });
      return;
    }
    if (name === "order_source") {
      if (!data) return;
      obj.order_source = obj.order_source.concat(data);
      return;
    }
    if (name === "my_trades_source") {
      if (!data) return;
      obj.my_trades_source.unshift(data);
    }
    if (name === "future_tradeable_source") {
      if (!data || !data.length) return;
      let d = {};
      data.map((item) => {
        d[item["tokenId"]] = item;
      });
      obj["future_tradeable_source"] = d;
      return;
    }
    if (name === "future_balance_source") {
      if (!data || !data.length) return;
      obj.future_balance_source = data[0];
    }
    if (name === "future_order_source") {
      if (!data) return;
      obj.future_order_source = obj.future_order_source.concat(data);
      return;
    }
    if (name === "future_position_source") {
      if (!data) return;
      obj.future_position_source = data;
      return;
    }
    if (name === "futures_order_filled") {
      if (!data) return;
      obj.futures_order_filled.push(data);
      return;
    }
  },
};
