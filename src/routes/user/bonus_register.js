// bonus register
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Register from "../../components/user/bonus_register";
import Content from "../../components/content";
import SnackHOC from "../snackHoc";

function BonusRegisterPage({
  layout,
  user,
  loading,
  dispatch,
  location,
  history,
  match,
}) {
  return (
    <LayoutRC
      {...layout}
      loading={loading}
      dispatch={dispatch}
      location={location}
    >
      <Content>
        <Register
          {...layout}
          {...user}
          loading={loading}
          dispatch={dispatch}
          location={location}
          history={history}
          match={match}
        />
      </Content>
    </LayoutRC>
  );
}

function mapStateToProps({ layout, user, loading }) {
  return { layout, user, loading };
}

export default SnackHOC(connect(mapStateToProps)(BonusRegisterPage));
