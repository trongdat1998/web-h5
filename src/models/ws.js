import WSDATA from "./data_source";
import getData from "../services/getData";
import helper from "../utils/helper";

export default {
  namespace: "ws",

  state: {
    /**
     * 币对的行情数据
     * symbol_quote : {
     *  '301ETCBTC': {
     *    "t": "1531193421003",//time
     *    "s": "BCHBTC", // symbol
     *    "c": "0.1531193171219",//close price
     *    "h": "0.1531193171219",//high price
     *    "l": "0.1531193168802",//low price
     *    "o": "0.1531193171219", //open price
     *    "v": "0.0", //volume
     *    "qv": 123123, // 成交额
     *    "e": "301" //exchange id,
     *    "m": -0.1, // 涨跌幅
     *  }
     * }
     */
    symbol_quote: {},
    /**
     * {
     *  USDT:{
     * balanceCreatedAt: "1563440481906"
     * balanceUpdatedAt: "1566997406037"
     * btcValue: "0"
     * free: "10000"
     * locked: "30000"
     * position: "0"
     * tokenId: ""
     * tokenName: ""
     * total: "40000"
     * usdtValue: "0"
     * }
     * }
     */
    user_balance: {},
    // 盘口
    merged_depth: {
      // 301.BTCUSDT2:{
      //   a:[],
      //   b:[]
      // }
    },
    // 深度图
    depth: {
      // 301.BTCUSDT:{
      //   a:[],
      //   b:[]
      // }
    },
    // 最新成交
    trades: {
      // 301ETCBTC:[]
    },
    // 指数
    indices: {
      //USDT:{}
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: "sync",
        payload: {}
      });
    }
  },

  effects: {
    // 同步data_source数据到model
    *sync({ payload }, { put, select }) {
      while (true) {
        const quotes = WSDATA.getData("symbol_quote_source");
        const user_balance = WSDATA.getData("user_balance_source");
        const mergedDepth_source = WSDATA.getData("mergedDepth_source");
        const depth_source = WSDATA.getData("depth_source");
        const order_source = WSDATA.getData("order_source");
        const trade_source = WSDATA.getData("trade_source");
        const indices = WSDATA.getData("indices_source");
        yield put({
          type: "save",
          payload: {
            symbol_quote: { ...quotes },
            merged_depth: mergedDepth_source,
            depth: depth_source,
            trades: trade_source,
            user_balance: user_balance,
            indices
          }
        });
        const userinfo = yield select(state => state.layout.userinfo);
        if (userinfo.userId) {
          const future_tradeable_source = WSDATA.getData(
            "future_tradeable_source"
          );
          const future_order_source = WSDATA.getData("future_order_source");
          const future_position_source = WSDATA.getData(
            "future_position_source"
          );
          // 同步资产信息
          yield put({
            type: "exchange/setAvailable",
            payload: {
              user_balance
            }
          });
          // 同步订单信息
          if (userinfo.userId) {
            yield put({
              type: "exchange/setOrder",
              payload: {
                order_source
              }
            });
          }
          // 合约 资产
          if (Object.keys(future_tradeable_source).length) {
            yield put({
              type: "future/save",
              payload: {
                future_tradeable: future_tradeable_source
              }
            });
          }
          // 合约 当前委托
          if (future_order_source.length) {
            yield put({
              type: "future/update_order",
              payload: {
                future_order_source
              }
            });
          }
          // 合约 当前持仓
          yield put({
            type: "future/update_position",
            payload: {
              future_position_source
            }
          });
        }
        yield helper.delay(1000);
      }
    },
    // symbol_quote http loop
    *broker_quote_http({ payload }, { call }) {
      try {
        const result = yield call(getData("quote"), { payload, method: "get" });
        if (result.code == "OK" && result.data) {
          WSDATA.setData("symbol_quote_source", result.data.data);
        }
      } catch (e) {}
    },
    // 用户资产http
    *balance_http({ payload }, { call }) {
      try {
        const result = yield call(getData("get_asset"), {
          payload,
          method: "get"
        });
        if (result.code == "OK" && result.data) {
          WSDATA.setData("user_balance_source", result.data);
        }
      } catch (e) {}
    },
    *merge_depth_http({ payload }, { call }) {
      try {
        const result = yield call(getData("depth"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "mergedDepth_source",
            result.data.data,
            payload.symbol +
              (payload.dumpScale <= 0
                ? Number(payload.dumpScale) + 1
                : payload.dumpScale)
          );
        }
      } catch (e) {}
    },
    *depth_http({ payload }, { call }) {
      try {
        const result = yield call(getData("depth"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "depth_source",
            result.data.data,
            "depth" + payload.symbol
          );
        }
      } catch (e) {}
    },
    *trade_http({ payload }, { call }) {
      try {
        const result = yield call(getData("trade"), { payload, method: "get" });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "trade_source",
            result.data.data,
            "trade" + payload.symbol
          );
        }
      } catch (e) {}
    },
    *kline_http({ payload }, { call }) {
      try {
        const result = yield call(getData("kline_history"), {
          payload,
          method: "get"
        });
        if (result.code == "OK" && result.data && result.data.data) {
          WSDATA.setData(
            "kline_source",
            result.data.data,
            "kline_" + payload.interval
          );
        }
      } catch (e) {}
    },
    // http 获取指数
    *get_indices_data({ payload }, { call }) {
      let indices_source = {};
      // http 请求数据
      try {
        const result = yield call(getData("indices"), {
          payload,
          method: "get"
        });
        if (result.code == "OK" && result.data) {
          indices_source = result.data.data;
        }
        // 更新深度数据
        WSDATA.setData("indices_source", indices_source);
      } catch (e) {}
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
