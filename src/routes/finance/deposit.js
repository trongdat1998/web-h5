// 资产
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Content from "../../components/content";
import Index from "../../components/finance/deposit";
import SnackHOC from "../snackHoc";

function IndexPage({ layout, finance, ws, dispatch, location, match, enqueueSnackbar }) {
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
          {...finance}
          {...ws}
          dispatch={dispatch}
          location={location}
          match={match}
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

function mapStateToProps({ layout, finance, ws }) {
  return { layout, finance, ws };
}

export default SnackHOC(connect(mapStateToProps)(IndexPage));
