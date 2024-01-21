// 二次验证
import React from "react";
import { Link } from "dva/router";
import { FormattedMessage, injectIntl } from "react-intl";
//import { Layer, Button, Input, Icon } from "../../lib";
import route_map from "../../config/route_map";
import VerfiCodeRC from "../public/verificationCode";
import classnames from "classnames";
//import s from "./secVerify.less";
import style from "./secVerify_style";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Tabs,
  Tab,
  TextField,
  Select,
  Button,
  FormControl,
  FormHelperText,
  Input,
  CircularProgress,
  Dialog
} from "@material-ui/core";

/**
 * @class SecVerify
 * @param {String} isopen
 * @param {String} verifyType 验证码发送类别
 * @param {Number} n 接口类别，0=登录前，1=登录后，默认1
 * @param {Object} userinfo 用户信息
 * @param {Number} userinfo.registerType 注册类型
 * @param {String} userinfo.email
 * @param {String} userinfo.mobile
 * @param {Boolean} loading 按钮loading状态
 * @param {Boolean} showCloseBtn 是否显示右上角关闭按钮
 */
class SecVerify extends React.Component {
  constructor() {
    super();
    this.state = {
      sendVerfiCode: false,
      type: 0, // 验证方式切换,0=ga,1=email,mobile
      islogin: true, // 是否登录
      ga: {
        msg: "",
        value: ""
      },
      mobile: {
        msg: "",
        value: ""
      },
      email: {
        msg: "",
        value: ""
      }
    };
    this.ga_input = React.createRef();
    this.email_input = React.createRef();
    this.mobile_input = React.createRef();

    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.changeType = this.changeType.bind(this);
    this.change = this.change.bind(this);
    this.success = this.success.bind(this);
    this.preAction = this.preAction.bind(this);
    this.goback = this.goback.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.setFocus = this.setFocus.bind(this);
  }
  setFocus() {
    // let [initType, userBindType] = this.renderInitType();
    // //console.log(this["ga_input"], this["ga_input"].props.className);
    // const dom = document.querySelector("." + this["ga_input"].props.className);
    // if (dom) {
    //   dom.focus();
    // }
    //this[initType + "_input"].focus();
  }

