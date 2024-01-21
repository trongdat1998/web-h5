import getData from "../services/getData";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import { message } from "../lib/index";
import cookie from "../utils/cookie";
import math from "../utils/mathjs";
import API from "../config/api";
import WSDATA from "./data_source";
import CONST from "../config/const";
import { callHandler } from "../utils/app_jsbridge";
import WS from "../utils/ws";

export default {
  namespace: "layout",

  // layout的state全局共用，需要注意key重复问题，其他model的key如果跟layout的key重名，值会覆盖layout的值
  state: {
    // 个性化配置项
    index_config: {
      logo: "", // 券商logo url
      copyright: "", // copyright data
      zendesk: "", // zendesk url
      title: "", // website title
      banners: [
        {
          imgUrl: "", // banner 图片地址
          isDirect: true, // 是否跳转
          directUrl: "", // 跳转地址
          sort: 1,
        },
      ],
      announcements: [],
      userAgreement: "", // 用户协议页面地址
      privacyAgreement: "", // 隐私协议地址
      legalDescription: "", // 法律说明地址
      helpCenter: "", // 帮助中心地址

      featureTitle: "", // 平台特点
      features: [],
      shares: [],
      total_asset: null,
    },
    config: {
      ...(window.WEB_CONFIG.token
        ? {
            ...window.WEB_CONFIG,
            tokens: (() => {
              let tokens = {};
              window.WEB_CONFIG.token &&
                window.WEB_CONFIG.token.map((item) => {
                  tokens[item.tokenId] = item;
                  //   if (
                  //     item.tokenId == "USDT" &&
                  //     item.chainTypes &&
                  //     item.chainTypes.length
                  //   ) {
                  //     tokens[item.tokenId]["chainTypes"] = item.chainTypes.sort(
                  //       (a, b) =>
                  //         a.chainType.toUpperCase() >= b.chainType.toUpperCase()
                  //           ? 1
                  //           : -1
                  //     );
                  //   }
                });
              return tokens;
            })(),
            symbols: (() => {
              let symbols = {};
              window.WEB_CONFIG.symbol &&
                window.WEB_CONFIG.symbol.map((item) => {
                  symbols[item.symbolId] = item;
                });
              return symbols;
            })(),
            symbols_obj: (() => {
              let symbols_obj = {
                coin: {},
                option: {},
                futures: {},
                all: {},
              };
              (window.WEB_CONFIG.symbol || []).map((item, i) => {
                symbols_obj.coin[item.symbolId] = item;
                symbols_obj.all[item.symbolId] = item;
              });
              (window.WEB_CONFIG.optionSymbol || []).map((item, i) => {
                symbols_obj.option[item.symbolId] = item;
                symbols_obj.all[item.symbolId] = item;
              });
              (window.WEB_CONFIG.futuresSymbol || []).map((item, i) => {
                symbols_obj.futures[item.symbolId] = item;
                symbols_obj.all[item.symbolId] = item;
              });
              return symbols_obj;
            })(),
          }
        : {
            token: [],
            tokens: {},
            symbol: [],
            symbols: {},
            supportLanguages: [],
            recommendSymbols: [],
            quoteToken: [],
            page: {},
            orgId: "",
            optionUnderlying: [],
            optionToken: [],
            optionSymbol: [],
            optionQuoteToken: [],
            optionCoinToken: [],
            kycCardType: [],
            futuresUnderlying: [],
            futuresSymbol: [],
            futuresCoinToken: [],
            functions: {},
            exploreToken: [],
            customKV: {},
            checkInviteCode: false,
            symbols_obj: {
              coin: {},
              option: {},
              futures: {},
              all: {},
            },
          }),
    },
    // 法币单位,默认en-us
    unit: window.localStorage.unit || "en-us",
    // 是否登录
    islogin: false,
    // 用户信息
    userinfo:
      window.sessionStorage.userinfo && cookie.read("account_id")
        ? JSON.parse(window.sessionStorage.userinfo)
        : {
            email: "",
            defaultAccountId: "",
            bindGA: false,
            mobile: "",
            userId: "",
            accounts: [],
            registerType: "",
            verifyStatus: "",
          },
    // 用户自选 {sysmbolId:1...}
    favorite: {},
    // 账户资产
    user_balance: [],
    getBalance: false,
    // kline 语言 与 locale map表
    kline_locale: {
      "en-us": "en",
      "zh-cn": "zh",
      "ko-kr": "ko",
      "ja-jp": "ja",
      "vi-vn": "vi",
    },
    // 手机号区号与语言关系
    areacode: {
      "zh-cn": 86,
      "en-us": 65,
      "ko-kr": 82,
      "ja-jp": 81,
      "ru-ru": 7,
      "vi-vn": 84,
      "es-es": 34,
    },

    // 汇率
    rates: {},
    order_id: "",

    // 默认k线分辨率
    resolution: "1m",
    // 国家列表
    countries: [],

    // 子账户列表
    child_account_list: [],
    account_coin_index: 0, // 币币主账户在账户列表中的index
    account_future_index: 0, // 合约主账户在账户列表中的index
    // 子账户类型
    child_account_type: [],
    // 子账户资产
    /**
     *  {
     *    accountId: [{token:USDT,free:3.5},...]
     *  }
     */
    child_account_balance: {},
    // 用户等级配置信息
    levelSettings: {},
    // 用户自定义配置
    customConfig: window.sessionStorage.customConfig
      ? JSON.parse(window.sessionStorage.customConfig || "{}")
      : {},
    geetestData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 启动行情qws
      const qws = new WS(API.qws);
      dispatch({
        type: "save",
        payload: {
          qws: qws,
        },
      });
      dispatch({
        type: "get_rates",
        payload: {},
      });
      // 设置初始的法币单位
      dispatch({
        type: "setUnit",
        payload: {
          lang: window.localStorage.unit || "en-us",
        },
      });
      // eslint-disable-line
      dispatch({
        type: "countries",
        payload: {
          // 注册
          for_area_code: true,
        },
      });

      dispatch({
        type: "getConfig",
        payload: {},
      });
      dispatch({
        type: "userinfo",
        payload: {},
        dispatch,
      });
      // webview的history.goback, 不触发js的方法
      window.addEventListener(
        "pageshow",
        () => {
          const pathname = window.location.pathname;
          // 设置页面app级别
          if (/bhe.?App/i.test(window.navigator.userAgent)) {
            callHandler({
              name: "isFirstPage",
              data: {
                isFirstPage: false,
              },
            });
          }
        },
        false
      );
      history.listen((location) => {
        const pathname = location.pathname;
        const search = location.search;
        const preview = /preview/.test(search);

        // 根据cookie  account_id 判断是否登录
        let r = false;
        route_map.noLogin.map((item) => {
          if (
            (route_map[item] != route_map.index2 &&
              route_map[item] != route_map.index &&
              pathname.indexOf(route_map[item]) > -1) ||
            pathname === route_map.index ||
            pathname === route_map.index2
          ) {
            r = true;
          }
        });
        // 需登录才可访问的页面 && 未登录，，直接跳登录页
        if (!r && pathname !== route_map.login && !cookie.read("account_id")) {
          window.location.href =
            route_map.login +
            "?redirect=" +
            encodeURIComponent(window.location.href);
          return;
        }

        // 设置页面app级别， history change 与 pageshow 同时调用
        if (/bhe.?App/i.test(window.navigator.userAgent)) {
          callHandler({
            name: "isFirstPage",
            data: {
              isFirstPage: false,
            },
          });
        }
      });
    },
  },

  effects: {
    // 获取用户自定义配置
    *getCustomConfig({ payload, callback }, { call, put, select }) {
      const { userinfo } = yield select((state) => state.layout);
      if (userinfo != null && userinfo.userId) {
        // 用户已经登录了
        const ret = yield call(getData("get_custom_config"), {
          payload,
        });
        if (ret.code == "OK" && ret.data.commonConfig) {
          try {
            yield put({
              type: "saveCustomConfig",
              payload: {
                customConfig: JSON.parse(ret.data.commonConfig),
              },
            });
          } catch (e) {
            console.log(e);
          }
        }
      }
    },

    // 设置用户自定义配置
    *setCustomConfig({ payload, callback }, { call, put, select }) {
      const { userinfo } = yield select((state) => state.layout);
      if (userinfo != null && userinfo.userId) {
        // 用户已经登录了
        let customConfig = yield select((state) => state.layout.customConfig);
        console.log(customConfig, payload);
        customConfig = {
          ...customConfig,
          ...payload,
        };
        console.log(customConfig);
        const ret = yield call(getData("set_custom_config"), {
          payload: {
            common_config: JSON.stringify(customConfig),
          },
        });
        if (ret.code == "OK") {
          yield put({
            type: "getCustomConfig",
          });
        }
      }
    },
    // 设置初始值
    *init({ payload }, { put, select }) {
      const config = yield select((state) => state.layout.config);
      let symbols_obj = {
        coin: {},
        option: {},
        futures: {},
        all: {},
      };
      (config.symbol || []).map((item, i) => {
        symbols_obj.coin[item.symbolId] = item;
        symbols_obj.all[item.symbolId] = item;
      });
      (config.optionSymbol || []).map((item, i) => {
        symbols_obj.option[item.symbolId] = item;
        symbols_obj.all[item.symbolId] = item;
      });
      (config.futuresSymbol || []).map((item, i) => {
        symbols_obj.futures[item.symbolId] = item;
        symbols_obj.all[item.symbolId] = item;
      });

      yield put({
        type: "save",
        payload: {
          symbols_obj,
        },
      });
    },
    // 设置法币单位
    *setUnit({ payload }, { put, select }) {
      const config = yield select((state) => state.layout.config);
      // 设置法币单位
      const supportLanguages = config.supportLanguages || [];
      let lang = payload.lang || window.localStorage.unit;
      let unit = "";
      supportLanguages.map((item) => {
        if (item.lang == lang) {
          unit = item.lang;
        }
      });
      yield put({
        type: "save",
        payload: {
          unit,
        },
      });
    },
    // countries
    *countries({ payload }, { call, put }) {
      const result = yield call(getData("countries"), { payload });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            countries: result.data,
          },
        });
      } else {
        yield helper.delay(200);
        yield put({
          type: "countries",
          payload: {},
        });
      }
    },
    *getConfig({ payload }, { call, put }) {
      const result = yield call(getData("index_config"), {
        payload,
        method: "get",
      });
      if (result.code === "OK" && result.data) {
        if (result.data.title) {
          window.document.title = result.data.title;
        }
        if (result.data.keywords) {
          const meta = document.createElement("meta");
          meta.setAttribute("content", result.data.keywords);
          meta.setAttribute("name", "keywords");
          document.querySelector("head").appendChild(meta);
        }
        if (result.data.description) {
          const meta = document.createElement("meta");
          meta.setAttribute("content", result.data.description);
          meta.setAttribute("name", "description");
          document.querySelector("head").appendChild(meta);
        }
        if (result.data.favicon) {
          let a = document.createElement("link");
          a.setAttribute("rel", "shortcut icon");
          a.setAttribute("href", result.data.favicon);
          window.document.querySelector("head").appendChild(a);
        }
        yield put({
          type: "save",
          payload: {
            index_config: result.data,
          },
        });
      }
    },
    // 获取汇率
    *get_rates({ payload }, { call, put, select }) {
      const { config } = yield select((state) => state.layout);

      let keys = new Set();
      keys.add("BTC");
      keys.add("USDT");
      (config.token || []).map((item) => {
        keys.add(item.tokenId);
      });
      let values = new Set();
      values.add("BTC");
      values.add("USDT");
      window.WEB_CONFIG.supportLanguages.map((item) => {
        if (item.lang == window.localStorage.unit) {
          values.add(item.suffix);
        }
      });
      // (config.quoteToken || []).map(item => {
      //   values.add(item.tokenId);
      // });

      values = Array.from(values);
      try {
        const result = yield call(getData("rate2"), {
          payload: {
            tokens: Array.from(keys).join(",").toUpperCase(),
            legalCoins: values.join(",").toUpperCase(),
          },
        });
        if (
          result.code == "OK" &&
          result.data &&
          (result.data.code == 0 || result.data.code == 200) &&
          result.data.data
        ) {
          let rates = {};
          result.data.data.map((item, i) => {
            if (item) {
              rates[item.token] = item.rates;
            }
          });
          yield put({
            type: "save",
            payload: {
              rates,
            },
          });
        }
      } catch (e) {
        console.error(e);
      }
      yield helper.delay(10000);
      yield put({
        type: "get_rates",
        payload: {},
      });
    },
    /**
     * 发送验证码
     * @param payload {Object}
     * @param email {String} 发送email验证码
     * @param mobile {Number} 发送mobile验证码
     * @param n {String} 默认0，0=登录前，1=登录后,2=登录时二次验证
     * @param order_id_name {String} 有值，返回的order_id的key,用在页面同时出现2个及验证码时
     */
    *get_verify_code(
      { payload, errorCallback, n = 0, order_id_name = "order_id" },
      { call, put }
    ) {
      const result = yield call(
        getData(
          payload.email
            ? [
                "send_email_verify_code",
                "send_email2_verify_code",
                "send_email_verify_code_authorize_advance",
              ][n]
            : [
                "send_sms_verify_code",
                "send_sms2_verify_code",
                "send_sms_verify_code_authorize_advance",
              ][n]
        ),
        { payload }
      );
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["验证码发送成功"]);
        yield put({
          type: "save",
          payload: {
            [order_id_name]: result.data.orderId,
          },
        });
      } else {
        message.error(result.msg);
        // 失败，如google验证未通过等
        errorCallback && errorCallback();
      }
    },
    // get user info
    *userinfo({ payload }, { put, call, select }) {
      // 写入本地自选数据
      const locale = JSON.parse(
        !window.localStorage.favorite ||
          window.localStorage.favorite == "undefined" ||
          typeof window.localStorage.favorite === "undefined"
          ? "{}"
          : window.localStorage.favorite
      );
      yield put({
        type: "save",
        payload: {
          favorite: locale,
        },
      });
      if (!cookie.read("account_id")) {
        return;
      }
      // if (!cookie.read("account_id")) {
      //   return;
      // }
      // const userinfo = yield select(state => state.layout.userinfo);
      // if (userinfo.defaultAccountId || window.sessionStorage.userinfo) {
      //   return;
      // }
      try {
        const result = yield call(getData("userinfo"), {
          payload,
          method: "get",
        });
        if (result.code == "OK") {
          const favorites = result.data.favorites || [];
          let favorite = {};
          favorites.map((item) => {
            favorite[item.symbolId] = item;
          });
          window.sessionStorage.userinfo = JSON.stringify(result.data);
          const _ws = yield select((state) => state.layout.ws);
          // 启动订单行情
          const ws = _ws || new WS(API.ws);
          yield put({
            type: "save",
            payload: {
              userinfo: result.data,
              favorite: favorite,
              ws: ws,
            },
          });
          yield put({
            type: "account_list",
            payload: {},
          });
        } else {
          // 30000 鉴权失败，其他code是后端业务失败
          if (result.code === 30000) {
            const pathname = window.location.pathname;
            let r = false;
            route_map.noLogin.map((item) => {
              if (
                (route_map[item] != route_map.index2 &&
                  route_map[item] != route_map.index &&
                  pathname.indexOf(route_map[item]) > -1) ||
                pathname === route_map.index ||
                pathname === route_map.index2
              ) {
                r = true;
              }
            });
            cookie.del("account_id");
            window.sessionStorage.removeItem("userinfo");
            // 需登录才可访问的页面 && 未登录，，直接跳登录页
            if (!r && pathname !== route_map.login) {
              if (/bhe.?App/i.test(navigator.userAgent)) {
                callHandler({
                  name: "login",
                  data: {
                    redirect: window.location.href,
                  },
                });
                return;
              }
              window.location.href =
                route_map.login +
                "?redirect=" +
                encodeURIComponent(window.location.href);
              return;
            }
          }
        }
      } catch (e) {}
    },
    // 获取用户资产
    *getAccount({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = cookie.read("account_id");
      }
      if (!defaultAccountId) return;
      const r = yield call(getData("get_asset"), {
        payload: {
          account_id: defaultAccountId,
        },
        method: "get",
      });
      if (r.code === "OK") {
        let btcValue = 0;
        (r.data || []).map((item) => {
          btcValue = math
            .chain(math.bignumber(btcValue))
            .add(math.bignumber(item.btcValue))
            .format({ notation: "fixed" })
            .done();
        });
        WSDATA.setData("user_balance_source", r.data);
        yield put({
          type: "save",
          payload: {
            user_balance: r.data || [],
            asset_get: {
              btcValue,
            },
            getbalance: true,
          },
        });
      }
    },
    // logout
    *logout({ payload }, { call }) {
      const result = yield call(getData("logout"), { payload });
      // 注册成功，跳转登录页
      if (result.code == "OK") {
        //message.info(window.appLocale.messages["登出成功"]);
        cookie.del("account_id");
        window.sessionStorage.removeItem("userinfo");
        helper.delay(1000).then(() => {
          window.location.href = route_map.index;
        });
      } else {
        message.error(result.msg);
      }
    },

    // 属性变化
    *handleChange({ payload }, { put }) {
      if (payload.trading_index || payload.trading_index === 0) {
        window.localStorage.trading_index = payload.trading_index;
      }
      yield put({
        type: "save",
        payload,
      });
    },
    // 获取总资产
    *getTotalAsset({ payload }, { call, put, select }) {
      let { defaultAccountId } = yield select((state) => state.layout.userinfo);
      if (!defaultAccountId) {
        defaultAccountId = cookie.read("account_id");
      }
      if (defaultAccountId) {
        try {
          const result = yield call(getData("get_total_asset"), {
            payload,
            method: "get",
          });
          if (result.code === "OK") {
            yield put({
              type: "save",
              payload: {
                total_asset: result.data,
              },
            });
          }
        } catch (e) {}
      }
      yield helper.delay(2000);
      yield put({
        type: "getTotalAsset",
        payload,
      });
    },
    // 自选
    *favorite({ payload }, { call, put, select }) {
      let { userinfo, favorite } = yield select((state) => state.layout);
      let favorite_new = Object.assign({}, favorite);
      if (favorite[payload.symbolId]) {
        delete favorite_new[payload.symbolId];
      } else {
        favorite_new[payload.symbolId] = true;
      }
      window.localStorage.favorite = JSON.stringify(favorite_new);
      yield put({
        type: "save",
        payload: {
          favorite: favorite_new,
        },
      });
      if (userinfo.defaultAccountId) {
        yield call(
          getData(
            favorite[payload.symbolId] ? "favorite_cancel" : "favorite_create"
          ),
          {
            payload: {
              symbol_id: payload.symbolId,
              exchange_id: payload.exchangeId,
            },
          }
        );
      }
    },
    // 账户列表
    *account_list({ payload }, { call, put }) {
      const result = yield call(getData("account_list"), { payload });
      if (result.code == "OK" && result.data && result.data.length) {
        let data = [];
        let account_coin_index = 0;
        let account_future_index = 0;
        result.data.map((item, i) => {
          data.push(item);
          if (item.accountType == 1 && item.accountIndex == 0) {
            account_coin_index = i;
          }
          if (item.accountType == 3 && item.accountIndex == 0) {
            account_future_index = i;
          }
        });
        yield put({
          type: "save",
          payload: {
            child_account_list: data,
            account_coin_index,
            account_future_index,
          },
        });
      }
    },
    // 账户类型
    *account_type({ payload }, { call, put }) {
      const result = yield call(getData("account_type"), { payload });
      if (result.code == "OK") {
        yield put({
          type: "save",
          payload: {
            child_account_type: result.data,
          },
        });
      }
    },
    // 账户资产
    *child_account_balance({ payload }, { call, put, select }) {
      try {
        const result = yield call(getData("transfer_available"), { payload });
        if (result.code === "OK") {
          const child_account_balance = yield select(
            (state) => state.layout.child_account_balance
          );
          const data = child_account_balance[payload.account_id] || [];
          const res_data = result.data;
          const i = data.findIndex((item) => item.tokenId == payload.token_id);
          if (i > -1) {
            data[i] = { tokenId: payload.token_id, free: res_data.amount };
          } else {
            data.push({ tokenId: payload.token_id, free: res_data.amount });
          }
          yield put({
            type: "save",
            payload: {
              child_account_balance: {
                ...child_account_balance,
                [payload.account_id]: data,
              },
            },
          });
        }
      } catch (e) {}
    },
    // 资产划转
    *assetTransfer(
      { payload, callback, enqueueSnackbar },
      { call, put, select }
    ) {
      const result = yield call(getData("asset_transfer"), { payload });
      if (result.code === "OK") {
        // yield put({
        //   type: "getOptionAssetAva",
        //   payload: {}
        // });
        yield put({
          type: "getAccount",
          payload: {},
        });
        // yield put({
        //   type: "getFuturesAsset",
        //   payload: {}
        // });
        // yield put({
        //   type: "getTotalAsset",
        //   payload: {
        //     unit: "btc"
        //   }
        // });
        yield put({
          type: "future/tradeable_req",
          payload: {},
        });
        if (callback && typeof callback === "function") {
          callback();
        }
      } else {
        result.msg &&
          enqueueSnackbar &&
          enqueueSnackbar(result.msg, { variant: "error" });
      }
    },
    // 拉取永续合约，期权支持的币种
    *coin_tokens({ payload }, { call, put }) {
      const result = yield call(getData("coin_tokens"), { payload });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            option_coin_token: result.data.optionCoinToken,
            futures_coin_token: result.data.futuresCoinToken,
          },
        });
      }
    },
    // 获取配置信息（区分语言）
    *get_custom_kv({ payload, cb }, { call, put, select }) {
      const result = yield call(getData("custom_kv"), {
        payload,
        method: "get",
      });
      cb && cb(result);
    },

    *registGeetest({ payload, onSuccess }, { call, put, select }) {
      const ret = yield call(getData("regist_geetest"), {
        payload,
      });
      if (ret.code == "OK") {
        yield put({
          type: "save",
          geetestData: ret.data,
        });
        onSuccess && onSuccess(ret.data);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    // 资产订阅,源数据
    user_balance_source(state, action) {
      let user_balance_source = Object.assign({}, state.user_balance_source);
      let data = action.payload.data[0];
      user_balance_source[data["tokenId"]] = data;
      return { ...state, user_balance_source };
    },
    // 更新资产
    user_balance(state, action) {
      const user_balance_source = action.payload.user_balance_source;
      if (!Object.keys(user_balance_source).length) {
        return { ...state };
      }
      const user_balance = helper.arrayClone(state.user_balance);
      let obj = {};
      user_balance.forEach((item) => {
        obj[item.tokenId] = item;
      });
      obj = Object.assign({}, obj, user_balance_source);
      let ar = [];
      Object.keys(obj).forEach((item) => {
        ar.push(obj[item]);
      });
      //WSDATA.clear("user_balance_source");
      return { ...state, user_balance: ar };
    },
  },
};
