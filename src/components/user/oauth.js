// 授权登录
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
  FormControl,
  FormHelperText,
  Input,
  CircularProgress,
  Paper,
} from "@material-ui/core";
import qs from "querystring";

import { message, Iconfont } from "../../lib";
import route_map from "../../config/route_map";
import Sense from "../public/sense_captcha"; // 极验行为
import GoogleCaptcha from "../public/google_captcha"; // google captcha
import SecVerify from "../public/secVerify_login"; // 二次验证
import Vali from "../../utils/validator";
import CONST from "../../config/const";

import style from "./login_style";

class OAuthLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      type: 0, // 1邮箱 or 0手机注册
      sendVerfiCode: false,
      isopen: false, // 人机layer
      isopen2: false, // 二次验证layer
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
      country_id: "1",
      national_code: "86",
      country_name: "",

      response_type: "",
      client_id: "",
      redirect_uri: "",
      state: "",
      scope: "",
      params: false,
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
    this.senseNextWillShow = this.senseNextWillShow.bind(this);
  }
  componentDidMount() {
    const search = window.location.search.replace("?", "");
    const query = qs.decode(search);
    const response_type = query.responseType;
    const client_id = query.appId;
    const redirect_uri = query.redirectUri;
    const state = query.state;
    const scope = query.scope;
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
        national_code:
          this.props.areacode[window.localStorage.lang] ||
          this.state.national_code,
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
  onCancel() {
    this.setState({
      isopen2: false,
    });
  }
  // 提交二次验证结果，进行登录
  success_step2(obj) {
    let values = {
      mobile: this.state.mobile.value,
      password: this.state.password.value,
      email: this.state.email.value,
    };
    if (this.state.type == 0) {
      delete values.mobile;
    } else {
      delete values.email;
      values.national_code = this.state.national_code;
    }
    values.type = 1;

    values.request_id = this.props.loginVerify.requestId;
    values.auth_type = obj.auth_type;
    values.order_id = this.props.order_id;
    values.verify_code = obj.verify_code;

    values.url = "login_step2";

    // oauth
    values.is_oauth = true;
    values.oauth_request_id = this.props.oauth.requestId;

    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";

    try {
      this.props.dispatch({
        type: "user/login_step2",
        payload: values,
        redirect: search ? this.state.redirect_uri : "",
        path: this.props.location.state ? this.props.location.state.path : "",
        history: this.props.history,
        errorCallback: this.step2_fail,
      });
    } catch (err) {
      this.step2_fail();
    }
  }
  step2_fail = (msg) => {
    this.setState(
      {
        isopen2: false,
        isopen: false,
      },
      () => {
        msg && message.error(msg);
      }
    );
  };
  /**
   * login_step1 返回的数据，然后进行二次验证
   */
  login_step2() {
    this.setState({
      isopen2: true,
      isopen: false,
    });
  }
  dropchange(v) {
    const d = v.value.split("-");
    this.setState({
      national_code: d[0],
      country_name: d[1],
    });
  }
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

  areaCodeChange(value, prevValue, allValues) {
    const d = (value || "").split("-");
    return d[0];
  }
  // 验证表单
  verifyForm() {
    const email = this.state.email.value;
    const mobile = this.state.mobile.value;
    const password = this.state.password.value;

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
      if (!Vali.isEmail(email)) {
        this.setState({
          email: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "无效的邮箱地址",
            }),
            value: this.state.email.value,
          },
        });
        return false;
      }
    }
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
      if (this.state.national_code == 86 && !/^1[3456789]\d{9}$/.test(mobile)) {
        this.setState({
          mobile: {
            status: "error",
            msg: this.props.intl.formatMessage({
              id: "无效的手机",
            }),
            value: this.state.mobile.value,
          },
        });
        return false;
      }
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

    return true;
  }
  login_step1_fail(code, msg) {
    //this.grecaptchaReset();
    this.recaptcha.reset();
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
    this.setState({
      isopen: false,
    });
    let values = {
      mobile: this.state.mobile.value,
      password: this.state.password.value,
      email: this.state.email.value,
      captcha_response,
      captcha_id,
      challenge,
    };
    if (this.state.type == 1) {
      delete values.mobile;
    } else {
      delete values.email;
      values.national_code = this.state.national_code;
    }
    values.type = 1;
    values.url = this.state.type == 1 ? "login" : "login_mobile";
    values.is_oauth = true;
    values.oauth_request_id = this.props.oauth.requestId;
    let search = this.props.location.search;
    search = search ? search.replace("?", "") : "";

    this.props.dispatch({
      type: "user/login_step1",
      payload: {
        ...values,
      },
      redirect: search ? parse(search)["redirect"] : "",
      success: this.login_step2,
      fail: this.login_step1_fail,
      history: this.props.history,
    });
  }
  // 极验 失败
  senseError(err) {
    this.setState({
      isopen: false,
    });
    message.error(err.msg);
  }
  // 极验，用户关闭
  senseClose() {
    this.setState({
      isopen: false,
    });
  }
  senseNextWillShow() {}
  formSubmit(e) {
    e && e.preventDefault();
    let verifyResut = this.verifyForm();
    if (!verifyResut) return;

    // 调用极验
    this.setState({
      isopen: true,
    });
    this.recaptcha.sense();
  }
  SelectChange = (v) => {
    this.setState({
      national_code: v,
    });
  };
  render() {
    let options = [];
    (this.props.countries || []).map((item) => {
      options.push(
        <option value={item.id} key={item.id}>
          {"+" + item.nationalCode + " " + item.countryName}
        </option>
      );
    });
    const { classes } = this.props;
    return (
      <div className={classes.login}>
        <div className={classes.content}>
          <h1>
            <FormattedMessage id="授权并登录" />
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
            id="form-login"
          >
            <Grid container spacing={0} className={classes.tabContainer}>
              <Grid item xs={12} style={{ minHeight: 80 }}>
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
              <Grid item xs={12} style={{ minHeight: 80 }}>
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
                            type="hidden"
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
                            type="unhidden"
                            onClick={() => {
                              this.setState({ show: true });
                            }}
                          />
                        ),
                      }}
                    />
                  )}
                  <FormHelperText id="password-helper-text">
                    {this.state.password.msg}
                  </FormHelperText>
                </FormControl>
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
                  ) : this.state.params ? (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={this.formSubmit}
                    >
                      <FormattedMessage id="登录" />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      disabled
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
                    <Link
                      to={route_map.oauth_register + window.location.search}
                    >
                      <FormattedMessage id="免费注册" />
                    </Link>
                  </div>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {CONST.CAPTCHA_TYPE == CONST.CAPTCHA_TYPES.GOOGLE ? (
            <GoogleCaptcha
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
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(OAuthLogin));
