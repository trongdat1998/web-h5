// 资产
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Content from "../../components/content";
import Index from "../../components/finance/index";
import SnackHOC from "../snackHoc";

function IndexPage({
  layout,
  future,
  ws,
  dispatch,
  location,
  enqueueSnackbar
}) {
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      location={location}
      enqueueSnackbar={enqueueSnackbar}
    >
      <Content>
        <Index
          {...layout}
          {...future}
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

function mapStateToProps({ layout, future, ws }) {
  return { layout, future, ws };
}

export default SnackHOC(connect(mapStateToProps)(IndexPage));
