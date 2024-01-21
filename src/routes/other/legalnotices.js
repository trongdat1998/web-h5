// 首页
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout";
import Index from "../../components/other/legalnotices";

function IndexPage({ layout, dispatch, location }) {
  return (
    <LayoutRC {...layout} dispatch={dispatch} location={location}>
      <Index />
    </LayoutRC>
  );
}

function mapStateToProps({ layout, index }) {
  return { layout, index };
}

export default connect(mapStateToProps)(IndexPage);
