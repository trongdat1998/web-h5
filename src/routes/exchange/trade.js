// 行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Content from "../../components/content";
import TradeRC from "../../components/exchange/trade";
import TokenInfoRC from "../../components/exchange/tokenInfo";
import HandicapRC from "../../components/exchange/handicap";
import DepthRC from "../../components/exchange/depth";
import OrderRC from "../../components/exchange/tradingHistory";
import SnackHOC from "../snackHoc";
import route_map from "../../config/route_map";

function Trade({
  layout,
  loading,
  dispatch,
  location,
  match,
  history,
  ws,
  exchange,
  enqueueSnackbar
}) {
  const token1 = (match.params.token1 || "").toUpperCase();
  const token2 = (match.params.token2 || "").toUpperCase();
  if (!layout.config.symbols_obj.all[token1 + token2]) {
    if (layout.config.symbol[0]) {
      window.location.href =
        route_map.trade +
        "/" +
        layout.config.symbol[0]["baseTokenId"] +
        "/" +
        layout.config.symbol[0]["quoteTokenId"];
    } else {
      window.location.href = route_map.error;
    }
    return;
  }
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
      location={location}
      enqueueSnackbar={enqueueSnackbar}
    >
      <Header
        {...layout}
        dispatch={dispatch}
        location={location}
        enqueueSnackbar={enqueueSnackbar}
      />
      <Content>
        <TokenInfoRC
          {...layout}
          {...exchange}
          {...ws}
          match={match}
          history={history}
          loading={loading}
          dispatch={dispatch}
          location={location}
          enqueueSnackbar={enqueueSnackbar}
        />
        <div
          style={{
            display: "flex",
            background: window.palette.background.default,
            padding: "0 0 20px"
          }}
        >
          <div style={{ flex: 1 }}>
            <TradeRC
              {...layout}
              {...exchange}
              {...ws}
              match={match}
              history={history}
              loading={loading}
              dispatch={dispatch}
              location={location}
              enqueueSnackbar={enqueueSnackbar}
            />
          </div>
          <div style={{ flex: 1 }}>
            <HandicapRC
              {...layout}
              {...exchange}
              {...ws}
              match={match}
              history={history}
              loading={loading}
              dispatch={dispatch}
              location={location}
              enqueueSnackbar={enqueueSnackbar}
            />
          </div>
        </div>
        <div
          style={{
            background: window.palette.grey[50],
            padding: "8px 0 0"
          }}
        >
          <OrderRC
            {...layout}
            {...exchange}
            {...ws}
            match={match}
            history={history}
            loading={loading}
            dispatch={dispatch}
            location={location}
            enqueueSnackbar={enqueueSnackbar}
          />
        </div>
      </Content>
      <Footer
        {...layout}
        dispatch={dispatch}
        location={location}
        enqueueSnackbar={enqueueSnackbar}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, ws, exchange, loading }) {
  return { layout, ws, exchange, loading };
}

export default SnackHOC(connect(mapStateToProps)(Trade));
