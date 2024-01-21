// 注册
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
  Select,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  Paper,
} from "@material-ui/core";
import VerfiCodeRC from "../public/verificationCode";
import qs from "querystring";
import route_map from "../../config/route_map";
import { Iconfont, message } from "../../lib";
import CONST from "../../config/const";
import Vali from "../../utils/validator";
import helper from "../../utils/helper";
import Sense from "../public/sense_captcha"; // 极验行为
import GoogleCaptcha from "../public/google_captcha"; // google captcha

import style from "./login_style";

class OAuthRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      isopen: false, // google 人机验证layer
      type: 0, // 邮箱 or 手机注册
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
      password1: {
        status: "",
        msg: "",
        value: "",
      },
      password2: {
        status: "",
        msg: "",
        value: "",
      },
      agreement: {
        status: "",
        msg: "",
        value: false,
      },
      mobile: {
        status: "",
        msg: "",
        value: "",
      },
      verify_code: {
        status: "",
        msg: "",
        value: "",
      },
      invite_code: {
        status: "",
        msg: "",
        value: "",
      },
      country_id: "1",
      national_code: "86",
      country_name: "",
      hidelogin: 0,
    };
    this.formSubmit = this.formSubmit.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.areaCodeChange = this.areaCodeChange.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.changeType = this.changeType.bind(this);
    this.dropchange = this.dropchange.bind(this);
    this.getResponse = this.getResponse.bind(this);

    // 极验
    this.senseSuccess = this.senseSuccess.bind(this);
    this.senseError = this.senseError.bind(this);
    this.senseClose = this.senseClose.bind(this);
    this.senseNextWillShow = this.senseNextWillShow.bind(this);
  }
  // google recaptcha success
  getResponse(token) {
    this.setState({
      isopen: false,
    });
    this.sendVerfiCode();
  }
  dropchange(v) {
    const d = v.value.split("-");
    this.setState({
      national_code: d[0],
      country_name: d[1],
    });
  }
  parseSearch = (url) => {
    let search = (url || this.props.location.search).replace("?", "");
    search = parse(search);
    return search;
  };
  changeType(e, n) {
    this.setState({
      type: n,
      sendVerfiCode: false,
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
      password1: {
        status: "",
        msg: "",
        value: "",
      },
      password2: {
        status: "",
        msg: "",
        value: "",
      },
      agreement: {
        status: "",
        msg: "",
        value: false,
      },
      mobile: {
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
    this.verfiCode && this.verfiCode.reset();
  }
  componentDidMount() {
    /**
     * 注册地址的邀请码支持3种方式
     * 1、 /register/123456
     * 2、 /register?invite_code=123456
     * 3、 /register?redirect=http%3A%2F%2Flocalhost%3A3001%2Fm%2Fguild%2Fhome%3Finvite_code%3D123456
     */
    const search = this.parseSearch();
    let invite_code =
      this.props.match.params.invite_code || search.invite_code || "";
    if (search.redirect) {
      const s = decodeURIComponent(search.redirect);
      const code = s.match(/invite_code\=([^&]{0,})/);
      if (code && code[1]) {
        invite_code = code[1];
      }
    }
    const hidelogin = search.hidelogin || 0;
    this.setState({
      invite_code: {
        status: "",
        msg: "",
        value: invite_code,
      },
      hidelogin,
      national_code:
        this.props.areacode[window.localStorage.lang] ||
        this.state.national_code,
    });

    const search2 = window.location.search.replace("?", "");
    const query = qs.decode(search2);
    const response_type = query.responseType;
    const client_id = query.appId;
    const redirect_uri = query.redirectUri;
    const state = query.state;
    const scope = query.scope || "";
    if (!response_type || !client_id || !redirect_uri || !state) {
      message.info(this.props.intl.formatMessage({ id: "参数错误" }));
    }

    this.setState(
      {
        type:
          typeof window.localStorage.resetpwdType === "undefined"
            ? 0
            : Number(window.localStorage.resetpwdType),
        response_type,
        client_id,
        redirect_uri,
        state,
        scope,
        params: Boolean(response_type && client_id && redirect_uri && state),
      },
      () => {
        if (this.state.params) {
          this.props.dispatch({
            type: "user/oauth2_authorize",
            payload: {
              response_type,
              client_id,
              redirect_uri,
              state,
              scope,
            },
          });
        }
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.countries.length != nextProps.countries.length) {
      let national_code =
        this.props.areacode[window.localStorage.lang] ||
        this.state.national_code;
      let country = nextProps.countries.filter(
        (item) => item.nationalCode == national_code
      )[0];
      this.setState({
        country_id: country.id,
      });
    }
  }
  componentWillUnmount() {}
  changeStatus(n, e) {
    let t = e.target;
    // n == email or n == mobile 时，需要重置google recaptcha 和 验证码
    if (n === "email" || n === "mobile") {
      this.recaptcha.reset();
      this.verfiCode.reset();
      this.setState({
        sendVerfiCode: false,
        verify_code: {
          status: "",
          msg: "",
          value: "",
        },
      });
    }
    let value =
      t.type == "checkbox"
        ? !this.state.agreement.value
        : helper.removeEmoji(t.value.replace(/\s/g, ""));
    this.setState({
      [n]: {
        status: "",
        msg: "",
        value,
      },
    });
  }
  areaCodeChange(value, prevValue, allValues) {
    const d = (value || "").split("-");
    return d[0];
  }
  // 发送验证码
  sendVerfiCode(e) {
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;

    if (this.state.type == 1) {
      if (!email) {
        this.verfiCode.reset();
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
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
      if (!Vali.isEmail(email)) {
        this.verfiCode.reset();
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
                {this.props.intl.formatMessage({
                  id: "无效的邮箱地址",
                })}
              </React.Fragment>
            ),
            value: this.state.email.value,
          },
        });
        return;
      }
    } else {
      if (!mobile) {
        this.verfiCode.reset();
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
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
              <Iconfont type="exclamation-circle" />
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
    });
    this.recaptcha.sense();
  }
  // 极验，验证成功
  senseSuccess({ captcha_response, captcha_id, challenge }) {
    this.setState(
      {
        sendVerfiCode: true,
        verify_code: {
          status: "",
          msg: "",
          value: "",
        },
        isopen: false,
      },
      () => {
        let data = {
          type: 1, // 注册
          national_code: this.state.national_code,
          mobile: this.state.mobile.value,
          captcha_response,
          captcha_id,
          challenge,
        };
        if (this.state.type == 1) {
          delete data.mobile;
          delete data.national_code;
          data.email = this.state.email.value;
        }
        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          errorCallback: () => {
            this.verfiCode.reset();
          }, // 验证码错误回调
        });
        this.recaptcha.reset();
      }
    );
  }
  // 极验 失败
  senseError(err) {
    this.setState({
      isopen: false,
    });
    this.verfiCode.reset();
    message.error(err.msg);
  }
  // 极验，用户关闭
  senseClose() {
    this.setState({
      isopen: false,
    });
    this.verfiCode.reset();
  }
  senseNextWillShow() {}
  handleChange = (name, e) => {
    if (name === "national_code") {
      let country = this.props.countries.filter(
        (item) => item.id == e.target.value
      )[0];
      this.setState({
        country_id: e.target.value,
        [name]: country.nationalCode,
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
  formSubmit(e) {
    e && e.preventDefault();

    const email = this.state.email.value;
    const verify_code = this.state.verify_code.value;
    const mobile = this.state.mobile.value;
    const password1 = this.state.password1.value;
    const password2 = this.state.password2.value;

    if (this.state.type == 1) {
      if (!email) {
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
                {this.props.intl.formatMessage({
                  id: "此项不能为空",
                })}
              </React.Fragment>
            ),
            value: email,
          },
        });
        return;
      }
      if (!Vali.isEmail(email)) {
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
                {this.props.intl.formatMessage({
                  id: "无效的邮箱地址",
                })}
              </React.Fragment>
            ),
            value: email,
          },
        });
        return;
      }
    }
    if (this.state.type == 0) {
      if (!mobile) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
                {this.props.intl.formatMessage({
                  id: "此项不能为空",
                })}
              </React.Fragment>
            ),
            value: mobile,
          },
        });
        return;
      }
      if (this.state.national_code == 86 && !/^1[3456789]\d{9}$/.test(mobile)) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                <Iconfont type="exclamation-circle" />
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
    }

    if (!password1) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
          value: password1,
        },
      });
      return;
    }
    // 密码 大于 8位，
    if (
      password1.length < 8 ||
      password1.length > 20 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password1)
    ) {
      this.setState({
        password1: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "密码8-20位字符，必须包含大小写字母和数字",
              })}
            </React.Fragment>
          ),
          value: password1,
        },
      });
      return;
    }
    if (password2 != password1) {
      this.setState({
        password2: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "两次密码输入不一致",
              })}
            </React.Fragment>
          ),
          value: password2,
        },
      });
      return;
    }
    if (!this.state.sendVerfiCode) {
      this.setState({
        verify_code: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
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
    if (!verify_code) {
      this.setState({
        verify_code: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "此项不能为空",
              })}
            </React.Fragment>
          ),
          value: verify_code,
        },
      });
      return;
    }
    if (!/^\d{6}$/.test(verify_code)) {
      this.setState({
        verify_code: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "验证码错误",
              })}
            </React.Fragment>
          ),
          value: verify_code,
        },
      });
      return;
    }
    if (!this.state.agreement.value) {
      this.setState({
        agreement: {
          status: "error",
          msg: (
            <React.Fragment>
              <Iconfont type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "请阅读并同意服务协议",
              })}
            </React.Fragment>
          ),
          value: this.state.agreement.value,
        },
      });
      return;
    }
    let values = {
      verify_code,
      password1,
      password2,
      invite_code: this.state.invite_code.value,
      type: 1 - this.state.type,
      order_id: this.props.order_id,
    };
    if (this.state.type == 1) {
      values.email = email;
    } else {
      values.mobile = mobile;
      values.national_code = this.state.national_code;
    }
    values.is_oauth = true;
    values.oauth_request_id = this.props.oauth.requestId;
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";
    this.props.dispatch({
      type: "user/register",
      payload: {
        ...values,
      },
      redirect: search ? parse(search)["redirect"] : "",
      history: this.props.history,
      errorCallback: this.step2_fail,
    });
  }
  step2_fail = (msg) => {
    msg && message.error(msg);
  };
  SelectChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  render() {
    const { classes } = this.props;
    let options = [];
    this.props.countries.map((item) => {
      options.push(
        <option value={item.id} key={item.id}>
          {"+" + item.nationalCode + " " + item.countryName}
        </option>
      );
    });
    const search = this.parseSearch();
    let invite_code =
      this.props.match.params.invite_code || search.invite_code || "";
    return (
      <div className={classes.login}>
        <div className={classes.content}>
          <h1>
            <FormattedMessage id="注册并授权" />{" "}
            {this.props.oauth.brokerName || ""}
          </h1>
          <Tabs
            value={this.state.type}
            onChange={this.changeType}
            className={classes.tabs}
            indicatorColor="primary"
          >
            <Tab
              className={
                this.state.type == 0
                  ? classnames(classes.tab, classes.selectd)
                  : classes.tab
              }
              label={<FormattedMessage id="手机" />}
            />
            <Tab
              className={
                this.state.type == 1
                  ? classnames(classes.tab, classes.selectd)
                  : classes.tab
              }
              label={<FormattedMessage id="邮箱" />}
            />
          </Tabs>
          <form
            className={classes.form}
            onSubmit={this.formSubmit}
            autoComplete="off"
          >
            <Grid container spacing={0} className={classes.tabContainer}>
              <Grid item xs={12} style={{ minHeight: 68 }}>
                {this.state.type === 0 ? (
                  <FormControl
                    className={classes.formControl}
                    aria-describedby="mobile-helper-text"
                    error={Boolean(this.state.mobile.msg)}
                  >
                    <Input
                      name="mobile"
                      value={this.state.mobile.value}
                      onChange={this.handleChange.bind(this, "mobile")}
                      placeholder={this.props.intl.formatMessage({
                        id: "请输入手机号",
                      })}
                      startAdornment={
                        <Select
                          name="national_code"
                          native
                          value={this.state.country_id}
                          onChange={this.handleChange.bind(
                            this,
                            "national_code"
                          )}
                          className={classes.national_code}
                        >
                          {options}
                        </Select>
                      }
                    />
                    <FormHelperText id="mobile-helper-text">
                      {this.state.mobile.msg}
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <TextField
                    name="email"
                    fullWidth
                    value={this.state.email.value}
                    onChange={this.handleChange.bind(this, "email")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入邮箱",
                    })}
                    error={Boolean(this.state.email.msg)}
                    helperText={this.state.email.msg}
                    label={this.props.intl.formatMessage({ id: "邮箱" })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ minHeight: 68 }}>
                <TextField
                  name="password1"
                  type="password"
                  fullWidth
                  value={this.state.password1.value}
                  onChange={this.handleChange.bind(this, "password1")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入密码",
                  })}
                  label={this.props.intl.formatMessage({ id: "密码" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(this.state.password1.msg)}
                  helperText={this.state.password1.msg}
                />
              </Grid>
              <Grid item xs={12} style={{ minHeight: 68 }}>
                <TextField
                  name="password2"
                  type="password"
                  fullWidth
                  value={this.state.password2.value}
                  onChange={this.handleChange.bind(this, "password2")}
                  placeholder={this.props.intl.formatMessage({
                    id: "请输入确认密码",
                  })}
                  label={this.props.intl.formatMessage({ id: "确认密码" })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(this.state.password2.msg)}
                  helperText={this.state.password2.msg}
                />
              </Grid>
              <Grid item xs={12} style={{ minHeight: 68 }}>
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
              </Grid>
              <Grid item xs={12} style={{ minHeight: 68 }}>
                {invite_code ? (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    value={this.state.invite_code.value}
                    error={Boolean(this.state.invite_code.msg)}
                    helperText={this.state.invite_code.msg}
                    placeholder={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    disabled
                    label={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    error={Boolean(this.state.invite_code.msg)}
                    helperText={this.state.invite_code.msg}
                    value={this.state.invite_code.value}
                    onChange={this.changeStatus.bind(this, "invite_code")}
                    placeholder={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    label={this.props.intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ minHeight: 48 }}>
                <div className={classes.checkbox}>
                  <Checkbox
                    color="primary"
                    checked={this.state.agreement.value}
                    onChange={this.changeStatus.bind(this, "agreement")}
                    style={{ padding: "4px 4px 4px 0" }}
                  />
                  {this.props.intl.formatMessage({ id: "我已阅读并同意" })}{" "}
                  <a
                    href={this.props.index_config.userAgreement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.props.intl.formatMessage({ id: "服务协议" })}
                  </a>{" "}
                  <a
                    href={this.props.index_config.privacyAgreement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.props.intl.formatMessage({ id: "隐私协议" })}
                  </a>
                </div>
                <div className={classes.forgetpwd}>
                  <span>{this.state.agreement.msg}</span>
                </div>
              </Grid>
              <Grid item xs={12} className={classes.oauth_info}>
                {this.props.oauth.appName ? (
                  <p>
                    {this.props.oauth.appName}
                    {this.props.intl.formatMessage({ id: "将获得以下权限" }) +
                      ":"}
                  </p>
                ) : (
                  ""
                )}
                {this.props.oauth.functions &&
                this.props.oauth.functions.length ? (
                  <Paper>
                    <ul>
                      {(this.props.oauth.functions || []).map((item) => {
                        return (
                          <li id={item.id} key={item.id}>
                            {item.name}
                          </li>
                        );
                      })}
                    </ul>
                  </Paper>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  className={classes.formControl}
                  aria-describedby="password-helper-text"
                >
                  {this.props.loading.effects["user/register"] ||
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
                      <FormattedMessage id="注册" />
                    </Button>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.link}>
                  {Boolean(this.state.hidelogin) ? (
                    ""
                  ) : (
                    <div>
                      <FormattedMessage id="已有账号" />?{" "}
                      <Link to={route_map.oauth + window.location.search}>
                        <FormattedMessage id="登录" />
                      </Link>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </form>
        </div>

        {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.GOOGLE ? (
          <GoogleCaptcha
            style={{ marginTop: 10 }}
            ref={(ref) => (this.recaptcha = ref)}
            onSuccess={this.senseSuccess}
            onError={this.senseError}
          />
        ) : (
          <Sense
            type="1"
            geetestData={this.props.geetestData}
            dispatch={this.props.dispatch}
            lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
            onSuccess={this.senseSuccess}
            onError={this.senseError}
            onClose={this.senseClose}
            onNextWillShow={this.senseNextWillShow}
            ref={(ref) => (this.recaptcha = ref)}
          />
        )}
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(OAuthRegister));
