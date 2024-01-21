/**
 * 行情交易
 */
import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import math from "../utils/mathjs";
import WSDATA from "./data_source";
import Cookie from "../utils/cookie";

export default {
  namespace: "exchange",

  state: {
    // 下单
    order_side: "BUY", // BUY=买, SELL = 卖

    order_type: "limit", // LIMIT=限价买, MARKET = 市价
    // symbol_name: "", // 币名称
    // symbol: "", // 币对名称
    symbol_id: "", // 币对ID
    exchange_id: "", // market id
    client_order_id: "", // 客户端订单id
    order_time: 0, // GTC = 取消前有效, FOK = 全数执行或立即取消，IOC = 立刻执行或取消

    buy_price: "", // 价格
    buy_quantity: "", // 数量
    buy_max: 0, // 限价买入最大值，根据用户价格进行计算
    available: "", // 资产余额

    digitMerge: [], // 所有价格精度 , 0.001,0.01,0.1,1 symbol.digitMerge
    max_digits: "", // 价格精度 小数位最大值,如 8 表示小数留8位
    base_precision: "", // 数量精度 如 8 表示小数留8位
    quote_precision: "", // 金额精度 如 8 表示小数留8位
    min_price_precision: "", // 价格交易step, 如 0.1
    min_trade_quantity: "", // 数量交易step 如 0.1
    min_trade_amount: "", // 金额交易step  如 0.1

    sell_price: "", // 价格
    sell_quantity: "", // 数量
    sell_max: 0, // 限价卖出最大值，用户余额

    buy_progress: 0, // 买入进度条
    sell_progress: 0, // 卖出进度条

    // 卖出币种id,name及数量
    token1: "", // token1 id
    token1_name: "",
    token1_quantity: "0.00000000", // 市价交易买入最大值
    // 买入币种及数量
    token2: "", // token2 id
    token2_name: "",
    token2_quantity: "0.00000000", // 市价交易卖出最大值
    // 下单状态
    createOrderStatus: {
      "limit-BUY": false,
      "limit-SELL": false,
      "market-BUY": false,
      "market-SELL": false,
    },

    open_orders: [],
    open_orders_more: true,
    open_orders_loading: false,
    trade_orders: [],
    trade_orders_more: true,
    trade_orders_loading: false,
    TradingHistoryLimit: 20,

    // 最新成交
    newTrade: [],
    newTradeSource: [], // 源数据
    newTradeDigits: 8, // 最新成交数据小数位
    newTradingLimit: 20,

    // 币种介绍
    token_info: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen((location) => {});
    },
  },

  effects: {
    // 最新成交
    *set_newTrade({ payload }, { call, put }) {
      let newTradeSource = [];
      if (payload.newTradeSource) {
        newTradeSource = payload.newTradeSource;
      } else {
        const result = yield call(getData("trade"), {
          payload: {
            symbol: payload.symbol,
            limit: payload.limit,
          },
          method: "get",
        });
        if (result.code == "OK") {
          newTradeSource = result.data.data;
        }
      }
      WSDATA.setData("newTradeSource", newTradeSource);
    },
    // update 下单数字，buy_max
    // 下单
    *createOrder({ payload, success, enqueueSnackbar }, { call, put, select }) {
      const { createOrderStatus } = yield select((state) => state.exchange);
      if (createOrderStatus[payload.type + "-" + payload.side]) {
        window.console.log(payload.type + "-" + payload.side + " 下单中");
        return;
      }
      yield put({
        type: "save",
        payload: {
          createOrderStatus: Object.assign({}, createOrderStatus, {
            [payload.type + "-" + payload.side]: true,
          }),
        },
      });
      const { order_type, tokenInfo } = yield select((state) => state.exchange);

      let data = { ...payload };

      try {
        const result = yield call(getData("createOrder"), { payload: data });
        // 下单成功
        if (result.code == "OK") {
          success && success();
        } else {
          // 登录失效
          enqueueSnackbar &&
            enqueueSnackbar(result.msg || "create order fail", {
              variant: "error",
            });
        }
      } catch (err) {
        enqueueSnackbar &&
          enqueueSnackbar(err, {
            variant: "error",
          });
      }

      yield put({
        type: "save",
        payload: {
          createOrderStatus: Object.assign({}, createOrderStatus, {
            [payload.type + "-" + payload.side]: false,
          }),
        },
      });
    },
    *handleChange({ payload }, { select, put }) {
      yield put({
        type: "save",
        payload,
      });
    },
    // http loop更新订单数据
    *order_http({ payload }, { select, put, call }) {
      const { userinfo } = yield select((state) => state.layout);
      if (!userinfo.defaultAccountId) return;
      // 当前委托更新, http状态下更新最多的100条
      const max_limit = 100;
      const { trade_orders } = yield select((state) => state.exchange);
      try {
        let [new_open, new_trade] = yield [
          call(getData("open_orders"), {
            payload: {
              account_id: userinfo.defaultAccountId,
              end_order_id: 0,
              limit: max_limit,
              symbol_id: payload.symbol_id || "",
            },
          }),
          call(getData("trade_orders"), {
            payload: {
              account_id: userinfo.defaultAccountId,
              end_order_id: trade_orders.length
                ? trade_orders[0]["orderId"]
                : 0,
              limit: 20,
              symbol_id: payload.symbol_id || "",
            },
          }),
        ];
        WSDATA.setData("order_source", [
          ...(new_open.data || []),
          ...(new_trade.data || []),
        ]);
      } catch (e) {}
    },
    // 当前委托，历史委托，历史成交, 拉取历史数据
    *getOrders({ payload }, { select, put, call }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);

      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      if (defaultAccountId) {
        const layout = yield select((state) => state.exchange);
        const loading = yield select(
          (state) => state.exchange[payload.column + "_loading"]
        );
        if (loading) return;
        const lastId = layout[payload.column].length
          ? layout[payload.column][layout[payload.column].length - 1]["orderId"]
          : "";
        yield put({
          type: "save",
          payload: {
            [payload.column + "_loading"]: true,
          },
        });
        let p = {
          account_id: defaultAccountId,
          from_order_id: lastId || 0,
          limit: layout.TradingHistoryLimit,
        };
        if (payload.symbol_id) {
          p.symbol_id = payload.symbol_id;
        }
        if (payload.column == "my_trades") {
          p.from_trade_id = layout[payload.column].length
            ? layout[payload.column][layout[payload.column].length - 1][
                "tradeId"
              ]
            : 0;
          delete p.from_order_id;
        }
        const result = yield call(getData(payload.column), {
          payload: p,
          method: "get",
        });
        if (result.code == "OK") {
          const data = result.data;
          const source = layout[payload.column];
          const TradingHistoryLimit = layout.TradingHistoryLimit;
          let newdata = helper.excludeRepeatArray("orderId", [
            ...source,
            ...data,
          ]);
          yield put({
            type: "save",
            payload: {
              [payload.column]: newdata,
              [payload.column + "_loading"]: false,
              [payload.column + "_more"]:
                result.data.length == TradingHistoryLimit ? true : false,
            },
          });
        }
      }
    },
    // 全部撤单
    *order_cancel_all({ payload, enqueueSnackbar }, { call, put }) {
      const result = yield call(getData("order_cancel_all"), { payload });
      if (result.code == "OK" && result.data && result.data.success) {
        enqueueSnackbar &&
          enqueueSnackbar(window.appLocale.messages["已成功提交全部撤单申请"], {
            variant: "success",
          });
      } else {
        result.msg &&
          enqueueSnackbar &&
          enqueueSnackbar(result.msg, {
            variant: "error",
          });
      }
    },
    // 撤单
    *orderCancel({ payload, enqueueSnackbar }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      const result = yield call(getData("cancelOrder"), {
        payload,
      });
      if (result.code == "OK") {
        enqueueSnackbar &&
          enqueueSnackbar(window.appLocale.messages["撤单成功"], {
            variant: "success",
          });
        // 删除数组中撤单数据
        let {
          open_orders,
          TradingHistoryLimit,
          open_orders_more,
        } = yield select((state) => state.exchange);
        let newdata = helper.arrayClone(open_orders);
        newdata.splice(payload.i, 1);
        yield put({
          type: "save",
          payload: {
            open_orders: newdata,
          },
        });
        // 剩余数据小于一页，并且有更多数据时，自动加载下一页
        if (newdata.length < TradingHistoryLimit && open_orders_more) {
          yield put({
            type: "getOrders",
            payload: {
              column: "open_orders",
            },
          });
        }
      } else {
        result.msg &&
          enqueueSnackbar &&
          enqueueSnackbar(result.msg, { variant: "error" });
      }
    },
    // token_info
    *token_info({ payload }, { call, put }) {
      const result = yield call(getData("token_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            token_info: result.data,
          },
        });
      }
    },
  },
  reducers: {
    // 余额更新
    setAvailable(state, action) {
      const token1 = state.token1;
      const token2 = state.token2;
      const buy_price = state.buy_price;
      const data = action.payload.user_balance || {};
      const base_precision = state.base_precision;
      let obj = {};
      obj["token1_quantity"] = data[token1] ? data[token1].free : 0;
      obj["token2_quantity"] = data[token2] ? data[token2].free : 0;
      obj["buy_max"] = 0;
      if (buy_price && obj["token2_quantity"]) {
        obj["buy_max"] =
          state.order_type == "limit"
            ? helper.digits(
                math
                  .chain(math.bignumber(obj["token2_quantity"]))
                  .divide(math.bignumber(buy_price))
                  .format({ notation: "fixed" })
                  .done(),
                base_precision
              )
            : obj["token2_quantity"];
      }
      return { ...state, ...obj };
    },
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    // 订单可能完成成交，需要移到历史委托
    setOrder(state, action) {
      const new_order_source = action.payload.order_source;
      let open_orders = helper.arrayClone(state.open_orders);
      let trade_orders = helper.arrayClone(state.trade_orders);
      const pathname = window.location.pathname;
      // 限价单,市价单
      // status
      // 1、NEW 新订单,放入当前委托，
      // 2、PARTIALLY_FILLED 部分成交，更新当前委托里面的某条订单信息,如果当前委托没有此订单，直接插入历史委托
      // 3、FILLED 完全成交，提醒用户有成交，当前委托的中订单信息更新，并放入历史委托，如果当前委托没有，直接插入历史委托
      // 4、CANCELED 已撤销，点击撤销按钮时，已删除当前委托中的订单，直接插入历史委托即可
      // 1,2 排序规则：按time排序，如果不在列表里并且time大于最大的time那么unshift到list里，不在列表里并且小于最小的time不做处理，其余排序插入对应位置
      // 5、下单页，按照symbol_id进行过滤
      new_order_source.forEach((item, i) => {
        const status = item.status;
        // 5、下单页，按照symbol_id进行过滤
        if (
          pathname.indexOf(route_map.trade) > -1 &&
          item.symbolId != state.symbol_id
        ) {
          return;
        }

        let n = -1;
        open_orders.forEach((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });

        // 新订单 or 部分成交
        if (status === "NEW" || status === "PARTIALLY_FILLED") {
          if (n === -1) {
            if (open_orders[0]) {
              if (item.time - open_orders[open_orders.length - 1]["time"] > 0) {
                open_orders.unshift(item);
              }
            } else {
              open_orders[0] = item;
            }
          } else {
            open_orders[n] = item;
          }
          return;
        }

        let m = -1;
        trade_orders.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });

        if (status === "FILLED" || status === "CANCELED") {
          if (status === "FILLED") {
            WSDATA.setData("order_notice", 1, false);
          }
          if (m === -1) {
            // 不在当前列表中，且时间大于最后一条
            if (trade_orders[0]) {
              if (
                item.time - trade_orders[trade_orders.length - 1]["time"] >
                0
              ) {
                trade_orders.unshift(item);
              }
            } else {
              trade_orders[0] = item;
            }
          } else {
            trade_orders[m] = item;
          }
          if (n > -1) {
            open_orders.splice(n, 1);
          }
        }
      });
      WSDATA.clear("order_source");
      open_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      trade_orders.sort((a, b) => (a.time - b.time >= 0 ? -1 : 1));
      return {
        ...state,
        open_orders: helper.excludeRepeatArray("orderId", open_orders),
        trade_orders: helper.excludeRepeatArray("orderId", trade_orders),
      };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
