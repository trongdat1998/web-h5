import Data from "./en-us.message";

const obj = {
  "document.title": "BHPC - 新一代虚拟数字货币资产交易平台",
  "document.description":
    "是新一代虚拟数字货币资产交易平台，为用户提供虚拟货币交易服务， BHPC具备百万级交易并发的高性能，采用超级节点与全球化托管和清算的底层区块链模型，用户资产完全通过Bluehelix去中心化区块链技术实现托管和清算，提供个人、机构的加密数字货币资产透明化服务。",

  LIMIT: "限价",
  MARKET: "市价",
  SELL: "卖出",
  BUY: "买入",

  // 新增key
  "24H涨幅榜": "24H涨幅榜",
  "24H涨跌幅": "24H涨跌幅",
  "24H成交量": "24H成交量",
  币币: "币币",
  行情: "行情",
  合约: "合约",
  限价: "限价",
  市价: "市价",
  以当前最优价格交易: "以当前最优价格交易",
  金额: "金额",
  位整数: "位整数",
  全部撤单: "全部撤单",
  查看全部订单: "查看全部订单",
  成交数量: "成交数量",
  撤单成功: "撤单成功",
  已成功提交全部撤单申请: "已成功提交全部撤单申请",
  无更多数据: "无更多数据",
  全部: "全部",
  重置: "重置",
  筛选: "筛选",
  "1分": "1分",
  "15分": "15分",
  "1时": "1时",
  "4时": "4时",
  "12时": "12时",
  日线: "日线",
  周线: "周线",
  月线: "月线",
  高: "高",
  低: "低",
  "24H": "24h",
  官网: "官网",
  区块查询: "区块查询",
  白皮书: "白皮书",
  发行总量: "发行总量",
  流通总量: "流通总量",
  发行时间: "发行时间",
  深度: "深度",
  成交: "成交",
  简介: "简介",
  我的: "我的",

  // 订单状态
  NEW: "创建成功",
  PARTIALLY_FILLED: "部分成交",
  FILLED: "完全成交",
  CANCELED: "已撤销",

  // 充币记录状态
  DEPOSIT_BALANCE_ADDED: "充币成功",
  DEPOSIT_CAN_WITHDRAW: "可以提现",
  // 提币记录状态
  BROKER_AUDITING_STATUS: "审核中",
  BROKER_REJECT_STATUS: "申请拒绝",
  AUDITING_STATUS: "申请处理中",
  AUDIT_REJECT_STATUS: "申请拒绝",
  PROCESSING_STATUS: "申请处理中",
  WITHDRAWAL_SUCCESS_STATUS: "提币成功",
  WITHDRAWAL_FAILURE_STATUS: "提币失败",

  order_notice: "您有{n}条订单成交，请至历史成交查看",

  wx_download_tip1: "1.点击右上角按按钮",
  wx_download_tip2: "2. 选择在浏览器中打开",
  wx_download_tip3: "3.浏览器打开后选择下载 ",

  "deposit.desc.1":
    "请勿向上述地址充值除{name}之外的资产，否则任何非{name}以外资产将不可找回",
  "deposit.desc.2": "系统阶段性会更新充币地址，请核对后使用，否则任何责任自负",
  "deposit.desc.3": "最小充币金额:{name},小于最小金额的充币金额不会记录",

  // api
  "api.desc.1":
    "您可以通过API使用行情查询、实时交易等服务，请参阅API文档查看使用",
  "api.desc.2": "实名认证成功后可以创建API Key",
  "api.desc.3": "每个账户仅可创建1组API Key",
  "api.desc.4": "为了您的账户安全考虑，每个API Key最多绑定5个IP",

  "国家/地区": "国家/地区",
};
Object.keys(Data).map((item) => {
  if (!obj[item]) {
    obj[item] = item;
  }
});

export default obj;
