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
import helper from "../../utils/helper";

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
    this.renderInitType = this.renderInitType.bind(this);
    this.setFocus = this.setFocus.bind(this);
  }
  setFocus() {
    let [initType, userBindType] = this.renderInitType();
    console.log(initType);
    //console.log(this["ga_input"], this["ga_input"].props.className);
    const dom = document.querySelector("." + this["ga_input"].props.className);
    if (dom) {
      dom.focus();
    }
    //this[initType + "_input"].focus();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isopen && !this.props.isopen) {
      setTimeout(this.setFocus, 10);
    }
    return true;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // 未登录
  //   if (window.location.href.indexOf(route_map.login) > -1) {
  //     if (!this.props.userinfo.requestId && nextProps.userinfo.requestId) {
  //       this.setState(
  //         {
  //           type: nextProps.userinfo.bindGA ? 0 : 1,
  //           islogin: false
  //         },
  //         () => {
  //           window.console.log(this.state);
  //         }
  //       );
  //     }
  //   } else {
  //     if (!this.props.userinfo.userId && nextProps.userinfo.userId) {
  //       // 登录后
  //       this.setState(
  //         {
  //           type: nextProps.userinfo.bindGA ? 0 : 1
  //         },
  //         () => {
  //           window.console.log(this.state, nextProps.userinfo);
  //         }
  //       );
  //     }
  //   }
  //   return true;
  // }
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
  change(n, e) {
    let value = e.target.value;
    value = value.replace(/\s/g, "");
    value = helper.removeEmoji(value);
    this.setState(
      {
        [n]: {
          value,
          msg: ""
        }
      },
      () => {
        // 如果不是提现页面，长度为6时，自动提交表单
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
    if (this.state.type === 0) {
      v = this.state.ga.value;
      if (!v) {
        this.setState({
          ga: {
            value: v,
            msg: (
              <React.Fragment>
                {/* <Icon type="exclamation-circle" /> */}
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
                {/* <Icon type="exclamation-circle" /> */}
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
    if (this.state.type === 1) {
      if (!this.state.sendVerfiCode) {
        this.setState({
          [this.props.userinfo.registerType === 1 ? "email" : "mobile"]: {
            value: v,
            msg: (
              <React.Fragment>
                {/* <Icon type="exclamation-circle" /> */}
                {this.props.intl.formatMessage({
                  id: "请获取验证码"
                })}
              </React.Fragment>
            )
          }
        });
        return;
      }
      // 手机注册，验证邮箱
      if (this.props.userinfo.registerType === 1) {
        v = this.state.email.value;
        if (!v) {
          this.setState({
            email: {
              value: v,
              msg: (
                <React.Fragment>
                  {/* <Icon type="exclamation-circle" /> */}
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
                  {/* <Icon type="exclamation-circle" /> */}
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
      // 邮箱注册，验证手机
      if (this.props.userinfo.registerType === 2) {
        v = this.state.mobile.value;
        if (!v) {
          this.setState({
            mobile: {
              value: v,
              msg: (
                <React.Fragment>
                  {/* <Icon type="exclamation-circle" /> */}
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
                  {/* <Icon type="exclamation-circle" /> */}
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
    const [initType, userBindType] = this.renderInitType();
    const values = { ga: ga, email: email, mobile: mobile };
    const types = { ga: 3, email: 2, mobile: 1 };
    let verify_code = "";
    let auth_type = "";
    if (this.state.type == -1) {
      verify_code = values[initType];
      auth_type = types[initType];
    } else {
      if (this.state.type === 0) {
        verify_code = ga;
        auth_type = 3;
      } else {
        verify_code = this.props.userinfo.registerType === 1 ? email : mobile;
        auth_type = this.props.userinfo.registerType === 1 ? 2 : 1;
      }
    }

    // 重置状态
    this.setState(
      {
        //sendVerfiCode: false,
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
  renderInitType() {
    // 已登录
    let bindGA = this.props.userinfo.bindGA;

    let bindEmail =
      this.props.userinfo.registerType == 1 ? this.props.userinfo.email : false;
    let bindMobile =
      this.props.userinfo.registerType == 2
        ? this.props.userinfo.mobile
        : false;

    // 未登录
    if (!this.props.userinfo.userId) {
      bindEmail = this.props.userinfo.bindEmail;
      bindMobile = this.props.userinfo.bindMobile;
    }

    let userBindType =
      this.props.userinfo.registerType == 1
        ? [bindGA, bindEmail]
        : [bindGA, bindMobile];
    let initType = "ga";
    if (userBindType[0]) {
      initType = "ga";
    } else {
      if (this.props.userinfo.registerType == 1) {
        initType = "email";
      } else {
        initType = "mobile";
      }
    }
    return [initType, userBindType];
  }
  render() {
    let [initType, userBindType] = this.renderInitType();
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
    const title_classname =
      userBindType[0] && userBindType[1]
        ? classes.title
        : classnames(classes.title, classes.title_one);
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
            {userBindType[0] ? (
              <Tab
                className={
                  this.state.type === 0 ||
                  (this.state.type === -1 && initType == "ga")
                    ? classnames(classes.tab, classes.selected)
                    : classes.tab
                }
                label={this.props.intl.formatMessage({ id: "谷歌验证" })}
              />
            ) : (
              ""
            )}
            {this.props.userinfo.registerType == 1 && userBindType[1] ? (
              <Tab
                label={this.props.intl.formatMessage({ id: "邮箱验证" })}
                className={
                  this.state.type === 1 ||
                  (this.state.type === -1 && initType == "email")
                    ? classnames(classes.tab, classes.selected)
                    : classes.tab
                }
              />
            ) : (
              ""
            )}
            {this.props.userinfo.registerType == 2 && userBindType[1] ? (
              <Tab
                label={this.props.intl.formatMessage({ id: "手机验证" })}
                className={
                  this.state.type === 1 ||
                  (this.state.type === -1 && initType == "mobile")
                    ? classnames(classes.tab, classes.selected)
                    : classes.tab
                }
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
          {userBindType[0] ? (
            <div
              className={
                this.state.type === 0 ||
                (this.state.type === -1 && initType == "ga")
                  ? classes.on
                  : classes.item
              }
            >
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
          {this.props.userinfo.registerType == 1 && userBindType[1] ? (
            // 验证 email
            <div
              className={
                this.state.type === 1 ||
                (this.state.type === -1 && initType == "email")
                  ? classes.on
                  : classes.item
              }
            >
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
                    value={this.props.userinfo.mobile}
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
          {this.props.userinfo.registerType == 2 && userBindType[1] ? (
            // 验证mobile
            <div
              className={
                this.state.type === 1 ||
                (this.state.type === -1 && initType == "mobile")
                  ? classes.on
                  : classes.item
              }
            >
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
                    value={this.props.userinfo.email}
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
