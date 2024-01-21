import React from "react";
import { connect } from "dva";
import { Link, Redirect } from "dva/router";
import LayoutRC from "../components/layout";
import route_map from "../config/route_map";

function IndexPage({ layout, dispatch, location }) {
  // app
  // if (/bhe.?App/i.test(window.navigator.userAgent)) {
  //   return <Redirect to={route_map.guild} />;
  // }
  return <Redirect to={route_map.index} />;
}

function mapStateToProps({ layout }) {
  return { layout };
}

export default connect(mapStateToProps)(IndexPage);
