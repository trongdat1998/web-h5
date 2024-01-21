// 首页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Content from "../../components/content";
import Index from "../../components/index/index";
import SnackHOC from "../snackHoc";

function IndexPage({ layout, ws, dispatch, location, enqueueSnackbar }) {
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      location={location}
      enqueueSnackbar={enqueueSnackbar}
    >
      <Header
        {...layout}
        dispatch={dispatch}
        location={location}
        enqueueSnackbar={enqueueSnackbar}
      />
      <Content>
        <Index
          {...layout}
          {...ws}
          dispatch={dispatch}
          location={location}
          enqueueSnackbar={enqueueSnackbar}
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

function mapStateToProps({ layout, ws }) {
  return { layout, ws };
}

export default SnackHOC(connect(mapStateToProps)(IndexPage));
