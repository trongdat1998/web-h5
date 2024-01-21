import React from "react";
import classNames from "classnames";
import s from "../css/switch.less";

/**
 *  <Switch align="" wrap="" className=""></Switch>
 */

class Switch extends React.Component {
  constructor() {
    super();
  }
  render() {
    let { className, checked, disabled, name, onChange, ...props } = this.props;

    let classSet = new Set();
    classSet.add(s["g-switch"]);
    if (className) {
      classSet.add(className);
    }
    if (checked) {
      classSet.add(s["g-switch-checked"]);
    }
    return (
      <span
        {...props}
        onClick={onChange}
        className={classNames(Array.from(classSet))}
      >
        <span />
      </span>
    );
  }
}

export default Switch;
