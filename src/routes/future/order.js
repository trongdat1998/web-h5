// 行情订单页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/content";
import Order from "../../components/future/order";
import SnackHOC from "../snackHoc";

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
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
      location={location}
      enqueueSnackbar={enqueueSnackbar}
    >
      <Content>
        <Order
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
