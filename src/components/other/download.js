// 下载页
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../lib";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Grid, CircularProgress } from "@material-ui/core";
const styles = (theme) => ({
  content: {
    width: "100%",
    minHeight: "100vh",
    margin: "0 auto",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    "& h2": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
      margin: "40px 0 50px",
      textAlign: "center",
    },
    "& img": {
      width: "100%",
    },
  },
  button: {
    position: "fixed",
    bottom: 0,
    right: 0,
    left: 0,
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    "& a": {
      height: 40,
      fontSize: 12,
      fontWeight: 500,
    },
  },
  buttonWrap: {
    margin: "0 8px 0 0",
    borderRadius: 0,
    flex: "1 1 0",
    "& .MuiButton-root": {
      width: "100%",
      padding: 0,
    },
  },
  select: {
    padding: "5px 0",
    position: "fixed",
    background: "rgba(0,0,0,.5)",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonWrap2: {
    position: "fixed",
    width: "60%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    "& a": {
      width: "100%",
      margin: "10px 0",
    },
  },
  icon: {
    margin: "-2px 5px 0 0",
  },
});
class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      type: "",
    };
  }
  componentDidMount() {
    const dom = window.document.querySelector("#_g_mask");
    dom && (dom.style.display = "none");
    const ua = window.navigator.userAgent;
    this.props.dispatch({
      type: "user/download_info",
      payload: {},
    });
    if (/iphone|ipad|ipod/i.test(ua)) {
      this.setState({
        type: "ios",
      });
    } else if (/android/i.test(ua)) {
      this.setState({
        type: "android",
      });
    } else {
      this.setState({
        type: "unknow",
      });
    }
  }
  selectType = (type) => {
    this.setState({
      type: type,
    });
  };
  render() {
    const { classes } = this.props;
    const lang = window.localStorage.lang;
    let ua = window.navigator.userAgent;
    let type = "Android";
    let wechat = 0;
    if (/iphone|ipad|ipod/i.test(ua)) {
      type = "iOS";
    }
    if (/android/i.test(ua)) {
      type = "Android";
    }
    if (/micromessenger/i.test(ua)) {
      wechat = 1;
    }
    let desc = type == "Android" ? "浏览器" : "safari";
    if (lang !== "zh-cn") {
      desc = type == "Android" ? "internet browser" : "safari";
    }
    return (
      <div>
        {wechat ? (
          <div
            id="view"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100%",
              zIndex: 99,
              width: "100%",
              background: "rgb(52, 52, 52)",
              marginLeft: 0,
              marginRight: 0,
              paddingTop: 30,
              paddingBottom: 30,
              boxShadow: "rgba(22, 22, 23, 0.62) 0px -10px 16px inset",
            }}
          >
            <div style={{ paddingRight: 50, paddingLeft: 30 }}>
              <p style={{ color: "#7f7e7e", margin: 0 }} id="desc">
                {lang == "zh-cn"
                  ? "点击右上角按钮，然后在弹出的菜单中，点击在" +
                    desc +
                    "中打开，即可安装"
                  : "click on the upper right button, from the pop up menu click to  select open up with " +
                    desc +
                    " and you may proceed to install."}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.type == "ios" ? (
          <div className={classes.content}>
            <img src={this.props.invite_register.iosGuideImageUrl} />
            <div className={classes.button}>
              {this.props.invite_register.iosDownloadUrl ? (
                <div className={classes.buttonWrap}>
                  <Button
                    href={this.props.invite_register.iosDownloadUrl}
                    variant="contained"
                    color="primary"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <FormattedMessage id="本地下载" />
                  </Button>
                </div>
              ) : (
                ""
              )}
              {this.props.invite_register.appStoreDownloadUrl ? (
                <div className={classes.buttonWrap}>
                  <Button
                    href={this.props.invite_register.appStoreDownloadUrl}
                    variant="contained"
                    color="secondary"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Iconfont className={classes.icon} type="apple" size="20" />
                    App Store
                  </Button>
                </div>
              ) : (
                ""
              )}
              {this.props.invite_register.testflightDownloadUrl ? (
                <div className={classes.buttonWrap}>
                  <Button
                    href={this.props.invite_register.testflightDownloadUrl}
                    variant="contained"
                    color="primary"
                    style={{ whiteSpace: "nowrap", textTransform: "none" }}
                  >
                    <Iconfont
                      className={classes.icon}
                      type="testfight"
                      size="20"
                    />
                    TestFlight
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.type == "android" ? (
          <div className={classes.content}>
            <img src={this.props.invite_register.androidGuideImageUrl} />
            <div className={classes.button}>
              {this.props.invite_register.androidDownloadUrl ? (
                <div className={classes.buttonWrap}>
                  <Button
                    href={this.props.invite_register.androidDownloadUrl}
                    variant="contained"
                    color="primary"
                  >
                    <FormattedMessage id="本地下载" />
                  </Button>
                </div>
              ) : (
                ""
              )}
              {this.props.invite_register.googlePlayDownloadUrl ? (
                <div className={classes.buttonWrap}>
                  <Button
                    href={this.props.invite_register.googlePlayDownloadUrl}
                    variant="contained"
                    color="secondary"
                  >
                    <Iconfont
                      className={classes.icon}
                      type="googleplay"
                      size="20"
                    />
                    Google Play
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.type == "unknow" ? (
          <div className={classes.content}>
            <img
              src={
                this.props.invite_register.iosGuideImageUrl ||
                this.props.invite_register.androidGuideImageUrl
              }
            />
            <div className={classes.select}>
              <div className={classes.buttonWrap2}>
                <Button
                  onClick={this.selectType.bind(this, "ios")}
                  variant="contained"
                >
                  <Iconfont className={classes.icon} type="apple" size="20" />
                  Iphone
                </Button>
                <Button
                  onClick={this.selectType.bind(this, "android")}
                  variant="contained"
                >
                  <Iconfont className={classes.icon} type="android" size="20" />
                  Android
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Index);
