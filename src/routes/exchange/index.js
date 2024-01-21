// 行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/content";
import Index from "../../components/exchange/index";
import SnackHOC from "../snackHoc";
import route_map from "../../config/route_map";

function Exchange({
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
        route_map.exchange +
        "/" +
        (layout.config.symbol[0]
          ? layout.config.symbol[0]["baseTokenId"]
          : "BTC") +
        "/" +
        (layout.config.symbol[0]
          ? layout.config.symbol[0]["quoteTokenId"]
          : "USDT");
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
      <Content>
        <Index
          {...layout}
          {...exchange}
          {...ws}
          loading={loading}
          dispatch={dispatch}
          location={location}
          match={match}
          history={history}
          enqueueSnackbar={enqueueSnackbar}
        />
      </Content>
    </LayoutRC>
  );
}

function mapStateToProps({ layout, ws, exchange, loading }) {
  return { layout, ws, exchange, loading };
}

export default SnackHOC(connect(mapStateToProps)(Exchange));
