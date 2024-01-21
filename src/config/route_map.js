const local = "/m"; // :lang or '' 多语言是否配置在路径中

export default {
  // 未登录，允许访问的地址
  noLogin: [
    "index2",
    "index",
    "quotes",
    "exchange",
    "trade",
    "register",
    "login",
    "protocols",
    "agreement",
    "legalnotices",
    "usercontract",
    "cardAgreement",
    "download",
    "download2",
    "invite_register_step1",
    "invite_register_step2",
    "register_step1",
    "register_step2",
    "bonus_register",
    "oauth",
    "oauth_register",
    "future_trade",
    "future_quotes",
    "user_setting",
    "grade",
    "defi",
  ],

  // download
  download: `${local}/other/download`,
  download2: `/download.html`,
  // 协议
  protocols: `${local}/protocols`,
  // 用户协议
  agreement: `${local}/other/agreement`,
  // 法律协议
  legalnotices: `${local}/other/legalnotices`,
  // 隐私协议
  usercontract: `${local}/other/usercontract`,
  // 点卡协议
  cardAgreement: `${local}/other/cardAgreement`,

  // 首页
  index: `${local}/`,
  index2: `${local}`,
  // realtimes列表页
  quotes: `${local}/quotes`,
  // 行情页
  exchange: `${local}/exchange`,
  // defi专区
  defi: `${local}/defi`,
  // 资产
  finance: `${local}/finance`,
  // 充币
  deposit: `${local}/finance/deposit`,
  // 交易页
  trade: `${local}/trade`,
  // 币币订单
  order: `${local}/order/coin`,
  // 注册
  register: `${local}/register`,
  // 邀请注册第一步
  invite_register_step1: `${local}/invite/register/step1`,
  // 邀请注册第二步
  invite_register_step2: `${local}/invite/register/step2`,
  // 登录
  login: `${local}/login`,
  // oauth授权登录
  oauth: `${local}/oauth`,
  // oauth register
  oauth_register: `${local}/oauth_reg`,
  // bonus register
  bonus_register: `${local}/bonus_register`,

  // 我的币券
  user_card: `${local}/user/card`,
  // 设置页
  user_setting: `${local}/user/setting`,
  // 等级管理
  grade: `${local}/user/grade`,

  // 合约答题
  future_guest: `${local}/contract/guest`,
  // 合约交易页
  future_trade: `${local}/contract/trade`,
  // 合约行情页
  future_quotes: `${local}/contract/quote`,
  // 合约订单页
  future_order: `${local}/contract/order`,

  // 第三方支付
  payment: `${local}/payment`,
};