  onCancel() {
    this.setState({
      ga: {
        msg: "",
        value: ""
      },
      mobile: {
        msg: "",
        value: ""
      },
      email: {
        msg: "",
        value: ""
      },
      sendVerfiCode: false
    });

    this.verfiCode && this.verfiCode.reset();
    this.props.onCancel && this.props.onCancel();
  }
  goback() {
    if (this.props.goback) {
      this.props.goback();
    } else {
      window.history.back();
    }
  }
  changeType(e, n) {
    this.setState({
      type: n
    });
  }
  type = () => {
    if (this.props.userinfo) {
      if (this.props.userinfo.bindGA) {
        return "ga";
      }
      if (this.props.userinfo.bindMobile) {
        return "mobile";
      }
      if (this.props.userinfo.bindEmail) {
        return "email";
      }
    }
    return "ga";
  };
  change(n, e) {
    let value = e.target.value;
    value = value.replace(/\s/g, "");
    this.setState(
      {
        [n]: {
          value,
          msg: ""
        }
      },
      () => {
        if (value.length == 6) {
          this.preAction();
        }
      }
    );
  }
  sendVerfiCode(type) {
    this.setState(
      {
        sendVerfiCode: true
      },
      () => {
        let data = {};

        if (type === "email") {
          data.email = this.props.userinfo.email;
        } else {
          data.mobile = this.props.userinfo.mobile;
          data.national_code = "";
        }
        // verifyType, 短信验证码发送类别
        data.type = this.props.verifyType;
        // 未登录，二次验证发送验证码需要requestId
        if (this.props.requestId) {
          data.request_id = this.props.requestId;
        }
        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: this.props.n || this.props.n === 0 ? this.props.n : 1,
          errorCallback: () => {
            // 验证码错误回调
            // this.setState({
            //   sendVerfiCode: false
            // });
            this.verfiCode && this.verfiCode.reset();
          }
        });
      }
    );
  }
  preAction() {
    let v = "";
    // ga
    if (this.type() === "ga") {
      v = this.state.ga.value;
      if (!v) {
        this.setState({
          ga: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      if (!/^\d{6}$/.test(v)) {
        this.setState({
          ga: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "验证码错误"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
    }
    // email
    if (this.type() === "email") {
      if (!this.state.sendVerfiCode) {
        this.setState({
          ["email"]: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请获取验证码"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      v = this.state.email.value;
      if (!v) {
        this.setState({
          email: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
        this.setState({
          email: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "验证码错误"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
    }
    // mobile
    if (this.type() == "mobile") {
      if (!this.state.sendVerfiCode) {
        this.setState({
          ["mobile"]: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请获取验证码"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      v = this.state.mobile.value;
      if (!v) {
        this.setState({
          mobile: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "此项不能为空"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      if (!/^[0-9a-zA-Z]{6,8}$/.test(v)) {
        this.setState({
          mobile: {
            value: v,
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "验证码错误"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
    }
    this.success();
  }
  // 确定回调
  success() {
    console.log(this.verfiCode);
    this.verfiCode && this.verfiCode.reset();
    const ga = this.state.ga.value;
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;
    const values = { ga: ga, email: email, mobile: mobile };
    const types = { ga: 3, email: 2, mobile: 1 };
    let verify_code = "";
    let auth_type = "";

    verify_code = values[this.type()];
    auth_type = types[this.type()];

    // 重置状态
    this.setState(
      {
        sendVerfiCode: false,
        ga: {
          msg: "",
          value: ""
        },
        mobile: {
          msg: "",
          value: ""
        },
        email: {
          msg: "",
          value: ""
        }
      },
      () => {
        this.props.callback &&
          this.props.callback({
            verify_code,
            auth_type
          });
      }
    );
  }

  render() {
    //let [initType, userBindType] = this.renderInitType();
    const { classes } = this.props;
    // step1 引导去绑定
    // if (!userBindType[0] && !userBindType[1]) {
    //   return (
    //     <Dialog open={this.props.isopen} onClose={() => {}}>
    //       <div className={classes.noVerify}>
    //         <p>
    //           {this.props.intl.formatMessage({
    //             id: "为了您的账户安全，请进行二次验证"
    //           })}
    //         </p>
    //         <div>
    //           <Link to={route_map.user_bind + "/ga"}>
    //             {this.props.intl.formatMessage({
    //               id: "谷歌验证"
    //             })}
    //             <i>
    //               {this.props.intl.formatMessage({
    //                 id: "推荐"
    //               })}
    //             </i>
    //           </Link>
    //           {this.props.userinfo.registerType == 1 ? (
    //             <Link to={route_map.user_bind + "/email"}>
    //               {this.props.intl.formatMessage({
    //                 id: "邮箱验证"
    //               })}
    //             </Link>
    //           ) : (
    //             <Link to={route_map.user_bind + "/mobile"}>
    //               {this.props.intl.formatMessage({
    //                 id: "手机验证"
    //               })}
    //             </Link>
    //           )}
    //         </div>
    //         <em onClick={this.goback}>
    //           {this.props.intl.formatMessage({
    //             id: "暂不需要"
    //           })}
    //         </em>
    //       </div>
    //     </Dialog>
    //   );
    // }
    // step2 二次验证
    const title_classname = classnames(classes.title, classes.title_one);
    return (
      <Dialog
        fullScreen
        open={this.props.isopen}
        // showCloseBtn={this.props.showCloseBtn}
        // onCancel={this.onCancel}
      >
        <div className={classes.verify}>
          <Tabs
            value={this.state.type}
            onChange={this.changeType}
            className={classes.tabs}
            indicatorColor="primary"
          >
            {this.type() == "ga" ? (
              <Tab
                className={classnames(classes.tab, classes.selected)}
                label={this.props.intl.formatMessage({ id: "谷歌验证" })}
              />
            ) : (
              ""
            )}
            {this.type() == "email" ? (
              <Tab
                label={this.props.intl.formatMessage({ id: "邮箱验证" })}
                className={classnames(classes.tab, classes.selected)}
              />
            ) : (
              ""
            )}
            {this.type() == "mobile" ? (
              <Tab
                label={this.props.intl.formatMessage({ id: "手机验证" })}
                className={classnames(classes.tab, classes.selected)}
              />
            ) : (
              ""
            )}
          </Tabs>
          {/* <div className={title_classname}>
            {userBindType[0] ? (
              <div
                onClick={this.changeType.bind(this, 0)}
                className={
                  this.state.type === 0 ||
                  (this.state.type === -1 && initType == "ga")
                    ? style.choose
                    : ""
                }
              >
                <FormattedMessage id="谷歌验证" />
              </div>
            ) : (
              ""
            )}
            {this.props.userinfo.registerType == 1 && userBindType[1] ? (
              <div
                onClick={this.changeType.bind(this, 1)}
                className={
                  this.state.type === 1 ||
                  (this.state.type === -1 && initType == "email")
                    ? style.choose
                    : ""
                }
              >
                <FormattedMessage id="邮箱验证" />
              </div>
            ) : (
              ""
            )}
            {this.props.userinfo.registerType == 2 && userBindType[1] ? (
              <div
                onClick={this.changeType.bind(this, 1)}
                className={
                  this.state.type === 1 ||
                  (this.state.type === -1 && initType == "mobile")
                    ? style.choose
                    : ""
                }
              >
                <FormattedMessage id="手机验证" />
              </div>
            ) : (
              ""
            )}
          </div> */}
          {/* ga */}
          {this.type() == "ga" ? (
            <div className={classes.on}>
              <Input
                className={classes.input}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码"
                })}
                ref={ref => (this.ga_input = ref)}
                value={this.state.ga.value}
                onChange={this.change.bind(this, "ga")}
              />
              <p>{this.state.ga.msg}</p>
            </div>
          ) : (
            ""
          )}
          {this.type() == "email" ? (
            // 验证 email
            <div className={classes.on}>
              <Input
                className={classes.input}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码"
                })}
                ref={ref => (this.email_input = ref)}
                value={this.state.email.value}
                onChange={this.change.bind(this, "email")}
                inputProps={{
                  maxLength: 6
                }}
                endAdornment={
                  <VerfiCodeRC
                    value={this.props.userinfo.email}
                    onClick={this.sendVerfiCode.bind(this, "email")}
                    className={classes.verfCode}
                    ref={ref => (this.verfiCode = ref)}
                  />
                }
              />

              <p>{this.state.email.msg}</p>
            </div>
          ) : (
            ""
          )}
          {this.type() == "mobile" ? (
            // 验证mobile
            <div className={classes.on}>
              <Input
                className={classes.input}
                placeholder={this.props.intl.formatMessage({
                  id: "请输入验证码"
                })}
                value={this.state.mobile.value}
                onChange={this.change.bind(this, "mobile")}
                ref={ref => (this.mobile_input = ref)}
                inputProps={{
                  maxLength: 6
                }}
                endAdornment={
                  <VerfiCodeRC
                    value={this.props.userinfo.mobile}
                    onClick={this.sendVerfiCode.bind(this, "mobile")}
                    className={classes.verfCode}
                    ref={ref => (this.verfiCode = ref)}
                  />
                }
              />

              <p>{this.state.mobile.msg}</p>
            </div>
          ) : (
            ""
          )}
          <div className={classes.btn}>
            {this.props.loading ? (
              <Button
                className={classes.button}
                disabled
                variant="contained"
                color="primary"
              >
                <CircularProgress size={24} style={{ color: "#fff" }} />
              </Button>
            ) : (
              <Button
                className={classes.button}
                onClick={this.preAction}
                variant="contained"
                color="primary"
              >
                {this.props.intl.formatMessage({
                  id: "确定"
                })}
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(style)(injectIntl(SecVerify));
