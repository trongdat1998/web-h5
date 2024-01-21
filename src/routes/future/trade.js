// 合约交易页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Content from "../../components/content";
import SnackHOC from "../snackHoc";
import route_map from "../../config/route_map";
import TradeRC from "../../components/future/trade";

function Trade({
  layout,
  loading,
  dispatch,
  location,
  match,
  history,
  future,
  ws,
  enqueueSnackbar
}) {
  const symbol_id = (match.params.symbol_id || "").toUpperCase();
  if (!layout.config.symbols_obj.all[symbol_id]) {
    if (layout.config.futuresSymbol[0]) {
      window.location.href =
        route_map.future_trade +
        "/" +
        layout.config.futuresSymbol[0]["symbolId"];
    } else {
      window.location.href = "/m/error.html";
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
        <TradeRC
          {...layout}
          {...future}
          {...ws}
          loading={loading}
          dispatch={dispatch}
          location={location}
          history={history}
          match={match}
          enqueueSnackbar={enqueueSnackbar}
        />
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

function mapStateToProps({ layout, ws, future, loading }) {
  return { layout, ws, future, loading };
}

export default SnackHOC(connect(mapStateToProps)(Trade));
