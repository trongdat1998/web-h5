// 首页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import PointCard from "../../components/payment/index";
import withRoot from "../../withRoot";

function PaymentPage({
  layout,
  payment,
  loading,
  dispatch,
  location,
  history,
  match
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <PointCard
        {...layout}
        {...payment}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, payment, loading }) {
  return { layout, payment, loading };
}

export default withRoot(connect(mapStateToProps)(PaymentPage));
