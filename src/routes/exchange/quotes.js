// 行情页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Content from "../../components/content";
import Quotes from "../../components/exchange/quotes";
import SnackHOC from "../snackHoc";

function Exchange({
  layout,
  loading,
  dispatch,
  location,
  match,
  history,
  ws,
  enqueueSnackbar
}) {
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
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
        <Quotes
          {...layout}
          {...ws}
          loading={loading}
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

function mapStateToProps({ layout, ws, loading }) {
  return { layout, ws, loading };
}

export default SnackHOC(connect(mapStateToProps)(Exchange));
