const prefix = "/api";
const prefix2 = "/s_api";

let hostname = window.location.hostname;
let protocol = window.location.protocol === "http:" ? "ws:" : "wss:";
// 行情ws地址
const qws = "/ws/quote/v1";
// 订单ws地址
const ws = "/api/ws/user";

// local
if (/^local/.test(hostname)) {
  protocol = "wss:";
}

let qwsURL = /^local/.test(window.location.hostname)
  ? window.location.origin.replace("http", "ws") + qws
  : `${protocol}//${
      hostname.indexOf("www") > -1
        ? hostname.replace("www", "ws")
        : "ws." + hostname
    }${qws}`;

let wsURL = /^local/.test(window.location.hostname)
  ? window.location.origin.replace("http", "ws") + ws
  : `${protocol}//${
      hostname.indexOf("www") > -1
        ? hostname.replace("www", "ws")
        : "ws." + hostname
    }${ws}`;

export default {
  wechat: `${prefix}/basic/jssdk`,
  qws: qwsURL,
  ws: wsURL,
  // 国家区号前缀
  countries: `${prefix}/basic/countries`,
  // 邮箱注册
  register: `${prefix}/user/email_sign_up`,
  // 手机注册
  register_mobile: `${prefix}/user/mobile_sign_up`,
  // 快捷注册
  quick_register: `${prefix}/user/quick_sign_up`,
  // 快捷登录
  quick_authorize: `${prefix}/user/quick_authorize`,
  // 快捷登录二次验证
  quick_authorize_advance: `${prefix}/user/quick_authorize_advance`,
  // 授权登录第一步
  oauth2_authorize: `${prefix}/oauth2/authorize`,
  // 邮箱登录step1
  login: `${prefix}/user/email_authorize`,
  // 手机登录step1
  login_mobile: `${prefix}/user/mobile_authorize`,
  // 手机或邮箱登录，step1
  login_all: `${prefix}/user/authorize`,
  // 登录step2
  login_step2: `${prefix}/user/authorize_advance`,
  // 登出
  logout: `${prefix}/user/authorize_cancel`,
  // 未登录状态 邮箱验证码 get_verify_code
  send_email_verify_code: `${prefix}/common/send_email_verify_code`,
  // 登录时，二次验证邮箱验证码
  send_email_verify_code_authorize_advance: `${prefix}/user/send_email_verify_code/authorize_advance`,
  // 登录时，二次验证手机验证码
  send_sms_verify_code_authorize_advance: `${prefix}/user/send_sms_verify_code/authorize_advance`,
  // 已登录状态 邮箱验证码 get_verify_code
  send_email2_verify_code: `${prefix}/user/send_email_verify_code`,
  // 未登录状态 手机验证码
  send_sms_verify_code: `${prefix}/common/send_sms_verify_code`,
  // 已登录状态 手机验证码
  send_sms2_verify_code: `${prefix}/user/send_sms_verify_code`,

  // 手机找回密码
  mobile_find_password: `${prefix}/user/mobile_find_pwd_check`,
  // 邮箱找回密码
  email_find_password: `${prefix}/user/email_find_pwd_check`,
  // 重置密码
  reset_password: `${prefix}/user/find_pwd`,
  // 修改密码
  update_pwd: `${prefix}/user/update_pwd`,

  // userinfo
  userinfo: `${prefix}/user/get_base_info`,
  get_account: `${prefix}/account/get`, // 账户资产
  get_asset: `${prefix}/asset/get`, // 币余额查询
  // 获取ga数据,key img
  ga_info: `${prefix}/user/before_bind_ga`,
  // 绑定ga
  bind_ga: `${prefix}/user/bind_ga`,
  // bind mobile
  bind_mobile: `${prefix}/user/bind_mobile`,
  // bind email
  bind_email: `${prefix}/user/bind_email`,
  // 登录日志
  authorize_log: `${prefix}/user/authorize_log`,
  // 选择自选
  favorite_create: `${prefix}/user/favorite/create`,
  // 取消自选
  favorite_cancel: `${prefix}/user/favorite/cancel`,
  // 实名认证
  kyc: `${prefix}/user/verify`,
  // 实名信息
  verify_info: `${prefix}/user/verify_info`,
  // api
  api_list: `${prefix}/user/api_keys`,
  api_create: `${prefix}/user/api_key/create`,
  api_update: `${prefix}/user/api_key/update_ips`,
  api_del: `${prefix}/user/api_key/delete`,
  api_status: `${prefix}/user/api_key/change_status`, // 启用，禁用
  // 用户等级
  user_level_info: `${prefix}/user/get_userlevel_info`,
  // 等级配置信息
  user_level_configs: `${prefix}/user/get_userlevel_configs`,

  // 下单
  createOrder: `${prefix}/order/create`, // 下单
  cancelOrder: `${prefix}/order/cancel`, // 撤单
  order_cancel_all: `${prefix}/order/batch_cancel`, // 全部撤单
  open_orders: `${prefix}/order/open_orders`, // 当前委托
  trade_orders: `${prefix}/order/trade_orders`, // 历史委托，拉取历史数据
  my_trades: `${prefix}/order/my_trades`, // 历史成交 拉取历史数据
  get_ws_token: `${prefix}/user/get_ws_token`, // 获取websocket握手token

  // 基础接口
  config: `${prefix2}/basic/config`, // 币，币对，币选项
  rate: `${prefix2}/basic/rates`, // 汇率
  rate2: `${prefix}/quote/v1/rates`, // 汇率2
  get_all_coins: `${prefix}/basic/tokens`, // 获取所有币种
  symbols: `${prefix}/basic/symbols`, // 所有币对列表
  id_card_type: `${prefix}/basic/id_card_type`, // 证件类型
  upload_image: `${prefix}/user/verify/upload_image`, // 图片上传
  quote_tokens: `${prefix}/basic/quote_tokens`, // 首页，行情页 币栏目
  get_ws_token: `${prefix}/user/get_ws_token`, // 订单ws连接前，握手接口
  analyze: `${prefix2}/analyze`, // 上报数据接口
  index_config: `${prefix2}/basic/index_config`, // 首页配置信息
  download_info: `${prefix2}/basic/download/info`,
  token_info: `${prefix2}/basic/token`, // token信息
  custom_kv: `${prefix2}/basic/custom_kv`, // 获取配置信息（区分语言）
  // 设置用户自定义配置
  set_custom_config: `${prefix}/user/set_settings`,
  get_custom_config: `${prefix}/user/get_settings`,

  // 币券
  card: `${prefix}/mycard/list`, // 我的币券
  card_count: `${prefix}/mycard/count`, // 币券统计数量

  // 充币，提币
  balance_deposit: `${prefix}/asset/deposit/address`, // 充币

  // get_available: `${prefix}/asset/withdrawal/quota_info`, // 提币，获取余额，手续费
  quota_info: `${prefix}/asset/withdrawal/quota_info`, // 提币，获取余额，手续费
  transfer_available: `${prefix}/account/sub_account/transfer/available`, // 可划转资产余额查询
  deposit_order_list: `${prefix}/asset/deposit/order_list`, // 充币记录
  withdrawal_order_list: `${prefix}/asset/withdrawal/order_list`, // 提币历史记录
  other_order_list: `${prefix}/asset/balance_flow`, // 其他资产 历史记录
  get_token_address: `${prefix}/asset/deposit/address`, // 充币获取地址
  get_withraw_address: `${prefix}/asset/withdrawal/address_list`, // 获取提币地址
  add_withraw_address: `${prefix}/asset/withdrawal/address/add`, // 添加地址
  del_withraw_address: `${prefix}/asset/withdrawal/address/delete`, // 删除地址
  withdraw: `${prefix}/asset/withdrawal/create`, // 提币 step1
  withdrawal_verify_code: `${prefix}/asset/withdrawal/verify_code`, // 提币 brefore step2 重新发送验证码
  withdraw_verify: `${prefix}/asset/withdrawal/verify`, // 提币 step2 验证

  // 行情
  kline_history: `${prefix}/quote/v1/klines`, // k线http
  depth: `${prefix}/quote/v1/depth`, // 深度图
  serverTime: `${prefix}/quote/v1/time`, // 服务器时间
  trade: `${prefix}/quote/v1/trades`, // 最新成交
  quote: `${prefix}/quote/v1/broker/tickers`, // broker 24小时行情http

  // 永续合约
  future_record: `${prefix}/contract/asset/balance_flow`, // 永续合约资产记录
  get_futures_asset: `${prefix}/contract/asset/available`, // 永续合约资产列表
  get_target_list: `${prefix}/contract/underlying/list`, // 永续合约标的列表
  futures_delivery_order: `${prefix}/contract/order/delivery_record`, // 交割记录
  futures_fund_order: `${prefix}/contract/asset/insurance_fund`, // 保险基金
  futures_option_list: `${prefix}/contract/order/position`, // 当前持仓
  futures_current_entrust: `${prefix}/contract/order/open_orders`, // 未完成委托
  futures_history_entrust: `${prefix}/contract/order/trade_orders`, // 历史委托
  futures_history_order: `${prefix}/contract/order/my_trades`, // 历史成交
  futures_order_cancel: `${prefix}/contract/order/cancel`, // 撤单
  futures_order_create: `${prefix}/contract/order/create`, // 下单
  futures_match_info: `${prefix}/contract/order/match_info`, // 成交明细
  futures_order_setting: `${prefix}/contract/order/get_order_setting`, // 读取 永续合约下单配置项，费率，风险限额，杠杠
  futures_order_get: `${prefix}/contract/order/get`, // 订单查询
  set_order_setting: `${prefix}/contract/order/set_order_setting`, // 设置永续合约下单选项
  set_risk_limit: `${prefix}/contract/order/set_risk_limit`, // 设置风险限额
  futures_tradeable: `${prefix}/contract/asset/tradeable`, // 可交易信息，资产余额，可平
  modify_margin: `${prefix}/contract/asset/modify_margin`, // 增加/减少保证金
  funding_rates: `${prefix}/contract/funding_rates`, // 资金费率
  open_future: `${prefix}/user/open/futures`, // 打开期货
  stop_profit_loss_get: `${prefix}/contract/order/position/stop_profit_loss/get`, // 查询止盈止损
  stop_profit_loss_cancel: `${prefix}/contract/order/position/stop_profit_loss/cancel`, // 取消止盈止损
  stop_profit_loss_set: `${prefix}/contract/order/position/stop_profit_loss/set`, // 设置止盈止损
  indices: `${prefix}/quote/v1/indices`, // 指数
  account_type: `${prefix}/basic/sub_account/support_account_type`, // 子账户类型
  account_list: `${prefix}/account/sub_account/query`, // 账户列表,
  account_limit: `${prefix}/v1/account/sub_account/transfer/limit`, // 禁止划转设置
  asset_transfer: `${prefix}/account/sub_account/transfer`, // 资产划转
  coin_tokens: `${prefix}/basic/coin_tokens`, // 永续合约支持的币列表
  calculator_profit_info: `${prefix}/contract/calculator/profit_info`, // 合约计算器 收益率
  calculator_liquidation_price: `${prefix}/contract/calculator/liquidation_price`, // // 合约计算器 强平价
  stop_profit_loss_open_orders: `${prefix}/contract/order/stop_profit_loss/open_orders`, // 当前委托 止盈止损 单
  stop_profit_loss_trade_orders: `${prefix}/contract/order/stop_profit_loss/trade_orders`, // 历史委托 止盈止损 单

  // 支付
  get_payment_data: `${prefix}/payment/order/load_pay_data`, // 获取支付信息
  send_payment_verify_code: `${prefix}/payment/order/send_payment_verify_code`, //获取支付验证码
  payment_order: `${prefix}/payment/order/pay`, // 支付
  get_total_asset: `${prefix}/asset/info`, // 获取总资产
  payment_order_v2: `${prefix}/payment/order/quick_pay`, // 支付

  // 红包
  open_bonus: `${prefix}/red_packet/open`, // 打开红包

  // 杠杆
  get_margin_tokens: `${prefix}/v1/margin/get/token_config`, // 获取保证金币种
  margin_level_interest: `${prefix}/v1/margin/get/interest_level_table`, // 获取杠杆利率

  regist_geetest: `${prefix}/v1/basic/geev3/register`,
};
