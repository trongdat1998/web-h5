// 行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/content";
import OrderRC from "../../components/exchange/order";
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
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
      location={location}
      enqueueSnackbar={enqueueSnackbar}
    >
      <Content>
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
      </Content>
    </LayoutRC>
  );
}

function mapStateToProps({ layout, ws, exchange, loading }) {
  return { layout, ws, exchange, loading };
}

export default SnackHOC(connect(mapStateToProps)(Trade));
