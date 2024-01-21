import getData from "../services/getData";
import Cookie from "../utils/cookie";
import { message } from "../lib";
import route_map from "../config/route_map";
import { callHandler } from "../utils/app_jsbridge";
import CONST from "../config/const";
import WSDATA from "./data_source";
import helper from "../utils/helper";

export default {
  namespace: "future",

  state: {
    current_list: [], // 当前委托
    current_list_loading: false,
    current_more: true,
    position_list: [], //持仓
    position_more: true,
    history_entrust: [], // 历史委托
    history_entrust_loading: false, // 历史委托
    history_entrust_more: true,
    history_order: [], // 历史成交
    history_order_loading: false,
    history_order_more: true,
    delivery_order: [], // 交割记录
    delivery_more: false,
    fund_list: [], // 保险基金列表
    fund_more: false,
    future_balances: [],
    // 永续合约状态
    future_status: 0, // 0 = 交易中， 1 = 交割中  2 = 已交割

    /**
     * 永续合约可交易信息,资产信息
     * {
     *  symbolId:{
     *    symbolId:'',
     *    availPosition:[左可平量,右可平量],
     *    positionNum:[左值仓位,右值仓位],
     *    profitLoss:{
     *       "coinAvailable":10000.89,//可用保证金
     *       "margin":2000.89,//仓位保证金
     *       "orderMargin":300.89,//委托保证金
     *       "realisedPnl":5000.89,//已实现盈亏
     *       "unrealisedPnl":200.00//未实现盈亏
     *    }
     *  }
     * }
     */
    future_tradeable: {},
    // 合约资产
    future_asset: [],
    future_asset_httploop: false,
    // 是否已启动htt轮询
    tradeable_http_status: false,
    // 是否已启动更新轮询
    updateTradeableStatus: false,

    // 永续合约下单配置项
    /**
     * 永续合约下单配置项
     * {
     *  symbolId: {
     *    symbolId:'',
     *    symbolName: '',
     *    orderFee:{
     *      takerFeeRate:'0.1', // taker,maker取最大值
     *      makerFeeRate:'0.2',
     *    },
     *    orderSetting:{
     *      "orderCondition":"1", //是"被动委托或取消"条件，参数：1=是，0=否
     *      "effectiveTime":"1", //"生效时间"选项，参数：1=一直生效 2=全部成交或取消 3=立刻成交或取消
     *      "alertConfirm":"1"//"下单弹窗确认"条件，参数：1=开启 0=关闭
     *    },
     *    orderRiskLimit:{
     *      riskLimitId: 1,
     *    },
     *  }
     * }
     */
    order_setting: {},

    // 下单
    order_chooses: ["OPEN", "CLOSE"],
    order_choose: 0, // OPEN = 开仓， CLOSE = 平仓

    order_sides: ["BUY", "SELL"],
    order_side: 0, // BUY=买, SELL = 卖

    order_types: ["LIMIT", "STOP"],
    order_type: 0, // LIMIT=限价, STOP = 计划委托

    price_types: ["INPUT", "MARKET_PRICE", "OPPONENT", "QUEUE", "OVER"],
    price_types_desc: ["限价", "市价", "对手价", "排队价", "超价"],
    // symbol_name: "", // 币名称
    // symbol: "", // 币对名称
    future_info: {},
    symbol_id: "", // 币对ID
    exchange_id: "", // market id
    client_order_id: "", // 客户端订单id
    time_in_force: 0, // GTC = 取消前有效, FOK = 全数执行或立即取消，IOC = 立刻执行或取消

    buy_lever: null, // 杠杠dom节点
    buy_type: 0, // 0= 限价， 1 = 计划委托
    buy_price: "", // 价格
    buy_price_type: 0, // 价格类型 : price_types[n]
    buy_trigger_price: "", // 计划委托触发价格
    buy_leverage: "", // 杠杆值
    buy_quantity: "", // 数量
    buy_progress: 0, // 买入进度条
    buy_max: 0, // 限价买入最大值，根据用户价格进行计算
    buy_risk: "", // 风险限额id

    sale_lever: null, // 杠杠下拉选项 dom节点
    sale_type: 0, // 0= 限价， 1 = 计划委托
    sale_price: "", // 价格
    sale_price_type: 0, // 价格类型 : price_types[n]
    sale_trigger_price: "", // 计划委托触发价格
    sale_leverage: "", // 杠杆值
    sale_quantity: "", // 数量
    sale_max: 0, // 限价卖出最大值，用户余额
    sale_progress: 0, // 卖出进度条
    sale_risk: "", // 风险限额id

    funding_rates: [], // 资金费率

    // modal_setting
    modal_setting: false, //设置弹层
    modal_glossary: false, // 名词解释
    modal_order: false, // 下单确认弹层
    modal_margin: false, // 保证金弹层
    modal_position: false, // 平仓弹层
    modal_future: false, // 合约介绍
    modal_risk: false, // 风险限额
    modal_calculator: false, // 计算器

    // 可卖
    token1: "", // token1 id
    token1_name: "",
    // 可用余额
    token2: "", // token2 id
    token2_name: "",
    // 下单状态
    createOrderStatus: {
      BUY: false,
      SELL: false,
    },

    digitMerge: [], // 币对的小数位配置 , 如：0.1,0.01,0.0001
    aggTrade_digits: "", // 默认选择小数位，行情深度合并使用
    max_digits: "", // 价格精度 小数位最大值,如 8 表示小数留8位
    base_precision: "", // 数量精度 如 8 表示小数留8位
    quote_precision: "", // 金额精度 如 8 表示小数留8位
    min_price_precision: "", // 价格交易step, 如 0.1
    min_trade_quantity: "", // 数量交易step 如 0.1
    min_trade_amount: "", // 金额交易step  如 0.1

    // // 最新成交
    // newTrade: [],
    // newTradeSource: [], // 源数据
    // newTradeDigits: 8, // 最新成交数据小数位
    // newTradingLimit: 20,

    // // 盘口阴影分母，计算规则：buy+sell取平均值
    // aggTrade_average: 10000000, // 平均值
    // aggTrade_total_buy: 0, // 买盘交易总额
    // aggTrade_total_sell: 0, // 买盘交易总额
    // aggTrade_type: "all", // 展示选项，all，buy，sell
    // aggTrade_mount: 20, // buy，sell显示条数
    // aggTrade_limit: 20, // 盘口数据量

    // 期权费率
    order_fee: {},
    // 默认费率
    defaultFee: 0.005,

    // // 盘口数据
    // aggTrade_data: {
    //   sell: [],
    //   buy: []
    // },
    // // 合并深度数据
    // mergedDepth_source: {
    //   a: [],
    //   b: []
    // },
    // mergedDepth: {
    //   a: [],
    //   b: []
    // },

    // // 期权指数
    // indices_source: {},
    // indices: {},

    // // 深度图数据, 盘口数据
    // depth_source: {
    //   a: [],
    //   b: []
    // },
    // depth: {
    //   sell: [],
    //   buy: []
    // },

    // tokenInfo
    tokenInfo: {},
    tokenInfoSource: {},

    datafeed_reset: false,
    Limit: 20,
    maxLimit: 100,
    tableData: [],
    // 翻页数据
    total: 0, // 总条数
    page: 0, // 页码
    rowsPerPage: CONST.rowsPerPage, // 每页条数
    tableData: [], // 列表数据
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    // 合约计算器
    *calculator({ payload, key, callback }, { call }) {
      const result = yield call(getData(key), { payload, method: "get" });
      callback && callback(result);
    },
    // 合约资产轮询
    *getFutureAsset({ payload }, { call, put, select }) {
      const future_asset_httploop = yield select(
        (state) => state.future.future_asset_httploop
      );
      if (future_asset_httploop) return;
      yield put({
        type: "save",
        payload: {
          future_asset_httploop: true,
        },
      });
      while (true) {
        try {
          const result = yield call(getData("get_futures_asset"), { payload });
          if (result.code == "OK") {
            yield put({
              type: "save",
              payload: {
                future_asset: result.data,
              },
            });
          }
        } catch (e) {}
        yield helper.delay(3000);
      }
    },
    // 设置下单选项
    *set_order_setting({ payload, dispatch }, { call, put }) {
      const result = yield call(getData("set_order_setting"), { payload });
      if (result.code == "OK") {
        yield dispatch({
          type: "future/getOrderSetting",
          payload: {},
        });
      } else {
        message.error(result.msg);
      }
    },
    // 设置风险限额
    *set_risk_limit({ payload, dispatch }, { call, put }) {
      const result = yield call(getData("set_risk_limit"), { payload });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            modal_risk: false,
            [payload.key]: payload.risk_limit_id,
          },
        });
        yield dispatch({
          type: "future/getOrderSetting",
          payload: {},
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 查询当前止盈止损
    *stop_profit_loss_get({ payload, cb }, { call, put }) {
      const result = yield call(getData("stop_profit_loss_get"), { payload });
      cb && cb(result);
    },
    // 取消止盈止损
    *stop_profit_loss_cancel({ payload, cb }, { call }) {
      const result = yield call(getData("stop_profit_loss_cancel"), {
        payload,
      });
      cb && cb(result);
    },
    // 设置止盈止损
    *stop_profit_loss_set({ payload, cb }, { call }) {
      const result = yield call(getData("stop_profit_loss_set"), { payload });
      cb && cb(result);
    },
    // 增加，减少保证金
    *modify_margin({ payload, callback }, { call, put }) {
      const result = yield call(getData("modify_margin"), { payload });
      callback && callback(result);
    },
    // 资金费率
    *funding_rates({ payload }, { call, put }) {
      const result = yield call(getData("funding_rates"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data && result.data.length) {
        yield put({
          type: "save",
          payload: {
            funding_rates: result.data,
          },
        });
      }
    },
    // 是否开通期权
    *fetchIfOpenedOption({ payload, api }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      const { functions } = yield select((state) => state.layout);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) {
        return;
      } else {
        const result = yield call(getData("userinfo"), {
          payload,
          method: "get",
        });
        if (
          result.data &&
          result.data.openFuture !== true &&
          window.location.href.indexOf(route_map.future_guest) == -1
        ) {
          window.location.href = route_map.future_guest;
        }
      }
    },
    // 开通期权
    *openOption({ payload }, { call, put, select }) {
      const result = yield call(getData("open_future"), {
        payload,
        method: "get",
      });
      if (result.data && result.data.success === true) {
        if (/bhe.?App/i.test(window.navigator.userAgent)) {
          callHandler({
            name: "openFuture",
            data: {},
          });
        } else {
          const optionUrl = route_map.future_trade;
          window.location.href = optionUrl;
        }
      } else if (result.msg) {
        message.error(result.msg);
      }
    },
    // update 下单数字，buy_max
    // 下单
    *createOrder({ payload, success, enqueueSnackbar }, { call, put, select }) {
      const { createOrderStatus, order_side, order_sides } = yield select(
        (state) => state.future
      );
      if (createOrderStatus[order_sides[order_side]]) {
        window.console.log(order_sides[order_side] + " 下单中");
        return;
      }
      yield put({
        type: "save",
        payload: {
          createOrderStatus: Object.assign({}, createOrderStatus, {
            [payload.order_side]: true,
          }),
        },
      });

      try {
        let pay = { ...payload };
        if (pay.price_type != "INPUT") {
          delete pay.price;
        }
        const result = yield call(getData("futures_order_create"), {
          payload: pay,
        });
        const ws = yield select((state) => state.layout.ws);
        // 下单成功
        if (result.code == "OK") {
          if (payload.futures) {
            enqueueSnackbar(window.appLocale.messages["提交成功"], {
              variant: "success",
            });
          } else {
            enqueueSnackbar(window.appLocale.messages["下单成功"], {
              variant: "success",
            });
          }
          success && success();
        } else {
          result.msg && enqueueSnackbar(result.msg, { variant: "error" });
        }
      } catch (err) {}

      yield put({
        type: "save",
        payload: {
          // order_type: payload.type,
          // order_side: payload.side,
          createOrderStatus: Object.assign({}, createOrderStatus, {
            [order_sides[order_side]]: false,
          }),
        },
      });
    },
    // 撤单
    *cancelOrder({ payload, success, enqueueSnackbar }, { call, put, select }) {
      if (!Cookie.read("account_id")) return;
      let { current_list, maxLimit } = yield select((state) => state.future);
      const result = yield call(getData("futures_order_cancel"), { payload });
      const ws = yield select((state) => state.layout.ws);
      const lastId = current_list.length
        ? current_list[current_list.length - 1]["orderId"]
        : "";
      // 撤单成功
      if (
        result.code === "OK" &&
        result.data &&
        (result.data.status == "CANCELED" ||
          result.data.status == "ORDER_CANCELED")
      ) {
        enqueueSnackbar &&
          enqueueSnackbar(window.appLocale.messages["撤单成功"], {
            variant: "success",
          });
        success && success();
        // 删除当前委托
        current_list = current_list.filter(
          (list) => list.orderId != payload.order_id
        );
        yield put({
          type: "save",
          payload: {
            current_list: current_list,
          },
        });
        return;
      } else {
        enqueueSnackbar &&
          enqueueSnackbar(
            result.msg ||
              window.appLocale.messages["撤单失败"] ||
              "Cancel Failed",
            { variant: "error" }
          );
      }
    },
    /**
     * http 轮询更新当前委托
     * 当前委托：全量更新，如果数据量较大，全量更新前100条
     */
    *updateCurrentEntrust({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { current_list, maxLimit } = yield select((state) => state.future);
      const end_order_id = current_list[0] ? current_list[0]["orderId"] : 0;
      let new_current = yield call(
        getData(
          payload.order_type == "STOP_LOSS"
            ? "stop_profit_loss_open_orders"
            : "futures_current_entrust"
        ),
        {
          payload: {
            ...payload,
            type: payload.order_type,
            end_order_id: 0,
            limit: maxLimit,
          },
        }
      );
      // 处理当前委托，查询第一条数据的位置,轮询过程中，可能有新下订单
      let n = current_list.length;
      end_order_id &&
        current_list.map((item, i) => {
          if (item.orderId === end_order_id) {
            n = i;
            return;
          }
        });
      let data = {};
      if (new_current.code === "OK") {
        data.current_list = helper
          .arrayClone(current_list)
          .slice(0, n)
          .concat(new_current.data || []);
        data.current_list = helper.excludeRepeatArray(
          "orderId",
          data.current_list
        );
        data.current_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      }
      WSDATA.clear("future_order_source");
      yield put({
        type: "save",
        payload: data,
      });
    },
    /**
     * http 轮询更新当前持仓
     * 当前持仓：全量更新，如果数据量较大，全量更新前100条
     */
    *updatePositionOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      let { maxLimit } = yield select((state) => state.future);
      let new_position = yield call(getData("futures_option_list"), {
        payload: {
          ...payload,
          end_order_id: 0,
          limit: maxLimit,
        },
      });

      if (!new_position || !new_position.data) {
        new_position.data = [];
      }
      if (new_position.code === "OK") {
        WSDATA.setData("future_position_source", new_position.data);
      }
    },
    // 获取当前委托列表
    *getCurrentEntrust({ payload }, { call, put, select }) {
      let defaultAccountId = Cookie.read("account_id");
      if (!defaultAccountId) {
        return;
      }
      if (defaultAccountId) {
        const loading = yield select(
          (state) => state.future.current_list_loading
        );
        if (loading) return;
        yield put({
          type: "save",
          payload: {
            current_list_loading: true,
          },
        });
        const { current_list, maxLimit } = yield select(
          (state) => state.future
        );
        // 参数处理
        let opt = {
          limit: maxLimit,
          from_order_id:
            current_list.length && !payload.firstReq
              ? current_list[current_list.length - 1]["orderId"]
              : "",
        };
        payload = { ...payload, ...opt, type: payload.order_type };
        try {
          const result = yield call(
            getData(
              payload.order_type == "STOP_LOSS"
                ? "stop_profit_loss_open_orders"
                : "futures_current_entrust"
            ),
            {
              payload,
              method: "get",
            }
          );
          if (result.code === "OK") {
            let data = {
              current_list_loading: false,
            };
            data.current_list = payload.firstReq
              ? result.data
              : [...current_list].concat(result.data);
            data.current_list_more =
              result.data.length < maxLimit ? false : true;
            data.current_list = helper.excludeRepeatArray(
              "orderId",
              data.current_list
            );
            data.current_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
            yield put({
              type: "save",
              payload: data,
            });
          } else {
            if (payload.firstReq) {
              yield put({
                type: "save",
                payload: {
                  current_list: [],
                  current_list_more: true,
                  current_list_loading: false,
                },
              });
            }
            if (payload.from_order_id) {
              //message.ror(result.msg);
            }
          }
        } catch (e) {
          yield put({
            type: "save",
            payload: {
              current_list_more: true,
              current_list_loading: false,
            },
          });
        }
      }
    },
    // 历史委托
    *getHistoryEntrust({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_entrust, Limit } = yield select((state) => state.future);
      const loading = yield select(
        (state) => state.future.history_entrust_loading
      );
      if (loading) return;
      yield put({
        type: "save",
        payload: {
          history_entrust_loading: true,
        },
      });
      // 参数处理
      let opt = {
        limit: Limit,
        from_order_id: payload.firstReq
          ? ""
          : history_entrust.length
          ? history_entrust[history_entrust.length - 1]["orderId"]
          : "",
      };
      payload = { ...payload, ...opt, type: payload.order_type };
      try {
        const result = yield call(
          getData(
            payload.order_type == "STOP_LOSS"
              ? "stop_profit_loss_trade_orders"
              : "futures_history_entrust"
          ),
          {
            payload,
            method: "get",
          }
        );
        if (result.code === "OK") {
          let data = {};
          data.history_entrust = payload.firstReq
            ? result.data
            : [...history_entrust].concat(result.data);
          data.history_entrust_more = result.data.length < Limit ? false : true;
          data.history_entrust = helper.excludeRepeatArray(
            "orderId",
            data.history_entrust
          );
          data.history_entrust.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
          data.history_entrust_loading = false;
          yield put({
            type: "save",
            payload: data,
          });
        } else {
          // if (payload.from_order_id) {
          //   message.error(result.msg);
          // }
        }
      } catch (e) {
        yield put({
          type: "save",
          payload: {
            history_entrust_loading: false,
          },
        });
      }
    },
    // 历史委托详情
    *getHistoryEntrustDetails({ payload, url, callback }, { call }) {
      const result = yield call(getData(url), { payload, method: "get" });
      callback && callback(result);
    },
    /**
     * http 轮询更新
     * 历史委托：只请求最新的数据
     */
    *updateHistoryEntrust({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_entrust, Limit } = yield select((state) => state.future);
      const end_order_id = history_entrust[0]
        ? history_entrust[0]["orderId"]
        : 0;
      let new_history = yield call(
        getData(
          payload.order_type == "STOP_LOSS"
            ? "stop_profit_loss_trade_orders"
            : "futures_history_entrust"
        ),
        {
          payload: {
            ...payload,
            end_order_id,
            limit: Limit,
            from_order_id: "",
            type: payload.order_type,
          },
        }
      );
      let newList = helper.arrayClone(history_entrust);
      if (new_history.code === "OK") {
        if (new_history.data.length) {
          // WSDATA.setData("order_notice", new_history.data.length);
          newList = new_history.data.concat(newList);
        }
      }
      newList = helper.excludeRepeatArray("orderId", newList, "time");
      newList.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      yield put({
        type: "save",
        payload: {
          history_entrust: newList,
        },
      });
    },
    // 历史成交
    *getHistoryOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_order, Limit } = yield select((state) => state.future);
      const loading = yield select(
        (state) => state.future.history_order_loading
      );
      if (loading) return;
      yield put({
        type: "save",
        payload: {
          history_order_loading: true,
        },
      });
      // 参数处理
      let opt = {
        limit: Limit,
        from_trade_id: payload.firstReq
          ? ""
          : history_order.length
          ? history_order[history_order.length - 1]["tradeId"]
          : "",
      };
      payload = { ...payload, ...opt };
      try {
        const result = yield call(getData("futures_history_order"), {
          payload,
          method: "get",
        });
        if (result.code === "OK") {
          let data = {};
          data.history_order = payload.firstReq
            ? result.data
            : [...history_order].concat(result.data);
          data.history_order_more = result.data.length < Limit ? false : true;
          data.history_order = helper.excludeRepeatArray(
            "tradeId",
            data.history_order,
            "time"
          );
          data.history_order.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
          data.history_order_loading = false;
          yield put({
            type: "save",
            payload: data,
          });
        } else {
          // if (payload.from_trade_id) {
          //   message.error(result.msg);
          // }
        }
      } catch (e) {
        yield put({
          type: "save",
          payload: {
            history_order_loading: false,
          },
        });
      }
    },
    /**
     * http 轮询更新
     * 历史成交：只请求最新的数据
     */
    *updateHistoryOrder({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const { history_order, Limit } = yield select((state) => state.future);
      //const end_trade_id = history_order[0] ? history_order[0]["tradeId"] : 0;
      // 拉取最新数据，不能拉取 end_trade_id 到当前的订单，可能有早于end_trade_id之前的订单，成交了。
      const end_trade_id = 0;
      let new_history = yield call(getData("futures_history_order"), {
        payload: {
          ...payload.params,
          end_trade_id,
          limit: Math.min(Math.max(history_order.length, Limit), 100),
          //from_trade_id: ""
        },
      });
      let newList = helper.arrayClone(history_order);
      if (new_history.code === "OK") {
        if (new_history.data.length) {
          newList = new_history.data.concat(newList);
        }
      }
      newList = helper.excludeRepeatArray("tradeId", newList, "time");
      newList.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      yield put({
        type: "save",
        payload: {
          history_order: newList,
        },
      });
    },
    *tradeable_req({ payload }, { call, put, select, take }) {
      let { config } = yield select((state) => state.layout);
      let symbol_ids = [];
      let exchange_id = "";
      const futuresSymbol = config.futuresSymbol;
      (futuresSymbol || []).map((item) => {
        symbol_ids.push(item.symbolId);
        exchange_id = item.exchangeId;
      });
      if (!Cookie.read("user_id")) {
        return;
      }
      const result = yield call(getData("futures_tradeable"), {
        payload: {
          token_ids: symbol_ids.join(","),
          exchange_id,
        },
      });
      if (result.code == "OK") {
        let d = {};
        (result.data || []).map((item) => {
          d[item["tokenId"]] = item;
        });
        yield put({
          type: "save",
          payload: {
            future_tradeable: d,
          },
        });
        WSDATA.setData("future_tradeable_source", result.data);
      }
    },
    // 获取所有永续合约的个性配置
    *getOrderSetting({ payload }, { call, put, select, take }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId || "undefined" == defaultAccountId) {
        defaultAccountId = Cookie.read("account_id");
        if (!defaultAccountId) {
          return;
        }
      }
      let { config } = yield select((state) => state.layout);
      const futuresSymbol = config.futuresSymbol;
      if (!futuresSymbol.length) {
        yield helper.delay(200);
        yield put({
          type: "getOrderSetting",
          payload: {},
        });
        return;
        // yield take("layout/get_all_token");
        // futuresSymbol = yield select(state => state.layout.futuresSymbol);
      }
      let symbol_ids = [];
      let exchange_id = "";
      futuresSymbol.map((item) => {
        symbol_ids.push(item.symbolId);
        exchange_id = item.exchangeId;
      });
      const result = yield call(getData("futures_order_setting"), {
        payload: {
          symbol_ids: symbol_ids.join(","),
          exchange_id,
        },
      });
      if (result.code == "OK" && result.data && result.data.length) {
        let obj = {};
        result.data.map((item) => {
          obj[item.symbolId] = item;
        });
        yield put({
          type: "save",
          payload: {
            order_setting: obj,
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    update_order(state, action) {
      const new_order_source = action.payload.future_order_source;
      let current_list = helper.arrayClone(state.current_list);
      let history_entrust = helper.arrayClone(state.history_entrust);
      const l = new_order_source.length;
      if (!l) {
        return { ...state };
      }
      new_order_source.map((item, i) => {
        const status = item.status;
        let n = -1;
        current_list.map((it, j) => {
          if (item.orderId === it.orderId) {
            n = j;
            return;
          }
        });
        // 新订单 or 部分成交
        if (status === "NEW" || status === "PARTIALLY_FILLED") {
          if (n === -1) {
            if (
              !current_list.length ||
              (current_list.length &&
                item.time - current_list[current_list.length - 1]["time"] > 0)
            ) {
              current_list.unshift(item);
            }
          } else {
            current_list[n] = item;
          }
          return;
        }
        let m = -1;
        history_entrust.forEach((it, k) => {
          if (it.orderId === item.orderId) {
            m = k;
            return;
          }
        });
        // 完全成交、已撤销
        if (status === "FILLED" || status === "CANCELED") {
          if (status === "FILLED") {
            WSDATA.setData("order_notice", 1, false);
          }
          if (!action.payload.oneWeekAgo) {
            // 当时间筛选为一周前，推送数据不放入历史委托
            if (m === -1) {
              if (
                !history_entrust.length ||
                (history_entrust.length &&
                  item.time -
                    history_entrust[history_entrust.length - 1]["time"] >
                    0)
              ) {
                history_entrust.unshift(item);
              }
            } else {
              history_entrust[m] = item;
            }
          }
          if (n > -1) {
            current_list.splice(n, 1);
          }
        }
      });
      WSDATA.clear("future_order_source");
      current_list = helper.excludeRepeatArray("orderId", current_list);
      current_list.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      history_entrust = helper.excludeRepeatArray("orderId", history_entrust);
      history_entrust.sort((a, b) => (a.time - b.time > 0 ? -1 : 1));
      return {
        ...state,
        current_list,
        history_entrust,
      };
    },
    // 订单ws订阅, 批量处理订单变化
    // 新订单或订单变化
    update_position(state, action) {
      const new_order_source = action.payload.future_position_source;
      let position_list = helper.arrayClone(state.position_list);
      const l = new_order_source.length;
      if (!l) return { ...state, position_list: [] };
      new_order_source.map((item, i) => {
        let n = -1;
        position_list.map((it, j) => {
          if (item.positionId === it.positionId) {
            n = j;
            return;
          }
        });
        let exitQuantity =
          n === -1 ? item.available : position_list[n].exitQuantity;
        exitQuantity = exitQuantity === "" ? "" : exitQuantity;
        item.exitPrice = n === -1 ? item.price : position_list[n].exitPrice;
        item.exitQuantity =
          exitQuantity === ""
            ? ""
            : Number(item.available) < Number(exitQuantity)
            ? item.available
            : exitQuantity;
        item.priceMsg = n === -1 ? "" : position_list[n].priceMsg;
        item.quantityMsg = n === -1 ? "" : position_list[n].quantityMsg;
        item.type = n === -1 ? "INPUT" : position_list[n].type;
      });
      return {
        ...state,
        position_list: new_order_source,
      };
    },
  },
};
