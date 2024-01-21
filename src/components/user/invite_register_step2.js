// 注册
import React from "react";
import { Link } from "dva/router";
import { injectIntl } from "react-intl";
import style from "./login_style";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Button, CircularProgress } from "@material-ui/core";

class RegisterStep1 extends React.Component {
  constructor() {
    super();
    this.state = {
      logo: "",
      url: "",
      text: "",
      show: false
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: "user/download_info",
      payload: {}
    });
    setTimeout(() => {
      const dom = window.document.querySelector("#_g_mask");
      dom && (dom.style.display = "none");
    }, 200);
  }
  render() {
    const { classes } = this.props;
    let link = this.props.invite_register.downloadWebUrl;
    const wx = /MicroMessenger/i.test(window.navigator.userAgent);
    return (
      <div className={classes.invite_register2}>
        <div className={classes.invite_logo2}>
          {this.props.invite_register.logoUrl ? (
            <img src={this.props.invite_register.logoUrl} />
          ) : (
            ""
          )}
          <h1>
            {this.props.intl.formatMessage({
              id: "恭喜注册成功"
            })}
          </h1>
        </div>
        {link ? (
          <div className={classes.invite_download}>
            <p>{this.props.invite_register.text}</p>
            {wx ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState({
                    show: true
                  });
                }}
              >
                {this.props.intl.formatMessage({
                  id: "下载客户端"
                })}
              </Button>
            ) : (
              <Button variant="contained" color="primary" href={link}>
                {this.props.intl.formatMessage({
                  id: "下载客户端"
                })}
              </Button>
            )}
          </div>
        ) : (
          <div className={classes.invite_download} />
        )}
        <div
          className={classes.wx_tip}
          onClick={() => {
            this.setState({
              show: false
            });
          }}
          style={{ display: this.state.show ? "block" : "none" }}
        >
          <img src={require("../../assets/wx_tip.png")} />
          <p>
            {this.props.intl.formatMessage({
              id: "wx_download_tip1"
            })}
            <br />
            {this.props.intl.formatMessage({
              id: "wx_download_tip2"
            })}
            <br />
            {this.props.intl.formatMessage({
              id: "wx_download_tip3"
            })}
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(RegisterStep1));
