// 旧页面的layout: 公会，登录，注册，邀请注册，oauth
import React from "react";
import NProgress from "nprogress";
import { injectIntl } from "react-intl";
import g from "../lib/css/public.less";
import { message, Iconfont } from "../lib";
import route_map from "../config/route_map";

class LayoutRC extends React.Component {
  constructor() {
    super();
    this.state = {
      display: 0,
    };
  }
  componentDidMount() {
    const pathname = window.location.pathname;
    if (
      /bhe.?App/i.test(navigator.userAgent) ||
      pathname.indexOf("/login") > -1 ||
      pathname.indexOf("/register") > -1
    ) {
      this.setState({
        display: 0,
      });
    } else {
      if (
        pathname.indexOf("/guild") > -1 &&
        window.sessionStorage.display != 1
      ) {
        this.setState({
          display: 1,
        });
      }
    }
    setTimeout(() => {
      const dom = window.document.querySelector("#_g_mask");
      dom && (dom.style.display = "none");
    }, 200);
    NProgress.done();
    window.addEventListener(
      "offline",
      () => {
        // 断网
        if (!navigator.onLine) {
          message.info(
            window.appLocale.messages["网络连接中断,请刷新页面重试"]
          );
        }
      },
      false
    );
  }
  componentWillUnmount() {
    NProgress.start();
  }
  change = () => {
    window.sessionStorage.display = 1;
    this.setState({
      display: 0,
    });
  };
  render() {
    const pathname = window.location.pathname;
    const display = this.state.display;
    const shareConfig = this.props.index_config.shareConfig || {};
    return [
      <div className={g.g_headerBox} key="header">
        {pathname === route_map.login ||
        pathname === route_map.register ||
        pathname === route_map.user_card ||
        pathname.indexOf("guild") > -1
          ? ""
          : ""}
        <div
          className={
            pathname.indexOf("guild") == -1
              ? g.g_contentbox
              : g.g_contentbox_guild
          }
        >
          {this.props.children}
        </div>
      </div>,
      <div
        key="layer"
        style={{ display: display && shareConfig.openUrl ? "block" : "none" }}
      >
        {display && shareConfig.openUrl ? (
          <div className={g.download_layer}>
            <div>
              {shareConfig.logoUrl ? <img src={shareConfig.logoUrl} /> : ""}
            </div>
            <div>
              <h2>{shareConfig.title}</h2>
              <p>{shareConfig.description}</p>
            </div>
            <div>
              {shareConfig.openUrl ? (
                <a
                  href={shareConfig.openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {window.appLocale.messages["下载"]}
                </a>
              ) : (
                ""
              )}
            </div>
            <div onClick={this.change} style={{ padding: "0 8px" }}>
              <Iconfont type="close" size="24" />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>,
    ];
  }
}

export default injectIntl(LayoutRC);
