import React from "react";
import { injectIntl } from "react-intl";
import style from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import WithRoot from "../withRoot";
import Cookie from "../utils/cookie";
import classnames from "classnames";

let timer = null;
const app = Boolean(/bhe.?App/i.test(navigator.userAgent));
class LayoutRC extends React.Component {
  constructor() {
    super();
    this.state = {
      innerHeight: 500,
      preview: 0,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      const dom = window.document.querySelector("#_g_mask");
      dom && (dom.style.display = "none");
    }, 200);
    if (!/bhe.?App/.test(window.localStorage.platform)) {
      this.setHeight();
      window.addEventListener("resize", this.setHeight, false);
    }
    // 预览模式
    if (/preview/.test(window.location.search) || Cookie.read("preview")) {
      this.setState({
        preview: 1,
      });
    }
  }
  setHeight = () => {
    const height = Math.min(
      window.innerHeight,
      window.document.documentElement.clientHeight
    );
    clearTimeout(timer);
    timer = null;
    timer = setTimeout(() => {
      //if (height != this.state.innerHeight) {
      this.setState(
        {
          innerHeight: height,
        },
        () => {
          this.layout.style.cssText += ";height:" + height + "px;";
          window.document.querySelector("html").style.cssText +=
            ";min-height:" + height + "px;";
          window.document.body.style.cssText += ";min-height:" + height + "px;";
          window.document.querySelector("#root").style.cssText +=
            ";min-height:" + height + "px;";
          //window.requestAnimationFrame(this.setHeight);
        }
      );
      //}
    }, 50);
  };
  cancelPreview = () => {
    let domain = window.location.origin.split(".");
    if (domain.length > 2) {
      domain.splice(0, 1);
    }
    domain = [""].concat(domain);
    if (window.location.href.indexOf("localhost") > -1) {
      domain = ["localhost"];
    }
    Cookie.del("preview", { domain: domain.join(".") });
    let search = window.location.search || "";
    if (search) {
      search = search.toLowerCase().replace(/preview(=true)?(&)?/, "");
    }
    window.location.href = window.location.pathname + search;
  };
  // 预览条
  renderPreview = () => {
    const classes = this.props.classes;
    if (this.state.preview) {
      return (
        <div className={classes.preview}>
          <div>
            <i onClick={this.cancelPreview}>
              {this.props.intl.formatMessage({
                id: "预览模式 - 点击切换线上模式",
              })}
            </i>
          </div>
        </div>
      );
    }
  };
  render() {
    const classes = this.props.classes;
    return (
      <div
        className={app ? classes.layout_app : classes.layout}
        ref={(ref) => (this.layout = ref)}
      >
        {this.renderPreview()}
        {this.props.children}
      </div>
    );
  }
}

export default WithRoot(withStyles(style)(injectIntl(LayoutRC)));
