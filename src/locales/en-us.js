import appLocaleData from "react-intl/locale-data/en";
// 引入组件的多语言

// 首页多语言
// import index1026 from "../components/index/index_1026_en-us";

window.appLocale = {
  // 合并所有 messages, 加入组件的 messages
  messages: Object.assign({}, window.WEB_LOCALES_ALL || {}),
  // locale
  locale: "en-us",

  // react-intl locale-data
  data: appLocaleData,

  // 自定义 formates
  formats: {
    date: {
      normal: {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }
    },
    // 货币
    money: {
      currency: "USD"
    }
  }
};

export default window.appLocale;
