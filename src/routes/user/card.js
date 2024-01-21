// 币券
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import Card from "../../components/user/card";
import withRoot from "../../withRoot";

function CardPage({ layout, user, loading, dispatch, location, history }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <Card
        {...layout}
        {...user}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, user, loading }) {
  return { layout, user, loading };
}

export default withRoot(connect(mapStateToProps)(CardPage));
