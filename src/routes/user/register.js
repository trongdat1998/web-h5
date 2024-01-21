// 注册
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Register from "../../components/user/register";
import Footer from "../../components/footer";
import Content from "../../components/content";
import SnackHOC from "../snackHoc";

function RegisterPage({
  layout,
  user,
  loading,
  dispatch,
  location,
  history,
  match,
  enqueueSnackbar
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
      <Footer
        {...layout}
        dispatch={dispatch}
        location={location}
        enqueueSnackbar={enqueueSnackbar}
      />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, user, loading }) {
  return { layout, user, loading };
}

export default SnackHOC(connect(mapStateToProps)(RegisterPage));
