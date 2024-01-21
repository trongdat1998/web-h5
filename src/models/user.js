import getData from "../services/getData";
import { message } from "../lib";
import route_map from "../config/route_map";
import helper from "../utils/helper";
import Cookie from "../utils/cookie";
import md5 from "md5";
import CONST from "../config/const";

const LIMIT = 10;
export default {
  namespace: "user",

  state: {
    // oauth
    oauth: {
      requestId: "",
      appName: "",
      functions: [],
    },
    // 登录验证方式
    loginVerify: {
      bindMobile: false,
      bindEmail: false,
      bindGA: false,
      requestId: "",
      registerType: 0,
      email: "",
      mobile: "",
    },
    // 邀请注册成功信息
    invite_register: {
      logoUrl: "",
      text: "",
      iosDownloadUrl: "",
      androidDownloadUrl: "",
    },
    //countries: [], // 国家列表
    id_card_type: [], // 证件类型
    api_list: [], // api list
    // ga info
    ga_info: {
      secretKey: "",
      qrcode: "",
    },
    // 重置密码order id
    resetpwdId: "",
    // 实名信息
    verify_info: {},
    // 登录日志
    authorize_log: [],
    authorize_log_more: true,
    total: 0, // 总条数
    page: 1, // 页码
    rowsPerPage: CONST.rowsPerPage, // 每页条数
    rowsPerPage1: CONST.rowsPerPage1, // 成员列表加载条数
    rowsPerPageOptions: CONST.rowsPerPageOptions, // 条数选项
    hasmore: true,
    tableData: [], // 列表数据
    cardCount: { 1: 0, 2: 0, 3: 0 },
    // 用户等级信息
    user_level_info: {}, // 用户享有的等级权益信息
    level_configs: [], // 等级配置信息
    have_token_discount: {}, // 等级折扣信息
    marks: [],
    borrowableTokens: [], // 杠杆可借的币种
    marginLevelInterest: {}, // 杠杆利率
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen((location) => {
        const pathname = location.pathname;
        if (pathname.indexOf(route_map.bonus_register) > -1) {
          function setFontSize() {
            let htmlWidth =
              document.documentElement.clientWidth || document.body.clientWidth;
            let htmlDom = document.getElementsByTagName("html")[0];
            if (htmlWidth > 750) {
              htmlWidth = 750;
            }
            htmlDom.style.fontSize = ((htmlWidth * 2) / 750) * 14 + "px";
          }
          setFontSize();
          window.addEventListener("resize", () => setFontSize(), false);
        }
        if (
          pathname.indexOf(route_map.register) > -1 ||
          pathname.indexOf(route_map.login) > -1 ||
          pathname.indexOf(route_map.user_bind) > -1
        ) {
          // dispatch({
          //   type: "getCountries",
          //   payload: {}
          // });
        }
        if (pathname.indexOf(route_map.user_kyc) > -1) {
          dispatch({
            type: "getIdCardType",
            payload: {},
          });
          // dispatch({
          //   type: "getCountries",
          //   payload: {}
          // });
          dispatch({
            type: "verify_info",
            payload: {},
          });
        }
        if (pathname.indexOf(route_map.user_api) > -1) {
          dispatch({
            type: "api_list",
            payload: {},
          });
        }
        if (pathname.indexOf(route_map.user_center) > -1) {
          dispatch({
            type: "authorize_log",
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    // 获取国家区号
    *getCountries({ payload }, { call, put }) {
      const result = yield call(getData("countries"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            countries: result.data,
          },
        });
      }
    },
    // 下载引导页信息
    *download_info({ payload }, { call, put }) {
      const result = yield call(getData("download_info"), { payload });
      if (result.code === "OK") {
        if (!result.data.downloadWebUrl) {
          window.trackPageError &&
            window.trackPageError({
              error_code: 400,
              error_message: "value missed",
            });
        }
        yield put({
          type: "save",
          payload: {
            invite_register: result.data,
          },
        });
      }
    },
    *handleChange({ payload }, { call, put, select }) {
      let user = yield select((state) => state.user);
      if (payload.register) {
        user.register = Object.assign({}, user.register, payload.register);
      }
      if (payload.login) {
        user.login = Object.assign({}, user.login, payload.login);
      }
      yield put({
        type: "save",
        payload: { ...user },
      });
    },
    *propsChange({ payload }, { put }) {
      yield put({
        type: "save",
        payload,
      });
    },
    // 提交注册
    *register(
      { payload, history, redirect, errorCallback, callback },
      { call, put, select }
    ) {
      let data = payload;
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(
        getData(payload.type == 0 ? "register" : "register_mobile"),
        {
          payload: data,
        }
      );
      // 注册成功，跳转登录页
      if (result.code == "OK") {
        if (payload.callback) {
          // captain register or bonus register
          callback && callback();
        } else {
          // 授权
          if (payload.is_oauth) {
            if (!result.data.oauthCodeResult) {
              errorCallback &&
                errorCallback(window.appLocale.messages["授权错误"]);
              return;
            }
            message.info(window.appLocale.messages["授权成功"]);
            setTimeout(() => {
              const d = result.data.oauthCodeResult;
              const url =
                d.redirectUrl +
                (decodeURIComponent(d.redirectUrl.indexOf("?")) > -1
                  ? "&"
                  : "?") +
                "code=" +
                d.code +
                "&expired=" +
                d.expired +
                "&state=" +
                d.state;
              window.location.href = url;
            }, 1500);
            return;
          }

          //message.info(window.appLocale.messages["注册成功"]);
          if (redirect) {
            window.location.href = decodeURIComponent(redirect);
          } else {
            window.location.href = route_map.index;
            //history.push(route_map.index);
          }
        }
      } else {
        message.error(result.msg);
      }
    },
    *quick_register({ payload }, { call, put, select }) {
      let data = payload;
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(getData("quick_register"), { payload: data });
      // 注册成功，跳转下载引导页
      if (result.code == "OK") {
        window.location.href = route_map.register_step2;
      } else {
        message.error(result.msg);
      }
    },
    // oauth获取信息
    *oauth2_authorize({ payload }, { call, put }) {
      const result = yield call(getData("oauth2_authorize"), {
        payload: {
          ...payload,
          redirect_uri: encodeURIComponent(payload.redirect_uri),
        },
      });
      if (result.code === "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            oauth: result.data,
          },
        });
      } else {
        message.info(result.msg);
      }
    },
    // 登录 step1
    *login_step1(
      { payload, history, success, fail, redirect, channel },
      { call, put }
    ) {
      let data = payload;
      data.password = md5(payload.password);
      let url = payload.url
        ? payload.url
        : payload.type == 1
        ? "login"
        : "quick_authorize";
      if (!payload.url && channel && channel == "login" && payload.type == 1) {
        url = "login_all";
      }
      const result = yield call(getData(url), {
        payload: data,
      });
      if (result.code === "OK") {
        if (payload.is_oauth) {
          if (result.data.need2FA) {
            yield put({
              type: "save",
              payload: {
                loginVerify: result.data,
              },
            });
            success();
            return;
          }
          if (!result.data.oauthCodeResult) {
            fail && fail(result.code, window.appLocale.messages["授权错误"]);
            return;
          }
          message.info(window.appLocale.messages["授权成功"]);
          setTimeout(() => {
            const d = result.data.oauthCodeResult;
            const url =
              d.redirectUrl +
              (decodeURIComponent(d.redirectUrl.indexOf("?")) > -1
                ? "&"
                : "?") +
              "code=" +
              d.code +
              "&expired=" +
              d.expired +
              "&state=" +
              d.state;
            window.location.href = url;
          }, 1500);
          return;
        }
        if (
          // 密码登录
          (!result.data.bindEmail &&
            !result.data.bindGA &&
            !result.data.bindMobile &&
            payload.type == 1) ||
          // 快捷登录
          (payload.type == 0 && !result.data.needCheckPassword)
        ) {
          window.localStorage.removeItem("resetpwdType");
          window.sessionStorage.userinfo = JSON.stringify(result.data);
          yield put({
            type: "layout/save",
            payload: {
              userinfo: result.data,
            },
          });
          if (redirect) {
            window.location.href = decodeURIComponent(redirect);
          } else {
            window.location.href = route_map.index;
            //history.push(route_map.index);
          }
          return;
        }
        yield put({
          type: "save",
          payload: {
            loginVerify: result.data,
          },
        });
        success();
      } else {
        // 业务需求，在组件内判断是否弹message
        //message.error(result.msg)
        fail(result.code, result.msg);
      }
    },
    // 登录 step2
    *login_step2({ payload, history, redirect, errorCallback }, { call, put }) {
      let data = payload;
      data.password = md5(payload.password);
      const result = yield call(
        getData(
          payload.url
            ? payload.url
            : payload.type == 1
            ? "login_step2"
            : "quick_authorize_advance"
        ),
        {
          payload: data,
        }
      );
      if (result.code === "OK" && result.data) {
        window.localStorage.removeItem("resetpwdType");
        yield put({
          type: "layout/save",
          payload: {
            userinfo: result.data,
          },
        });
        if (payload.is_oauth) {
          if (!result.data.oauthCodeResult) {
            errorCallback &&
              errorCallback(window.appLocale.messages["授权错误"]);
            return;
          }
          message.info(window.appLocale.messages["授权成功"]);
          setTimeout(() => {
            const d = result.data.oauthCodeResult;
            const url =
              d.redirectUrl +
              (decodeURIComponent(d.redirectUrl.indexOf("?")) > -1
                ? "&"
                : "?") +
              "code=" +
              d.code +
              "&expired=" +
              d.expired +
              "&state=" +
              d.state;
            window.location.href = url;
          }, 1500);
          return;
        }
        if (redirect) {
          window.location.href = decodeURIComponent(redirect);
        } else {
          window.location.href = route_map.index;
        }
      } else {
        message.error(result.msg);
        errorCallback && errorCallback();
      }
    },
    // ga_info bind ga step1
    *ga_info({ payload }, { call, put }) {
      const result = yield call(getData("ga_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            ga_info: result.data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // bind ga step2
    *bind_ga({ payload, errorCallback, history }, { call, put }) {
      const result = yield call(getData("bind_ga"), { payload });
      if (result.code == "OK") {
        //message.info(window.appLocale.messages["谷歌绑定成功"]);
        history.push(route_map.user_center);
      } else {
        message.error(result.msg);
        errorCallback();
      }
    },
    // bind mobile
    *bind_mobile({ payload, history }, { call }) {
      const result = yield call(getData("bind_mobile"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["手机绑定成功"]);
        history.push(route_map.user_center);
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    // bind email
    *bind_email({ payload, history }, { call }) {
      const result = yield call(getData("bind_email"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["邮箱绑定成功"]);
        history.push(route_map.user_center);
      } else {
        message.error(result.msg);
      }
    },
    // 登录日志
    *authorize_log({ payload }, { call, put, select }) {
      const defaultAccountId = Cookie.read("account_id");
      const authorize_log = yield select((state) => state.user.authorize_log);
      const result = yield call(getData("authorize_log"), {
        payload: {
          log_id: authorize_log.length
            ? authorize_log[authorize_log.length - 1]["id"]
            : "",
          limit: LIMIT,
        },
      });
      if (result.code === "OK") {
        let data = {};
        data.authorize_log = helper
          .arrayClone(authorize_log)
          .concat(result.data);
        data.authorize_log_more = result.data.length < LIMIT ? false : true;
        yield put({
          type: "save",
          payload: data,
        });
      }
    },
    // forget password
    *forgetpassword({ payload, errorCallback }, { call, put }) {
      const result = yield call(
        getData(payload.email ? "email_find_password" : "mobile_find_password"),
        { payload }
      );
      if (result.code === "OK") {
        window.localStorage.resetpwdType = payload.email ? 0 : 1;
        yield put({
          type: "save",
          payload: {
            resetpwdId: result.data.requestId,
          },
        });
      } else {
        message.error(result.msg);
        errorCallback && errorCallback();
      }
    },
    // resetpwd
    *resetpwd({ payload, history }, { call, put }) {
      let data = payload;
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(getData("reset_password"), { payload: data });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["密码重置成功,请重新登录"]);
        window.location.href = route_map.login;
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    // 修改密码
    *editpassword({ payload, history }, { call, put }) {
      let data = payload;
      data.old_password = md5(payload.old_password);
      data.password1 = md5(payload.password1);
      data.password2 = md5(payload.password2);
      const result = yield call(getData("update_pwd"), { payload: data });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["修改成功，请重新登录"]);
        Cookie.del("account_id");
        window.location.href = route_map.login;
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    // 证件类型
    *getIdCardType({ payload }, { call, put }) {
      const result = yield call(getData("id_card_type"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            id_card_type: result.data,
          },
        });
      }
    },
    // 实名认证
    *kyc({ payload, history }, { call, put }) {
      const result = yield call(getData("kyc"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["提交成功"]);
        history.push(route_map.user_center);
      } else {
        // 登录失效
        message.error(result.msg);
      }
    },
    *verify_info({ payload }, { call, put }) {
      const result = yield call(getData("verify_info"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            verify_info: result.data,
          },
        });
      }
    },
    // api list
    *api_list({ payload }, { call, put }) {
      const result = yield call(getData("api_list"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            api_list: result.data,
          },
        });
      } else {
        // 登录失效
        //message.error(result.msg);
      }
    },
    // api create
    *api_create({ payload, success }, { call, put, select }) {
      const result = yield call(getData("api_create"), { payload });
      if (result.code === "OK") {
        let list = yield select((state) => state.user.api_list);
        list.unshift(result.data);
        yield put({
          type: "save",
          payload: {
            api_list: list,
          },
        });
        success && success(result.data.securityKey);
      } else {
        message.error(result.msg);
      }
    },
    // api update
    *api_update({ payload, success }, { call, put }) {
      const result = yield call(getData("api_update"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["修改成功"]);
        success && success();
      } else {
        message.error(result.msg);
      }
    },
    // api status
    *api_status({ payload, success, i }, { call, put, select }) {
      const result = yield call(getData("api_status"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["设置成功"]);
        success && success();
        const api_list = yield select((state) => state.user.api_list);
        let data = helper.arrayClone(api_list);
        data[i]["status"] = payload.status;
        yield put({
          type: "save",
          payload: {
            api_list: data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    // api del
    *api_del({ payload, success, i }, { call, put, select }) {
      const result = yield call(getData("api_del"), { payload });
      if (result.code === "OK") {
        //message.info(window.appLocale.messages["删除成功"]);
        success && success();
        const api_list = yield select((state) => state.user.api_list);
        let data = helper.arrayClone(api_list);
        data.splice(i, 1);
        yield put({
          type: "save",
          payload: {
            api_list: data,
          },
        });
      } else {
        message.error(result.msg);
      }
    },
    /**
     * 统一表格获取数据方法
     * @param {Object} payload {page,size,...}
     * @param {String} api  api path
     *
     * param page, 控件的翻页从0开始，接口从1开始，需要处理
     */
    *getTableData({ payload, api }, { call, put, select }) {
      const { page, rowsPerPage, hasmore, tableData } = yield select(
        (state) => state.user
      );
      if (!hasmore) return;
      const result = yield call(getData(api), {
        payload: {
          ...payload,
          page,
          size: rowsPerPage,
        },
      });
      if (result.code === "OK") {
        const data = result.data;
        const { total, size, list, ...props } = data;
        yield put({
          type: "save",
          payload: {
            total: Number(total),
            page: 1 + page,
            tableData: [...tableData].concat(list),
            hasmore: list.length < rowsPerPage ? false : true,
            ...props,
          },
        });
      } else {
        message.error(result.msg);
        yield put({
          type: "save",
          payload: {
            total: 0,
            page: page,
            hasmore: false,
          },
        });
      }
    },
    /**
     * 清除table记录
     */
    *clearTableData({ payload }, { put }) {
      yield put({
        type: "save",
        payload: {
          total: 0,
          page: 1,
          hasmore: true,
          tableData: [],
        },
      });
    },
    *getCardCount({ payload }, { put, call }) {
      const result = yield call(getData("card_count"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            cardCount: result.data,
          },
        });
      }
    },
    /**
     * 获取用户等级信息
     */
    *get_level_info({ payload }, { call, put, select }) {
      const result = yield call(getData("user_level_info"), { payload });
      if (result.code === "OK") {
        // let marks = [];
        // if (result.data.levelConfigs && result.data.levelConfigs.length) {
        //   result.data.levelConfigs.map((item, index) => {
        //     marks.push({
        //       value: index,
        //       label: item.levelName
        //     });
        //   });
        // }
        yield put({
          type: "save",
          payload: {
            user_level_info: result.data.userLevelInfo || {},
            // marks: marks
          },
        });
      }
    },
    /**
     * 获取等级配置信息
     */
    *get_level_configs({ payload }, { call, put }) {
      const result = yield call(getData("user_level_configs"), { payload });
      if (result.code === "OK") {
        yield put({
          type: "save",
          payload: {
            level_configs: result.data.levelConfigs || [],
            have_token_discount: result.data.haveTokenDiscount || {},
          },
        });
      }
    },
    *openBonus({ payload, callback }, { call }) {
      const result = yield call(getData("open_bonus"), { payload });
      callback && callback(result);
    },
    // 杠杆币种查询
    *getMarginTokens({ payload }, { call, put }) {
      const result = yield call(getData("get_margin_tokens"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        const borrowableTokens = [];
        // 可借币种倍数
        result.data.forEach((item) => {
          if (item.canBorrow == true) {
            borrowableTokens.push(item);
          }
        });
        yield put({
          type: "save",
          payload: {
            borrowableTokens,
          },
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
    // 获取杠杆利率
    *getMarginLevelInterest({ payload }, { call, put }) {
      const result = yield call(getData("margin_level_interest"), {
        payload,
        method: "GET",
      });
      if (result.code == "OK" && result.data) {
        yield put({
          type: "save",
          payload: {
            marginLevelInterest: result.data,
          },
        });
      } else {
        result.msg && message.error(result.msg);
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
