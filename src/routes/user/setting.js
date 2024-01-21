// 设置
import React from "react";
import { connect } from "dva";
import LayoutRC from "../../components/layout_new";
import Footer from "../../components/footer";
import Content from "../../components/content";
import Index from "../../components/user/setting";
import SnackHOC from "../snackHoc";

function IndexPage({ layout, dispatch, location, enqueueSnackbar }) {
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

function mapStateToProps({ layout }) {
  return { layout };
}

export default SnackHOC(connect(mapStateToProps)(IndexPage));
