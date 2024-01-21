import React from "react";
import classNames from "classnames";
import s from "../css/input.less";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: props.value
    };
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);

    // this.onComposition = false;
    // this.handleComposition = this.handleComposition.bind(this);
    // this.handleChange = this.handleChange.bind(this);

    // this.propsHandleChange = props.onChange;
  }
  componentDidMount() {}
  // handleComposition(e) {
  //   if (e.type === "compositionend") {
  //     this.onComposition = false;
  //   } else {
  //     this.onComposition = true;
  //   }
  // }

  // handleChange(value) {
  //   this.setState(
  //     {
  //       value: value
  //     },
  //     () => {
  //       if (this.onComposition) return;
  //       this.propsHandleChange(value);
  //     }
  //   );
  // }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.value !== this.props.value) {
  //     this.setState({ value: nextProps.value });
  //   }
  // }
  onBlur(e) {
    this.setState({
      focus: false
    });
    this.props.onBlur && this.props.onBlur(e);
  }
  onFocus(e) {
    this.setState({
      focus: true
    });
    this.props.onFocus && this.props.onFocus(e);
  }
  render() {
    let {
      className,
      value,
      defaultValue,
      placeholder,
      id,
      name,
      disabled,
      type,
      suffix,
      prefix,
      onFocus,
      onBlur,
      checked,
      status,
      ...props
    } = this.props;

    let classSet = new Set();
    classSet.add(s["g-input"]);
    if (className) {
      classSet.add(className);
    }
    if (status) {
      classSet.add(s["g-input-" + status]);
    }
    let inputNode = (
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled ? "disabled" : false}
        type={type}
        onFocus={this.onFocus}
        ref={ref => (this.inputRef = ref)}
        // onCompositionStart={this.handleComposition}
        // onCompositionUpdate={this.handleComposition}
        // onCompositionEnd={this.handleComposition}
        onBlur={this.onBlur}
        {...props}
      />
    );
    if (type === "textarea") {
      inputNode = (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled ? "disabled" : false}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          ref={ref => (this.inputRef = ref)}
          // onCompositionStart={this.handleComposition}
          // onCompositionUpdate={this.handleComposition}
          // onCompositionEnd={this.handleComposition}
          {...props}
        >
          {value ? value : defaultValue}
        </textarea>
      );
    }
    if (type == "checkbox") {
      classSet.add(s["g-checkbox"]);
      if (!!checked) {
        classSet.add(s["g-input-checked"]);
      } else {
        classSet.delete(s["g-input-checked"]);
      }
      inputNode = (
        <input
          type="checkbox"
          id={id}
          name={name}
          disabled={disabled ? disabled : false}
          checked={value ? "checked" : false}
          {...props}
        />
      );
    }

    let suffixnode = null;
    if (suffix) {
      suffixnode = <div className={s["g-input-suffix"]}>{suffix}</div>;
    }
    let prefixnode = null;
    if (prefix) {
      prefixnode = <div className={s["g-input-prefix"]}>{prefix}</div>;
      classSet.add(s["g-input-hasPrefix"]);
    }
    if (this.state.focus) {
      classSet.add(s["g-input-focus"]);
    }

    return (
      <div className={classNames(Array.from(classSet))}>
        {prefixnode}
        {inputNode}
        {suffixnode}
      </div>
    );
  }
}

class InputGroup extends React.Component {
  render() {
    let { className, ...props } = this.props;

    let classSet = new Set();
    classSet.add(s["g-input-group"]);
    if (className) {
      classSet.add(className);
    }
    return (
      <div {...props} className={classNames(Array.from(classSet))}>
        {this.props.children}
      </div>
    );
  }
}

Input.Group = InputGroup;

export default Input;
