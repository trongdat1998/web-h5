import React from "react";
import classNames from "classnames";
import "../css/iconfont.less";

/*
 *
 *  <Icon size="" color="" type="" className=""></Icon>
 *
 *
 *
 */
function Icon(props) {
  let { className, size, color, type, loading, ...prop } = props;

  let classSet = new Set();
  classSet.add("g-icon");
  if (type) {
    classSet.add("g-icon" + "-" + type);
  }
  size = size || 16;
  if (size) {
    classSet.add("g-icon" + "-" + size);
  }
  if (color) {
    let matchColor = color.replace(/(^|\s+)\w/g, function (s) {
      return s.toUpperCase();
    }); //首字母转换成大写
    classSet.add("icon" + "-" + matchColor);
  }
  if (loading) {
    classSet.add("g-icon-spin");
  }
  if (className) {
    classSet.add(className);
  }
  return (
    <i {...prop} className={classNames(Array.from(classSet))}>
      {props.children}
    </i>
  );
}

export default Icon;
