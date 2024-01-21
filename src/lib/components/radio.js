import React from "react";
import classNames from "classnames";
import s from "../css/radio.less";

class Radio extends React.Component {
  constructor() {
    super();
    this.state = {
      focus: false
    };
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    if (this.props.disabled) return;
    this.props.onChange && this.props.onChange(this.props.defaultValue, e);
  }
  render() {
    let {
      className,
      value,
      defaultValue,
      id,
      name,
      disabled,
      onChange,
      suffix,
      checked,
      ...props
    } = this.props;

    let classSet = new Set();
    classSet.add(s["g-radio"]);
    if (className) {
      classSet.add(className);
    }
    if (disabled) {
      classSet.add(s["g-radio-disabled"]);
    }
    if (value == defaultValue) {
      classSet.add(s["g-radio-checked"]);
    }
    let radioNode = <div id={id} name={name} className={s.radio} {...props} />;

    let suffixnode = null;
    if (suffix) {
      suffixnode = <div className={s["g-radio-suffix"]}>{suffix}</div>;
    }

    return (
      <div className={classNames(Array.from(classSet))} onClick={this.onClick}>
        {radioNode}
        {suffixnode}
      </div>
    );
  }
}

export default Radio;
