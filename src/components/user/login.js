// 登录
import React from "react";
import { Link } from "dva/router";
import { FormattedMessage, injectIntl } from "react-intl";
import classnames from "classnames";
import { parse } from "search-params";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  CircularProgress,
  Dialog,
  DialogContent,
} from "@material-ui/core";

import CONST from "../../config/const";
import route_map from "../../config/route_map";
import Sense from "../public/sense_captcha"; // 极验行为
import GoogleCaptcha from "../public/google_captcha"; // google 验证
import SecVerify from "../public/secVerify_login"; // 二次验证
import VerfiCodeRC from "../public/verificationCode_mui";
import cookie from "../../utils/cookie";
import { callHandler } from "../../utils/app_jsbridge";
import SelectRC from "../public/select";
import helper from "../../utils/helper";
import { message, Iconfont } from "../../lib";

import style from "./login_style";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      type: 1, // 0快捷登录 or 1密码登录
      sendVerfiCode: false,
      isopen: false, // 人机layer
      isopen2: false, // 二次验证layer
      isopen3: false, // 密码框
      status: true,
      email: {
        status: "",
        msg: "",
        value: "",
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      ga: {
        status: "",
        msg: "",
        value: "",
      },
      password: {
        status: "",
        msg: "",
        value: "",
      },
      verify_code: {
        status: "",
        msg: "",
      },
      national_code: CONST.DEFAULT_NATIONAL_CODE,
      country_name: "",
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.areaCodeChange = this.areaCodeChange.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.changeType = this.changeType.bind(this);
    this.dropchange = this.dropchange.bind(this);
    this.login_step2 = this.login_step2.bind(this);
    this.success_step2 = this.success_step2.bind(this);
    this.login_step1_fail = this.login_step1_fail.bind(this);
    this.onCancel = this.onCancel.bind(this);

    // 极验
    this.senseSuccess = this.senseSuccess.bind(this);
    this.senseError = this.senseError.bind(this);
    this.senseClose = this.senseClose.bind(this);
  }
  SelectChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  componentDidMount() {
    const account_id = cookie.read("account_id");
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";
    if (account_id) {
      if (parse(search)["redirect"]) {
        window.location.href = helper.filterRedirect(
          decodeURIComponent(parse(search)["redirect"])
        );
        return;
      }
      window.location.href = route_map.index;
      return;
    }

    if (/bhe.?App/i.test(navigator.userAgent)) {
      callHandler({
        name: "login",
        data: {
          redirect: parse(search)["redirect"]
            ? helper.filterRedirect(parse(search)["redirect"])
            : window.location.href,
        },
        success: () => {
          // 成功事件
          console.log("login success");
        },
        cancel: () => {
          // 取消事件
          if (parse(search)["redirect"]) {
            window.location.href = helper.filterRedirect(
              decodeURIComponent(parse(search)["redirect"])
            );
            return;
          }
        },
        error: (res) => {
          // 失败事件
          window.alert(JSON.stringify(res));
        },
      });
      return;
    }
    this.setState({
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.state.national_code,
    });
  }
  componentWillUnmount() {}
  onCancel() {
    this.setState({
      isopen2: false,
    });
  }
  // 提交二次验证结果，进行登录
  success_step2(obj) {
    let values = {
      password: this.state.password.value,
      username: this.state.email.value,
    };
    // 快速登录
    if (!values.password && this.state.type == 0) {
      this.setState({
        password: {
          ...this.state.password,
          msg: this.props.intl.formatMessage({ id: "请输入密码" }),
        },
      });
      return;
    }
    values.type = this.state.type;

    values.request_id = this.props.loginVerify.requestId;
    values.auth_type = obj.auth_type || "";
    values.order_id = this.props.order_id;
    values.verify_code = obj.verify_code || "";

    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";

    try {
      this.props.dispatch({
        type: "user/login_step2",
        payload: values,
        redirect: search
          ? helper.filterRedirect(parse(search)["redirect"])
          : "",
        path: this.props.location.state ? this.props.location.state.path : "",
        history: this.props.history,
        errorCallback: this.step2_fail,
      });
    } catch (err) {
      this.step2_fail();
    }
  }
  step2_fail = () => {
    this.setState({
      isopen2: false,
      isopen3: false,
      isopen: false,
    });
    this.verfiCode && this.verfiCode.reset();
  };
  /**
   * login_step1 返回的数据，然后进行二次验证
   */
  login_step2() {
    if (this.state.type == 1) {
      this.setState({
        isopen2: true,
        isopen: false,
      });
    } else {
      this.setState({
        isopen3: true,
        isopen: false,
      });
    }
  }
  dropchange(v) {
    const d = v.value.split("-");
    this.setState({
      national_code: d[0],
      country_name: d[1],
    });
  }
  // 发送验证码
  sendVerfiCode = (e) => {
    const mobile = this.state.mobile.value;

    if (!mobile) {
      this.verfiCode.reset();
      this.setState({
        mobile: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
          value: "",
        },
      });
      return;
    }

    if (
      this.state.type == 0 &&
      this.state.national_code == 86 &&
      !/^1[3456789]\d{9}$/.test(mobile)
    ) {
      this.verfiCode.reset();
      this.setState({
        mobile: {
          status: "error",
          msg: (
            <React.Fragment>
              {this.props.intl.formatMessage({
                id: "无效的手机",
              })}
            </React.Fragment>
          ),
          value: mobile,
        },
      });
      return;
    }
    // 调用极验
    this.setState({
      isopen: true,
      verify_code: {
        status: "",
        msg: "",
        value: "",
      },
    });
    this.recaptcha.sense();
  };
  changeType(e, n) {
    this.setState({
      type: n,
      sendVerfiCode: false,
      status: true,
      email: {
        status: "",
        msg: "",
        value: "",
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      password: {
        status: "",
        msg: "",
        value: "",
      },
      verify_code: {
        status: "",
        msg: "",
        value: "",
      },
    });
  }

  changeStatus(n, e) {
    let t = e.target;
    let value = t.value;
    value = value.replace(/\s/g, "");
    this.setState({
      [n]: {
        status: "",
        msg: "",
        value,
      },
    });
  }

  handleChange = (name, e) => {
    if (name === "national_code") {
      this.setState({
        [name]: e.target.value,
      });
    } else {
      this.setState({
        [name]: {
          value: e.target.value,
          msg: "",
        },
      });
    }
  };

  areaCodeChange(value, prevValue, allValues) {
    const d = (value || "").split("-");
    return d[0];
  }
  // 验证表单
  verifyForm() {
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;
    const password = this.state.password.value;
    const verify_code = this.state.verify_code.value;

    // 密码登录
    if (this.state.type == 1) {
      if (!email) {
        this.setState({
          email: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "此项不能为空",
            }),
            value: "",
          },
        });
        return false;
      }
      if (!password) {
        this.setState({
          password: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "此项不能为空",
            }),
            value: "",
          },
        });
        return false;
      }
      // 密码 大于 8位，
      if (
        password.length < 8 ||
        password.length > 20 ||
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)
      ) {
        this.setState({
          password: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "密码8-20位字符，必须包含大小写字母和数字",
            }),
            value: this.state.password.value,
          },
        });
        return false;
      }
    }

    // 快捷登录
    if (this.state.type == 0) {
      if (!mobile) {
        this.setState({
          mobile: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "此项不能为空",
            }),
            value: "",
          },
        });
        return false;
      }
      if (!this.state.sendVerfiCode) {
        this.setState({
          verify_code: {
            status: "error",
            msg: (
              <React.Fragment>
                {this.props.intl.formatMessage({
                  id: "请获取验证码",
                })}
              </React.Fragment>
            ),
            value: verify_code,
          },
        });
        return;
      }
      if (!this.state.verify_code.value) {
        this.setState({
          verify_code: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "请输入验证码",
            }),
            value: this.state.verify_code.value,
          },
        });
        return false;
      }
    }

    return true;
  }
  login_step1_fail(code, msg) {
    //this.grecaptchaReset();
    this.recaptcha.reset();
    this.verfiCode && this.verfiCode.reset();
    if ("31019,31048,31049,31050".indexOf(code) > -1) {
      this.setState({
        password: {
          status: "error",
          msg: msg,
          value: this.state.password.value,
        },
      });
    } else {
      message.error(msg);
      this.setState({
        password: {
          status: "error",
          msg: "",
          value: this.state.password.value,
        },
      });
    }
  }
  // 极验，验证成功
  senseSuccess({ captcha_response, captcha_id, challenge }) {
    this.setState(
      {
        isopen: false,
        captcha_response,
        captcha_id,
        challenge,
        sendVerfiCode: true,
      },
      () => {
        // 密码登录
        if (this.state.type == 1) {
          this.login_step1();
        }
        // 快捷登录
        if (this.state.type == 0) {
          let data = {
            type: 22, // 快捷登录
            national_code: this.state.national_code,
            mobile: this.state.mobile.value,
            captcha_response,
            captcha_id,
            challenge,
          };
          this.props.dispatch({
            type: "layout/get_verify_code",
            payload: data,
            errorCallback: () => {
              this.verfiCode.reset();
            }, // 验证码错误回调
          });
          this.recaptcha.reset();
        }
      }
    );
  }
  login_step1 = () => {
    let values = {
      // 密码登录
      password: this.state.password.value,
      username: this.state.email.value,
      verify_code: this.state.verify_code.value,
      type: this.state.type,
      captcha_response: this.state.captcha_response,
      captcha_id: this.state.captcha_id,
      challenge: this.state.challenge,
      // 快捷登录
      mobile: this.state.mobile.value,
      login_type: "mobile",
      national_code: this.state.national_code,
      order_id: this.props.order_id,
    };
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";

    this.props.dispatch({
      type: "user/login_step1",
      payload: {
        ...values,
      },
      channel: "login",
      redirect: search ? helper.filterRedirect(parse(search)["redirect"]) : "",
      success: this.login_step2,
      fail: this.login_step1_fail,
      history: this.props.history,
    });
  };
  // 极验 失败
  senseError(err) {
    this.setState({
      isopen: false,
    });
    console.error(err);
    message.error(
      this.props.intl.formatMessage({
        id: "人机验证失败，请刷新页面重试",
      })
    );
  }
  // 极验，用户关闭
  senseClose() {
    this.setState({
      isopen: false,
    });
  }
  formSubmit(e) {
    e && e.preventDefault();
    let verifyResut = this.verifyForm();
    if (!verifyResut) {
      return;
    }

    // 快捷登录
    if (this.state.type == 0) {
      this.login_step1();
    } else {
      // 密码登录
      // 调用极验
      this.setState({
        isopen: true,
        outTime: false,
      });
      this.recaptcha.reset();
      this.recaptcha.sense();
    }
  }
  changeDialog = (key, v) => (e) => {
    this.setState({
      [key]: v,
    });
  };
  render() {
    let options = [];
    this.props.countries.forEach((item) => {
      options.push({
        label: item.nationalCode,
        value: item.nationalCode + "/" + item.countryName,
        search:
          item.countryName +
          item.nationalCode +
          item.shortName +
          item.indexName,
        id: item.id,
      });
    });

    const { classes } = this.props;
    return (
      <div className={classes.login}>
        <div className={classes.content}>
          <h1>
            <FormattedMessage id="登录" />
          </h1>
          <Tabs
            value={this.state.type}
            onChange={this.changeType}
            className={classes.tabs}
            indicatorColor="primary"
          >
            <Tab
              className={
                this.state.type == 1
                  ? classnames(classes.tab, classes.selectd)
                  : classes.tab
              }
              label={<FormattedMessage id="密码登录" />}
              value={1}
            />
            <Tab
              className={
                this.state.type == 0
                  ? classnames(classes.tab, classes.selectd)
                  : classes.tab
              }
              label={<FormattedMessage id="快捷登录" />}
              value={0}
            />
          </Tabs>

          <Grid container spacing={0} className={classes.tabContainer}>
            <Grid item xs={12} style={{ minHeight: 80 }}>
              {this.state.type === 0 ? (
                <Grid container>
                  <Grid item width={60}>
                    <SelectRC
                      options={options}
                      value={this.state.national_code}
                      onChange={this.SelectChange}
                      label={this.props.intl.formatMessage({
                        id: "区号",
                      })}
                    />
                  </Grid>
                  <Grid item style={{ flex: 1 }}>
                    <TextField
                      name="mobile"
                      fullWidth
                      value={this.state.mobile.value}
                      onChange={this.handleChange.bind(this, "mobile")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入手机号",
                      })}
                      helperText={this.state.mobile.msg}
                      error={Boolean(this.state.mobile.msg)}
                      label={this.props.intl.formatMessage({ id: "手机号" })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <TextField
                  name="email"
                  fullWidth
                  value={this.state.email.value}
                  onChange={this.handleChange.bind(this, "email")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入邮箱或手机号",
                  })}
                  error={Boolean(this.state.email.msg)}
                  helperText={this.state.email.msg}
                  label={this.props.intl.formatMessage({ id: "邮箱或手机号" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} style={{ minHeight: 80 }}>
              {this.state.type == 0 ? (
                <TextField
                  fullWidth
                  autoComplete="new-password"
                  value={this.state.verify_code.value}
                  onChange={this.changeStatus.bind(this, "verify_code")}
                  className={classes.verify_code}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入验证码",
                  })}
                  label={this.props.intl.formatMessage({ id: "验证码" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    maxLength: 6,
                  }}
                  error={Boolean(this.state.verify_code.msg)}
                  helperText={this.state.verify_code.msg}
                  InputProps={{
                    endAdornment: (
                      <VerfiCodeRC
                        value={
                          this.state.type === 0
                            ? this.state.email
                            : this.state.mobile
                        }
                        onClick={this.sendVerfiCode}
                        className={classes.verfCode}
                        variant="text"
                        ref={(ref) => (this.verfiCode = ref)}
                      />
                    ),
                  }}
                />
              ) : (
                <FormControl
                  className={classes.formControl}
                  aria-describedby="password-helper-text"
                  error={Boolean(this.state.password.msg)}
                >
                  {this.state.show ? (
                    <TextField
                      name="password"
                      value={this.state.password.value}
                      onChange={this.handleChange.bind(this, "password")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入密码",
                      })}
                      label={this.props.intl.formatMessage({ id: "密码" })}
                      InputProps={{
                        endAdornment: (
                          <Iconfont
                            type="unhidden"
                            onClick={() => {
                              this.setState({ show: false });
                            }}
                          />
                        ),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  ) : (
                    <TextField
                      name="password"
                      type="password"
                      value={this.state.password.value}
                      onChange={this.handleChange.bind(this, "password")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入密码",
                      })}
                      label={this.props.intl.formatMessage({ id: "密码" })}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        endAdornment: (
                          <Iconfont
                            type="hidden"
                            onClick={() => {
                              this.setState({ show: true });
                            }}
                          />
                        ),
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <FormHelperText id="password-helper-text">
                      {this.state.password.msg}
                    </FormHelperText>
                    <a
                      style={{ marginTop: "8px", fontSize: "12px" }}
                      href={
                        "/user/forgetpassword" +
                        (this.state.type == 1 ? "/email" : "/mobile")
                      }
                    >
                      {this.props.intl.formatMessage({ id: "忘记密码" })}
                    </a>
                  </div>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl
                className={classes.formControl}
                aria-describedby="password-helper-text"
              >
                {this.props.loading.effects["user/login_step1"] ||
                this.state.isopen2 ||
                this.state.isopen ? (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    className={classes.button}
                  >
                    <CircularProgress size={24} style={{ color: "#fff" }} />
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.formSubmit}
                  >
                    <FormattedMessage id="登录" />
                  </Button>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.link}>
                <div>
                  <FormattedMessage id="还没账号" />?{" "}
                  <Link to={route_map.register + window.location.search}>
                    <FormattedMessage id="免费注册" />
                  </Link>
                </div>
                <div style={{ margin: "10px 0 0" }}>
                  {this.props.index_config &&
                  this.props.index_config.shareConfig &&
                  this.props.index_config.shareConfig.openUrl ? (
                    <a
                      href={this.props.index_config.shareConfig.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {this.props.intl.formatMessage({
                        id: "立即下载客户端",
                      })}
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        <div className={classes.captchaWrapper}>
          {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.GOOGLE ? (
            <GoogleCaptcha
              style={{ marginTop: 10 }}
              ref={(ref) => (this.recaptcha = ref)}
              onSuccess={this.senseSuccess}
              onError={this.senseError}
            />
          ) : (
            <Sense
              type="2"
              geetestData={this.props.geetestData}
              dispatch={this.props.dispatch}
              lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
              onSuccess={this.senseSuccess}
              onError={this.senseError}
              onClose={this.senseClose}
              ref={(ref) => (this.recaptcha = ref)}
            />
          )}
        </div>
        <SecVerify
          userinfo={this.props.loginVerify}
          dispatch={this.props.dispatch}
          verifyType={2}
          n={2}
          requestId={this.props.loginVerify.requestId}
          loading={this.props.loading.effects["user/login_step2"]}
          isopen={this.state.isopen2}
          callback={this.success_step2}
          showCloseBtn={true}
          onCancel={this.onCancel}
        />
        <Dialog
          open={this.state.isopen3}
          fullScreen
          onClose={this.changeDialog("isopen3", false)}
        >
          <DialogContent>
            <FormControl
              className={classes.formControl}
              aria-describedby="password-helper-text"
              error={Boolean(this.state.password.msg)}
            >
              {this.state.show ? (
                <TextField
                  name="password"
                  value={this.state.password.value}
                  onChange={this.handleChange.bind(this, "password")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入密码",
                  })}
                  label={this.props.intl.formatMessage({ id: "密码" })}
                  InputProps={{
                    endAdornment: (
                      <Iconfont
                        type="unhidden"
                        onClick={() => {
                          this.setState({ show: false });
                        }}
                      />
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : (
                <TextField
                  name="password"
                  type="password"
                  value={this.state.password.value}
                  onChange={this.handleChange.bind(this, "password")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入密码",
                  })}
                  label={this.props.intl.formatMessage({ id: "密码" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <Iconfont
                        type="hidden"
                        onClick={() => {
                          this.setState({ show: true });
                        }}
                      />
                    ),
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <FormHelperText id="password-helper-text">
                  {this.state.password.msg}
                </FormHelperText>
                {/* 跳转到web */}
                <a
                  style={{ marginTop: "8px", fontSize: "12px" }}
                  href={
                    "/user/forgetpassword" +
                    (this.state.type == 1 ? "/email" : "/mobile")
                  }
                >
                  {this.props.intl.formatMessage({ id: "忘记密码" })}
                </a>
              </div>
            </FormControl>
            {this.props.loading.effects &&
            this.props.loading.effects["user/login_step2"] ? (
              <Button fullWidth disabled color="primary" variant="contained">
                <CircularProgress color="primary" size={20} />
              </Button>
            ) : (
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={this.success_step2}
              >
                {this.props.intl.formatMessage({ id: "确定" })}
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(Login));
