// 行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/content";
import Index from "../../components/future/quote";
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
  future,
  enqueueSnackbar
}) {
  const symbolId = (match.params.symbol_id || "").toUpperCase();
  if (!layout.config.symbols_obj.all[symbolId]) {
    if (layout.config.futuresSymbol[0]) {
      window.location.href =
        route_map.future_quotes +
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
      <Content>
        <Index
          {...layout}
          {...future}
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

function mapStateToProps({ layout, ws, future, loading }) {
  return { layout, ws, future, loading };
}

export default SnackHOC(connect(mapStateToProps)(Exchange));
