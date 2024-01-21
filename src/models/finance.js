/**
 * 充币提币
 */
import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import { routerRedux } from "dva/router";
import Cookie from "../utils/cookie";
import helper from "../utils/helper";

const limit = 20;
export default {
  namespace: "finance",

  state: {
    // 充币
    deposit: {
      allowDeposit: "", // 是否允许充币
      address: "", // 地址
      qrcode: "", // 二维码
      minQuantity: "" // 最小充值额
    },
    // 提币
    cash_status: false, // 提币状态
    cash: {
      available: "0", // 可用
      minQuantity: "0", // 最小提币数量
      dayQuota: "0", // 24小时最大提币额度
      usedQuota: "", // 已使用额度
      fee: "0", // 手续费
      minMinerFee: "0", // 最小矿工费
      maxMinerFee: "0", // 最大矿工费
      suggestMinerFee: "0", // 建议矿工费
      convertFee: "0",
      convertRate: "0",
      allowWithdraw: true // 是否允许提币
    },
    withdraw: {
      address_id: "", // 地址id
      quantity: "", // 数量
      verficode: "" // 验证码
    },
    address_list: [], // 提币地址列表
    // 充币记录
    rechangeLog: [],
    rechange_more: true,
    // 提币记录
    cashLog: [],
    cash_more: true,
    // 其他
    otherLog: [],
    other_more: true
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen(location => {
        const pathname = location.pathname;
        const ar = pathname.split("/");
        // 充币
        if (pathname.indexOf(route_map.rechange) > -1) {
          // 获取地址
          dispatch({
            type: "getAddress",
            payload: {
              tokenId: ar[ar.length - 1]
            }
          });
        }
        // 提币
        if (pathname.indexOf(route_map.cash) > -1) {
          // 获取币 数量
          dispatch({
            type: "quota_info",
            payload: {
              tokenId: ar[ar.length - 1]
            }
          });
          // 获取地址列表
          dispatch({
            type: "address_list",
            payload: {
              tokenId: ar[ar.length - 1]
            }
          });
        }
        // 地址管理
        if (pathname.indexOf(route_map.address) > -1) {
          // 获取地址列表
          dispatch({
            type: "address_list",
            payload: {
              tokenId: ar[ar.length - 1]
            }
          });
        }
      });
    }
  },

  effects: {
    // 添加地址
    *address_add({ payload, success }, { call, put, select }) {
      const result = yield call(getData("add_withraw_address"), { payload });
      if (result.code == "OK") {
        let address_list = yield select(state => state.finance.address_list);
        yield put({
          type: "save",
          payload: {
            address_list: [result.data].concat(address_list)
          }
        });
        success && success();
      } else {
        message.error(result.msg);
      }
    },
    // 删除提币地址
    *address_del({ payload, n, success }, { call, put, select }) {
      const result = yield call(getData("del_withraw_address"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["删除成功"]);
        const list = yield select(state => state.finance.address_list);
        const data = helper.arrayClone(list);
        if (n || n === 0) {
          data.splice(n, 1);
        }
        yield put({
          type: "save",
          payload: {
            address_list: data
          }
        });
        success && success();
      } else {
        message.error(result.msg);
      }
    },
    // 提币地址列表
    *address_list({ payload }, { call, put }) {
      const result = yield call(getData("get_withraw_address"), {
        payload: {
          token_id: payload.tokenId
        }
      });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            address_list: result.data
          }
        });
      }
    },
    // 提币 step1
    *withdraw_step1({ payload, success, fail }, { call, put, select }) {
      const { defaultAccountId } = yield select(state => state.layout.userinfo);
      if (!defaultAccountId) {
        message.error(window.appLocale.messages["未登录"]);
        return;
      }
      const cash_status = yield select(state => state.finance.cash_status);
      if (cash_status) return;
      yield put({
        type: "save",
        payload: {
          cash_status: true
        }
      });
      payload.account_id = defaultAccountId;
      try {
        const result = yield call(getData("withdraw"), { payload });
        if (result.code == "OK") {
          success({
            request_id: result.data.requestId,
            code_order_id: result.data.codeOrderId
          });
        } else {
          message.error(result.msg);
          fail(result.code);
        }
      } catch (err) {}
      yield put({
        type: "save",
        payload: {
          cash_status: false
        }
      });
    },
    // 提币 step2 重新发送验证码
    *cash_re_verify_code({ payload, fail, success }, { call, put }) {
      const result = yield call(getData("withdrawal_verify_code"), { payload });
      if (result.code === "OK") {
        success({
          code_order_id: result.data.codeOrderId
        });
      } else {
        message.error(result.msg);
        fail(result.code);
      }
    },
    // 提币 step2 验证码
    *withdraw_step2({ payload, history, fail }, { call, put, select }) {
      const cash_status = yield select(state => state.finance.cash_status);
      if (cash_status) return;
      yield put({
        type: "save",
        payload: {
          cash_status: true
        }
      });
      try {
        const r = yield call(getData("withdraw_verify"), { payload });
        if (r.code == "OK") {
          //message.info(window.appLocale.messages["提币成功"]);
          history.push(route_map.finance_list);
        } else {
          message.error(r.msg);
          fail(r.code);
        }
      } catch (err) {}
      yield put({
        type: "save",
        payload: {
          cash_status: false
        }
      });
    },
    // router change
    *jump({ payload }, { put }) {
      yield put(routerRedux.push(payload.to));
    },
    // state change
    *propsChange({ payload }, { put }) {
      yield put({
        type: "save",
        payload
      });
    },
    // 获取币 余额
    *quota_info({ payload }, { call, put, select }) {
      let userinfo = yield select(state => state.layout.userinfo);
      if (!userinfo.defaultAccountId) {
        const result = yield call(getData("userinfo"), {
          payload: {},
          method: "get"
        });
        if (result.code == "OK") {
          userinfo = {};
          userinfo.defaultAccountId = result.data.defaultAccountId;
        } else {
          message.error(result.msg);
          return;
        }
      }
      const result = yield call(getData("quota_info"), {
        payload: {
          account_id: userinfo.defaultAccountId,
          token_id: payload.tokenId
        }
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            cash: result.data
          }
        });
      }
    },
    // 获取币地址
    *getAddress({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select(state => state.layout.userinfo);
      if (!defaultAccountId) {
        const r = yield call(getData("userinfo"), {
          payload: {},
          method: "get"
        });
        if (r.code == "OK") {
          defaultAccountId = r.data.defaultAccountId;
        }
      }
      const result = yield call(getData("get_token_address"), {
        payload,
        method: "get"
      });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            //tokenId: payload.tokenId,
            deposit: {
              ...result.data
            }
          }
        });
      } else {
        if (result.msg) {
          message.error(result.msg);
        }
        yield put({
          type: "save",
          payload: {
            deposit: {}
          }
        });
      }
    },
    // 获取充提币记录
    *getOrders({ payload }, { call, put, select }) {
      const defaultAccountId = Cookie.read("account_id");
      const { rechangeLog, cashLog, otherLog } = yield select(
        state => state.finance
      );
      const result = yield call(
        getData(
          payload.column == "rechange"
            ? "deposit_order_list"
            : payload.column == "cash"
              ? "withdrawal_order_list"
              : "other_order_list"
        ),
        {
          payload: {
            account_id: defaultAccountId,
            from_order_id: payload.firstReq
              ? ""
              : payload.column == "rechange"
                ? rechangeLog.length
                  ? rechangeLog[rechangeLog.length - 1]["orderId"]
                  : ""
                : payload.column == "cash"
                  ? cashLog.length
                    ? cashLog[cashLog.length - 1]["orderId"]
                    : ""
                  : otherLog.length
                    ? otherLog[otherLog.length - 1]["flowId"]
                    : "",
            limit
          },
          method: "get"
        }
      );
      if (result.code === "OK") {
        let data = {};
        if (payload.column == "rechange") {
          data.rechangeLog = payload.firstReq
            ? result.data
            : [...rechangeLog].concat(result.data);
          data.rechange_more = result.data.length < limit ? false : true;
        } else if (payload.column == "cash") {
          data.cashLog = payload.firstReq
            ? result.data
            : [...cashLog].concat(result.data);
          data.cash_more = result.data.length < limit ? false : true;
        } else {
          data.otherLog = payload.firstReq
            ? result.data
            : [...otherLog].concat(result.data);
          data.other_more = result.data.length < limit ? false : true;
        }
        yield put({
          type: "save",
          payload: data
        });
      }
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
