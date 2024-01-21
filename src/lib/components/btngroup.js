import React from "react";
import classNames from "classnames";
import s from "../css/button.less";

/*
 *
 *  <Btngroup type=""></Btngroup>
 *
 *
 *
 */
function Btngroup(props) {
  let { className, type, ...prop } = props;

  let classSet = new Set();
  classSet.add(s["g-btn-group"]);
  if (type) {
    classSet.add(s["btn-group" + "-" + type]);
  }
  if (className) {
    classSet.add(className);
  }
  return (
    <div {...prop} className={classNames(Array.from(classSet))}>
      {props.children}
    </div>
  );
}

export default Btngroup;
