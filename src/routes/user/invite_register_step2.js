// 邀请注册第二步
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import Register from "../../components/user/invite_register_step2";
import withRoot from "../../withRoot";

function RegisterPage({
  layout,
  user,
  loading,
  dispatch,
  location,
  history,
  match
}) {
  return (
    <Register
        {...layout}
        {...user}
        loading={loading}
        dispatch={dispatch}
        location={location}
        history={history}
        match={match}
      />
  );
}

function mapStateToProps({ layout, user, loading }) {
  return { layout, user, loading };
}

export default withRoot(connect(mapStateToProps)(RegisterPage));
