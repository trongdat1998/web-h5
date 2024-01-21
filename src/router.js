import React from "react";
import { Router, Route, Switch, Redirect } from "dva/router";
import dynamic from "dva/dynamic";
import route_map from "./config/route_map";

function RouterConfig({ history, app }) {
  // 404
  const NotFountRC = dynamic({
    app,
    component: () => import("./routes/404"),
  });
  const ProtocolsRC = dynamic({
    app,
    component: () => import("./routes/other/protocols"),
  });
  // agreement
  const AgreementRC = dynamic({
    app,
    component: () => import("./routes/other/agreement"),
  });
  // card agreement
  const CardAgreementRC = dynamic({
    app,
    component: () => import("./routes/other/cardAgreement"),
  });
  // Legalnotices
  const LegalnoticesRC = dynamic({
    app,
    component: () => import("./routes/other/legalnotices"),
  });
  // agreement
  const UsercontractRC = dynamic({
    app,
    component: () => import("./routes/other/usercontract"),
  });

  // 首页
  const IndexRC = dynamic({
    app,
    models: () => [import("./models/ws")],
    component: () => import("./routes/index/index"),
  });
  // realtimes 列表页
  const QuotesRC = dynamic({
    app,
    models: () => [import("./models/ws")],
    component: () => import("./routes/exchange/quotes"),
  });
  // 币对行情页
  const ExchangeRC = dynamic({
    app,
    models: () => [import("./models/ws"), import("./models/exchange")],
    component: () => import("./routes/exchange/index"),
  });
  // DeFi 专区
  const DeFiRC = dynamic({
    app,
    models: () => [import("./models/ws")],
    component: () => import("./routes/exchange/defi"),
  });
  // 交易
  const TradeRC = dynamic({
    app,
    models: () => [import("./models/exchange"), import("./models/ws")],
    component: () => import("./routes/exchange/trade"),
  });
  // 交易
  const ExchangeOrderRC = dynamic({
    app,
    models: () => [import("./models/exchange"), import("./models/ws")],
    component: () => import("./routes/exchange/order"),
  });
  // 设置页
  const UserSettingRC = dynamic({
    app,
    models: () => [],
    component: () => import("./routes/user/setting"),
  });

  // login 登录
  const LoginRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/login"),
  });
  // oauth 登录
  const OauthRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/oauth"),
  });
  // oauth 注册
  const OauthRegRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/oauth_register"),
  });
  // register 注册
  const RegisterRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/register"),
  });
  // 邀请注册第一步
  const InviteRegisterStep1 = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/invite_register_step1"),
  });
  // 邀请注册第二步
  const InviteRegisterStep2 = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/invite_register_step2"),
  });

  // bonus register
  const BonusRegisterRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/bonus_register"),
  });

  // 我的币券
  const CardRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/card"),
  });
  // 用户等级
  const GradeRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/user/grade"),
  });

  // 资产
  const FinanceRC = dynamic({
    app,
    models: () => [
      import("./models/finance"),
      import("./models/future"),
      import("./models/ws"),
    ],
    component: () => import("./routes/finance/index"),
  });
  // 充币
  const DepositRC = dynamic({
    app,
    models: () => [import("./models/finance")],
    component: () => import("./routes/finance/deposit"),
  });

  // download
  const DownloadRC = dynamic({
    app,
    models: () => [import("./models/user")],
    component: () => import("./routes/other/download"),
  });

  // 合约新手引导
  const FutureGuestRC = dynamic({
    app,
    models: () => [import("./models/future")],
    component: () => import("./routes/future/guest"),
  });
  // 合约交易页
  const FutureTradeRC = dynamic({
    app,
    models: () => [import("./models/future"), import("./models/ws")],
    component: () => import("./routes/future/trade"),
  });
  // 合约行情页
  const FutureQuoteRC = dynamic({
    app,
    models: () => [import("./models/future"), import("./models/ws")],
    component: () => import("./routes/future/quote"),
  });
  // 合约订单页
  const FutureOrderRC = dynamic({
    app,
    models: () => [import("./models/future"), import("./models/ws")],
    component: () => import("./routes/future/order"),
  });
  // 第三方支付
  const paymentRC = dynamic({
    app,
    models: () => [import("./models/payment")],
    component: () => import("./routes/payment/index"),
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path={route_map.defi} component={DeFiRC} />

        {/* 合约新手引导 */}
        <Route exact path={route_map.future_guest} component={FutureGuestRC} />
        {/* 合约订单页 */}
        <Route exact path={route_map.future_order} component={FutureOrderRC} />
        {/* 合约交易页 */}
        <Route
          exact
          path={route_map.future_trade + "/:symbol_id"}
          component={FutureTradeRC}
        />
        <Redirect
          exact
          path={route_map.future_trade}
          to={
            route_map.future_trade +
            `/${
              window.WEB_CONFIG.futuresSymbol &&
              window.WEB_CONFIG.futuresSymbol[0]
                ? window.WEB_CONFIG.futuresSymbol[0]["symbolId"]
                : ""
            }`
          }
        />
        {/* 合约行情页 */}
        <Route
          exact
          path={route_map.future_quotes + "/:symbol_id"}
          component={FutureQuoteRC}
        />
        <Redirect
          exact
          path={route_map.future_quotes}
          to={
            route_map.future_quotes +
            `/${
              window.WEB_CONFIG.futuresSymbol &&
              window.WEB_CONFIG.futuresSymbol[0]
                ? window.WEB_CONFIG.futuresSymbol[0]["symbolId"]
                : ""
            }`
          }
        />
        {/* download */}
        <Route exact path={route_map.download} component={DownloadRC} />
        {/* 登录 */}
        <Route exact path={route_map.login} component={LoginRC} />
        {/* 授权登录 */}
        <Route exact path={route_map.oauth} component={OauthRC} />
        {/* 授权注册 */}
        <Route exact path={route_map.oauth_register} component={OauthRegRC} />
        {/* 注册 */}
        {/* 带邀请码的注册 */}
        <Route
          exact
          path={route_map.register + "/:invite_code"}
          component={RegisterRC}
        />
        <Route exact path={route_map.register} component={RegisterRC} />
        {/* 邀请注册第一步 */}
        <Route
          exact
          path={route_map.invite_register_step1}
          component={InviteRegisterStep1}
        />
        {/* 邀请注册第二步 */}
        <Route
          exact
          path={route_map.invite_register_step2}
          component={InviteRegisterStep2}
        />
        <Route
          exact
          path={route_map.bonus_register}
          component={BonusRegisterRC}
        />
        {/* 我的币券 */}
        <Route exact path={route_map.user_card} component={CardRC} />
        {/* 资产 */}
        <Route exact path={route_map.finance} component={FinanceRC} />
        {/* 充币 */}
        <Route
          exact
          path={route_map.deposit + "/:token"}
          component={DepositRC}
        />
        <Redirect
          path={route_map.deposit}
          to={route_map.deposit + "/BTC"}
          component={DepositRC}
        />
        {/* 首页 */}
        <Route exact path={route_map.index} component={IndexRC} />
        <Route exact path={route_map.index2} component={IndexRC} />
        {/* realtimes列表页 */}
        <Route exact path={route_map.quotes} component={QuotesRC} />
        {/* 行情页 */}
        <Route
          exact
          path={route_map.exchange + "/:token1/:token2"}
          component={ExchangeRC}
        />
        <Redirect
          exact
          path={route_map.exchange}
          to={
            route_map.exchange +
            `/${
              window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol[0]
                ? window.WEB_CONFIG.symbol[0]["baseTokenId"]
                : ""
            }/${
              window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol[0]
                ? window.WEB_CONFIG.symbol[0]["quoteTokenId"]
                : ""
            }`
          }
        />
        {/* 交易页 */}
        <Route
          exact
          path={route_map.trade + "/:token1/:token2"}
          component={TradeRC}
        />
        <Redirect
          exact
          path={route_map.trade}
          to={
            route_map.trade +
            `/${
              window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol[0]
                ? window.WEB_CONFIG.symbol[0]["baseTokenId"]
                : ""
            }/${
              window.WEB_CONFIG.symbol && window.WEB_CONFIG.symbol[0]
                ? window.WEB_CONFIG.symbol[0]["quoteTokenId"]
                : ""
            }`
          }
        />
        {/* user 设置页 */}
        <Route exact path={route_map.user_setting} component={UserSettingRC} />
        {/* 用户等级 */}
        <Route exact path={route_map.grade} component={GradeRC} />
        {/* 币币订单页 */}
        <Route exact path={route_map.order} component={ExchangeOrderRC} />
        {/* 协议 */}
        <Route
          exact
          path={route_map.protocols + "/:protocolType"}
          component={ProtocolsRC}
        />
        {/* 用户协议 */}
        <Route exact path={route_map.agreement} component={AgreementRC} />
        {/* 法律协议 */}
        <Route exact path={route_map.legalnotices} component={LegalnoticesRC} />
        {/* 隐私协议 */}
        <Route exact path={route_map.usercontract} component={UsercontractRC} />
        {/* 第三方支付 */}
        <Route exact path={route_map.payment} component={paymentRC} />
        <Route component={NotFountRC} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
