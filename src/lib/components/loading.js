/*
 *
 * <Loading type=""></Loading>
 *
 *
 */

import React from "react";
import classNames from "classnames";
import s from "../css/loading.less";
import Icon from "./icon";

class Loading extends React.Component {
  constructor() {
    super();
  }
  render() {
    let { loading, loadingBox, laodingMask, ...props } = this.props;
    if (loading) {
      return (
        <div className={classNames(s["g-loadingBox"], loadingBox)} {...props}>
          {this.props.children}
          <div className={classNames(s["g-loadingContent"])}>
            <Icon type="loading-3-quarters" loading />
          </div>
          <div className={classNames(s["g-loadingMask"])} />
        </div>
      );
    } else {
      return (
        <div className={classNames(s["g-loadingBox"], loadingBox)} {...props}>
          {this.props.children}
        </div>
      );
    }
  }
}

export default Loading;
