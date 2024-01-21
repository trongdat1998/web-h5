import React from "react";
import classNames from "classnames";
import s from "../css/input.less";
import reactComposition from "react-composition";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      tempInput: this.props.value || ""
    };
    this.isOnComposition = false;
    this.emittedInput = true;

    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.handleComposition = this.handleComposition.bind(this);
  }
  componentDidMount() {}
  handleInputChange = event => {
    let userInputValue = event.target.value;
    if (!this.isOnComposition) {
      this.setState({
        tempInput: userInputValue
      });
      event.target.value = userInputValue;
      this.props.onInputChange(event);
      this.emittedInput = true;
    } else {
      this.setState({
        tempInput: userInputValue
      });
      this.emittedInput = false;
    }
  };
  handleComposition = event => {
    if (event.type === "compositionstart") {
      this.isOnComposition = true;
      this.emittedInput = false;
    } else if (event.type === "compositionend") {
      this.isOnComposition = false;
      // fixed for Chrome v53+ and detect all Chrome
      // https://chromium.googlesource.com/chromium/src/+/afce9d93e76f2ff81baaa088a4ea25f67d1a76b3%5E%21/
      // also fixed for the native Apple keyboard which emit input event before composition event
      // subscribe this issue: https://github.com/facebook/react/issues/8683
      if (!this.emittedInput) {
        this.handleInputChange(event);
      }
    }
  };

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
      onChange,
      onInputChange,
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
        value={this.state.tempInput}
        defaultValue={defaultValue}
        disabled={disabled ? "disabled" : false}
        type={type}
        onFocus={this.onFocus}
        ref={ref => (this.inputRef = ref)}
        onCompositionStart={this.handleComposition}
        onCompositionEnd={this.handleComposition}
        onChange={this.handleInputChange}
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
          onCompositionStart={this.handleComposition}
          onCompositionUpdate={this.handleComposition}
          onCompositionEnd={this.handleComposition}
          onChange={this.handleChange}
          {...props}
        >
          {value ? this.state.value : defaultValue}
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
          onChange={onChange}
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
