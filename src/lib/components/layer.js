/*
 *  用法
 *  <Layer
 *      isopen=false 弹层状态
 *      className=''
 *      onCancel=function(){} 取消方法
 *      cancelText=''
 *      onOk=function(){} 确认方法
 *      okText=''
 *      title=''
 *      maskClosable = ture /false  背景蒙层是否可以关闭弹层，默认false
 *  >
 *  doms
 * </Layer>
 *
 */

import React from "react";
import classNames from "classnames";
import Button from "./button";
import Btngroup from "./btngroup";
import Icon from "./icon";
import { FormattedMessage } from "react-intl";
import s from "../css/layer.less";

const preventDefault = function(e) {
  e.preventDefault();
};

class Layer extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      isopen: false,
      layer_className: classNames(s["g-layer"], s["hide"]),
      cantouchmove: false,
      dom: "",
      isandroid: false
    };
    this.renderTitle = this.renderTitle.bind(this);
    this.cancel = this.cancel.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.ok = this.ok.bind(this);
  }
  componentDidMount() {
    this.setState({
      isandroid: /android/i.test(navigator.userAgent),
      layer_className: this.props.isopen
        ? s["g-layer"]
        : classNames(s["g-layer"], s["hide"]),
      isopen: this.props.isopen || false,
      cantouchmove: this.props.cantouchmove
    });
    if (this.props.isopen) {
      this.show();
      this.setState({
        isopen: this.props.isopen
      });
    }
    // 修复android下，键盘遮挡浮层内容的bug
    if (/android/i.test(navigator.userAgent)) {
      let dom = this.dom,
        inner = dom.querySelector(".layer-inner"),
        inputs = inner.querySelectorAll("input");
      function focus(e) {
        if (dom.classList.contains("android")) return;
        dom.classList.add("android");
      }
      function blur() {
        dom.classList.remove("android");
      }
      for (var i = 0, l = inputs.length; i < l; i++) {
        inputs[i].addEventListener("focus", focus, false);
        inputs[i].addEventListener("blur", blur, false);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    let isopen = this.props.isopen;
    if (!isopen && nextProps.isopen) {
      this.show();
    } else if (isopen && !nextProps.isopen) {
      this.hide();
    }
  }
  show() {
    this.setState({
      layer_className: classNames(s["g-layer"], s["hide"])
    });
    setTimeout(() => {
      this.setState({
        layer_className: s["g-layer"]
      });
    }, 100);
    // 内容是否滚动
    if (!this.props.cantouchmove) {
      document.body.addEventListener("touchmove", preventDefault, false);
    }
  }
  hide() {
    let state = false;
    const _close = () => {
      if (state) return;
      this.dom.removeEventListener("webkitTransitionEnd", _close, false);
      this.dom.removeEventListener("transitionend", _close, false);
      state = true;
      this.setState({
        layer_className: classNames(s["g-layer"], s["hide"], s["close"])
      });
    };
    this.dom.addEventListener("webkitTransitionEnd", _close, false);
    this.dom.addEventListener("transitionend", _close, false);
    document.body.removeEventListener("touchmove", preventDefault, false);
    this.setState({
      layer_className: classNames(s["g-layer"], s["close"])
    });
  }
  cancel() {
    this.props.onCancel && this.props.onCancel();
  }
  ok() {
    this.props.onOk && this.props.onOk();
  }
  renderTitle() {
    if (this.props.title) {
      return <div className={s["layer-title"]}>{this.props.title}</div>;
    }
    return null;
  }
  renderBtn() {
    if (this.props.onCancel) {
      return (
        <Btngroup type="justify">
          <Button onClick={this.cancel}>
            {this.props.cancelText ? (
              this.props.cancelText
            ) : (
              <FormattedMessage id="取消" />
            )}
          </Button>
          <div className={s["g-border-l"]} />
          <Button onClick={this.ok}>
            {this.props.okText ? (
              this.props.okText
            ) : (
              <FormattedMessage id="确定" />
            )}
          </Button>
        </Btngroup>
      );
    }
    if (this.props.onOk) {
      return (
        <Btngroup type="justify">
          <Button onClick={this.ok}>
            {this.props.okText ? (
              this.props.okText
            ) : (
              <FormattedMessage id="确定" />
            )}
          </Button>
        </Btngroup>
      );
    }
    return null;
  }
  render() {
    let {
      className,
      isopen,
      onClick,
      onCancel,

      cantouchmove,
      onOk,

      maskClosable,
      title,
      noBtn,
      showCloseBtn,
      ...props
    } = this.props;
    let node = (
      <div className={s["layer-inner"]}>
        {this.renderTitle()}
        <div className={s["layer-content"]}>{this.props.children}</div>
        {noBtn ? null : this.renderBtn()}
        {showCloseBtn ? (
          <Icon className={s.showCloseBtn} type="close" onClick={onCancel} />
        ) : (
          ""
        )}
      </div>
    );
    if (maskClosable) {
      let onClickFn = e => {
        if (onClick) {
          onClick(e);
        }
        onCancel();
      };
      return (
        <div
          onClick={onClickFn}
          className={classNames(this.state.layer_className, className)}
          {...props}
          ref={ref => (this.dom = ref)}
        >
          {node}
        </div>
      );
    }
    return (
      <div
        className={classNames(this.state.layer_className, className)}
        {...props}
        ref={ref => (this.dom = ref)}
      >
        {node}
      </div>
    );
  }
}

export default Layer;
