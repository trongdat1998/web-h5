// 期货答题
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import Guest from "../../components/future/guest";
import withRoot from "../../withRoot";

function OptionGuestPage({
  layout,
  future,
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
      <Guest
        {...layout}
        {...future}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, future, loading }) {
  return { layout, future, loading };
}

export default withRoot(connect(mapStateToProps)(OptionGuestPage));
