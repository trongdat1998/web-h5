import React, { Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import s from "../css/dropdown.less";

const DEFAULT_PLACEHOLDER_STRING = "Select...";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.value || {
        label: props.placeholder || DEFAULT_PLACEHOLDER_STRING,
        value: ""
      },
      isOpen: false
    };
    this.mounted = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.fireChangeEvent = this.fireChangeEvent.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({ selected: newProps.value });
    } else if (!newProps.value) {
      this.setState({
        selected: {
          label: newProps.placeholder || DEFAULT_PLACEHOLDER_STRING,
          value: ""
        }
      });
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick, false);
    document.addEventListener("touchend", this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener("click", this.handleDocumentClick, false);
    document.removeEventListener("touchend", this.handleDocumentClick, false);
  }

  handleMouseDown(event) {
    if (this.props.onFocus && typeof this.props.onFocus === "function") {
      this.props.onFocus(this.state.isOpen);
    }
    if (event.type === "mousedown" && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  setValue(value, label) {
    let newState = {
      selected: {
        value,
        label
      },
      isOpen: false
    };
    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption(option) {
    const optionClass =
      option.value === this.state.selected.value
        ? classNames(s.option, s.selected)
        : s.option;

    let value = option.value || option.label || option;
    let label = option.label || option.value || option;

    return (
      <div
        key={value}
        className={optionClass}
        onMouseDown={this.setValue.bind(this, value, label)}
        onClick={this.setValue.bind(this, value, label)}
      >
        {label}
      </div>
    );
  }

  buildMenu() {
    let { options } = this.props;
    let ops = options.map(option => {
      if (option.type === "group") {
        let groupTitle = <div className={s.title}>{option.name}</div>;
        let _options = option.items.map(item => this.renderOption(item));

        return (
          <div className={s.group} key={option.name}>
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        return this.renderOption(option);
      }
    });

    return ops.length ? (
      ops
    ) : (
      <div className={s.noresults}>No options found</div>
    );
  }

  handleDocumentClick(event) {
    if (this.mounted) {
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        if (this.state.isOpen) {
          this.setState({ isOpen: false });
        }
      }
    }
  }

  render() {
    const { className } = this.props;

    const disabledClass = this.props.disabled ? s.disabled : "";
    const placeHolderValue =
      typeof this.state.selected === "string"
        ? this.state.selected
        : this.state.selected.label;

    const value = <div className={s["placeholder"]}>{placeHolderValue}</div>;
    const menu = this.state.isOpen ? (
      <div className={s["menu"]}>{this.buildMenu()}</div>
    ) : null;

    return (
      <div className={classNames(s["g-dropdown"], className)}>
        <div
          className={classNames(s.control, disabledClass)}
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchEnd={this.handleMouseDown.bind(this)}
        >
          {value}
          <span className={s.arrow} />
        </div>
        {menu}
      </div>
    );
  }
}

export default Dropdown;
