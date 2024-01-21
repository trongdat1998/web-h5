// download
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import Index from "../../components/other/download";
import withRoot from "../../withRoot";

function IndexPage({ layout,user, dispatch, location }) {
  return <Index {...layout} {...user} dispatch={dispatch}  /> ;
}

function mapStateToProps({ layout, user }) {
  return { layout, user };
}

export default withRoot(connect(mapStateToProps)(IndexPage));
