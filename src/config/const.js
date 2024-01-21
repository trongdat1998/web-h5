export default {
  CNY: "￥",
  UST: "$",
  // 深度精度值，"0"跟K线价格精度0区别
  depth: {
    100000000: -8,
    10000000: -7,
    1000000: -6,
    100000: -5,
    10000: -4,
    1000: -3,
    100: -2,
    10: -1,
    1: 0,
    0: 0,
    0.1: 1,
    0.01: 2,
    0.001: 3,
    0.0001: 4,
    0.00001: 5,
    0.000001: 6,
    "0.0000001": 7,
    "0.00000001": 8,
    "0.000000001": 9,
    "0.0000000001": 10,
    "0.00000000001": 11,
    "0.000000000001": 12,
  },
  // k线价格精度
  k: {
    0: 1,
    1: 10,
    2: 100,
    3: 1000,
    4: 10000,
    5: 100000,
    6: 1000000,
    7: 10000000,
    8: 100000000,
    9: 1000000000,
    10: 10000000000,
    11: 100000000000,
    12: 1000000000000,
  },
  // 永续合约买卖方向
  sideMap: {
    BUY_OPEN: "买入开多",
    SELL_OPEN: "卖出开空",
    BUY_CLOSE: "买入平空",
    SELL_CLOSE: "卖出平多",
  },
  // 永续合约杠杆小数位
  lever_decimal: 2,
  fee: 0.005,
  // 保证金率保留8位小数
  initialMargin: 8,
  // 最新成交展示条数
  trade_limit: 20,
  // 工会列表每页条数
  rowsPerPage: 10,
  rowsPerPage1: 20,
  rowsPerPageOptions: [5, 10, 20],
  // img host
  imghost: "https://static.nucleex.com",
  REGISTER_OPTIONS: {
    ALL: 1,
    ONLY_PHONE: 2,
    ONLY_EMAIL: 3,
    EMAIL_AND_CHINA_PHONE: 4,
  },
  // 个性化配置默认值
  customConfig: {
    // 闪电平仓
    quickCloseConfirm: true,
    // 默认语言
    lang: window.localStorage.lang,
    // 默认法币
    unit: window.localStorage.unit,
    // 行情颜色方案,  0 = 绿涨红跌; 1 = 红涨绿跌
    up_down: 0,
  },

  CAPTCHA_TYPES: {
    GOOGLE: 1,
    SENSE: 2,
  },
  CAPTCHA_TYPE: 1, // TODO
  SENSE_ID: "", // 极验的id todo 修改
  SITE_KEY: "6LeFMEkdAAAAANgIprPUu5i4ZqTMHi2kfX252YBn", // google_captchaId todo 修改
  DEFAULT_NATIONAL_CODE: 65,
};
