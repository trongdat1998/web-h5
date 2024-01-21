// protocols
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Content from "../../components/content";
import Introduce from "../../components/other/protocols";
import SnackHOC from "../snackHoc";

function Protocol({
  layout,
  loading,
  dispatch,
  location,
  match,
  history,
  enqueueSnackbar,
}) {
  return (
    <LayoutRC
      {...layout}
      dispatch={dispatch}
      loading={loading}
      location={location}
      enqueueSnackbar={enqueueSnackbar}
    >
      <Content>
        <Introduce
          {...layout}
          match={match}
          history={history}
          loading={loading}
          dispatch={dispatch}
          location={location}
          enqueueSnackbar={enqueueSnackbar}
        />
      </Content>
    </LayoutRC>
  );
}

function mapStateToProps({ layout, loading }) {
  return { layout, loading };
}

export default SnackHOC(connect(mapStateToProps)(Protocol));
