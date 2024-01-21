// 用户中心
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import UserCenter from "../../components/user/index";

function UserCenterPage({
  layout,
  user,
  loading,
  dispatch,
  location,
  history
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <UserCenter
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

export default connect(mapStateToProps)(UserCenterPage);
