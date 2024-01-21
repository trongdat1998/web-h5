import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { parse } from "search-params";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  Radio,
  CircularProgress,
  Drawer,
  InputAdornment,
  Dialog,
} from "@material-ui/core";
import classnames from "classnames";

import { Iconfont, message } from "../../lib";
import VerfiCodeRC from "../public/verificationCode";
import Vali from "../../utils/validator";
import helper from "../../utils/helper";
import Sense from "../public/sense_captcha"; // 极验行为
import GoogleCaptcha from "../public/google_captcha"; // 谷歌验证
import CONST from "../../config/const";
import TextFieldCN from "../public/textfiled";

import style from "./bonus_register_style";

class BonusRegister extends React.Component {
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
      show: false,
      show2: false,
      search: "",
      register: false,
      step: 1,
      modal: false,
      drawStatus: 0,
      bonus_info: {
        id: "",
        redPacketId: "",
        senderUsername: "",
        themeId: "",
        backgroundUrl: "",
        slogan: "",
        receiverUsername: "",
        tokenId: "",
        tokenName: "",
        amount: "",
        created: "",
      },
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

    this.load = this.load.bind(this);
    this.draw = this.draw.bind(this);
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
      search: "",
      bonusImg: "",
    });
    this.verfiCode && this.verfiCode.reset();
  }
  SelectChange = (v) => {
    this.setState({
      national_code: v,
      anchor: false,
    });
  };
  componentDidMount() {
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
    if (this.parseSearch().from) {
      this.load();
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
      t.type == "radio"
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
    const { intl } = this.props;

    if (this.state.type == 1) {
      if (!email) {
        this.verfiCode.reset();
        this.setState({
          email: {
            status: "error",
            msg: (
              <React.Fragment>
                {intl.formatMessage({
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
                {intl.formatMessage({
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
                {intl.formatMessage({
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
              {intl.formatMessage({
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
  handleChange = (name, e) => {
    const v = e.target.value;
    if (name === "national_code") {
      let country = this.props.countries.filter((item) => item.id == v)[0];
      this.setState({
        country_id: v,
        [name]: country.nationalCode,
      });
    } else if (name === "search") {
      this.setState({
        search: v,
      });
    } else {
      this.setState({
        [name]: {
          value: v,
          msg: "",
        },
      });
    }
  };
  formSubmit(e) {
    const { intl, dispatch } = this.props;
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
                {intl.formatMessage({
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
                {intl.formatMessage({
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
                {intl.formatMessage({
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
                {intl.formatMessage({
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
              {intl.formatMessage({
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
              {intl.formatMessage({
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
              {intl.formatMessage({
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
              {intl.formatMessage({
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
              {intl.formatMessage({
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
              {intl.formatMessage({
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
              {intl.formatMessage({
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
      callback: true,
    };
    if (this.state.type == 1) {
      values.email = email;
    } else {
      values.mobile = mobile;
      values.national_code = this.state.national_code;
    }
    const search = this.parseSearch();
    const password = search.password;
    const that = this;
    dispatch({
      type: "user/register",
      payload: {
        ...values,
      },
      redirect: search ? search.redirect : "",
      history: this.props.history,
      callback: () => {
        // 预留调用领取新手红包接口
        dispatch({
          type: "user/openBonus",
          payload: {
            password,
          },
          callback: (res) => {
            if (res.code == "OK") {
              that.setState({
                bonus_info: res.data,
              });
              that.setState({
                modal: true,
                drawStatus: 1,
              });
            } else if (res.code == "34012") {
              that.setState({
                modal: true,
                drawStatus: 2,
              });
            }
          },
        });
      },
    });
  }
  toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({
      anchor: open,
    });
  };
  draw(w, h, img, img2, btn) {
    const { intl } = this.props;
    const angle = 0;
    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    // 文案
    ctx.font = "500 42px Noto Sans, Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(
      intl.formatMessage({ id: "小手一抖，红包到手" }),
      w / 2,
      (32 + 30) * 2
    );
    ctx.font = "normal 30px Noto Sans, Helvetica, Arial, sans-serif";
    ctx.fillText(
      intl.formatMessage(
        { id: "来自{name}的红包" },
        {
          name: this.parseSearch().from,
        }
      ),
      w / 2,
      (75 + 22) * 2
    );
    const pw = 186,
      ph = 204;
    ctx.drawImage(img2, (w - pw) / 2, 128 * 2, pw, ph);

    ctx.font = "bold 50px Noto Sans, Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#C67100";
    ctx.fillText(intl.formatMessage({ id: "打开" }), w / 2, (157 + 30) * 2);
    this.setState({ bonusImg: canvas.toDataURL() });
  }
  load() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    const img2 = new Image();
    img2.crossOrigin = "Anonymous";
    const img3 = new Image();
    img3.crossOrigin = "Anonymous";
    let c = 0;

    img.onload = () => {
      c++;
      if (c >= 3) {
        this.draw(750, 914, img, img2, img3);
      }
    };
    img2.onload = () => {
      c++;
      if (c >= 3) {
        this.draw(750, 914, img, img2, img3);
      }
    };
    img3.onload = () => {
      c++;
      if (c >= 3) {
        this.draw(750, 914, img, img2, img3);
      }
    };
    img.src = require("../../assets/bonus.png");
    img2.src = require("../../assets/open.png");
    img3.src = require("../../assets/bonus_em.png");
  }
  render() {
    const { classes, index_config, intl } = this.props;
    const n = window.n;
    let options = [];
    this.props.countries.map((item) => {
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
    options = options.filter(
      (item) =>
        item.search
          .toUpperCase()
          .indexOf((this.state.search || "").toUpperCase()) > -1
    );
    const search = this.parseSearch();
    const shareConfig = index_config.shareConfig || {};
    let invite_code =
      this.props.match.params.invite_code || search.invite_code || "";
    if (this.state.step == 1) {
      return (
        <div className={classes.step1}>
          <img
            className={classes.step1_logo}
            src={this.props.index_config.logo}
          />
          <p>{intl.formatMessage({ id: "100% 持币者共享的交易平台" })}</p>
          <div
            className={classnames(
              classes.bonus_bg,
              this.state.bonusImg ? classes.animation : ""
            )}
          >
            <img src={require("../../assets/bonus.png")} />
            <div className={classes.bonus}>
              <h2>{intl.formatMessage({ id: "小手一抖，红包到手" })}</h2>
              <p>
                {intl.formatMessage(
                  { id: "来自{name}的红包" },
                  {
                    name: this.parseSearch().from,
                  }
                )}
              </p>
            </div>
            <div
              className={classes.openBtn}
              onClick={() => {
                this.setState({ step: 2 });
              }}
            >
              <img src={require("../../assets/open.png")} />
              <p>{intl.formatMessage({ id: "打开" })}</p>
              <img className="em" src={require("../../assets/bonus_em.png")} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={classes.body}>
        <div className={classes.header}>
          <img src={require("../../assets/bonus_bg.png")} />
          <h2>{intl.formatMessage({ id: "快来领取红包" })}</h2>
          <p
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage(
                { id: "好友 {userName} <br/>​​邀请您加入{name}交易平台" },
                {
                  userName: this.parseSearch().from,
                  name: window.WEB_CONFIG.page
                    ? window.WEB_CONFIG.page.index
                    : "",
                }
              ),
            }}
          ></p>
        </div>
        <div className={classes.register}>
          <div className={classes.content}>
            <Tabs
              value={this.state.type}
              onChange={this.changeType}
              className={classes.tabs}
              classes={{
                indicator: classes.indicator,
              }}
              indicatorColor="primary"
            >
              <Tab
                value={0}
                classes={{
                  root: classes.tab,
                }}
                label={<FormattedMessage id="手机注册" />}
              />
              <Tab
                value={1}
                classes={{
                  root: classes.tab,
                }}
                label={<FormattedMessage id="邮箱注册" />}
              />
            </Tabs>

            <Grid container spacing={0} className={classes.tabContainer}>
              <Grid item xs={12} style={{ minHeight: 60 }}>
                {this.state.type === 0 ? (
                  <Grid container>
                    <Grid item style={{ width: `${100 / n}rem` }}>
                      <TextField
                        name="national_code"
                        value={this.state.national_code}
                        // onChange={this.SelectChange}
                        onClick={this.toggleDrawer(true)}
                        placeholder={intl.formatMessage({
                          id: "区号",
                        })}
                        autoComplete="off"
                        className={classes.inputRoot}
                        disabled
                        InputProps={{
                          endAdornment: (
                            <Iconfont
                              type="arrowDown"
                              size={`${24 / n}rem`}
                              style={{
                                color: "#ADB9D9",
                                marginRight: `${16 / n}rem`,
                              }}
                              onClick={() => {
                                this.setState({ show: false });
                              }}
                            />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item style={{ flex: 1 }}>
                      <TextField
                        name="mobile"
                        fullWidth
                        value={this.state.mobile.value}
                        onChange={this.handleChange.bind(this, "mobile")}
                        placeholder={intl.formatMessage({
                          id: "手机号码",
                        })}
                        autoComplete="off"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={classes.inputRoot}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <TextField
                    name="email"
                    fullWidth
                    value={this.state.email.value}
                    onChange={this.handleChange.bind(this, "email")}
                    placeholder={intl.formatMessage({
                      id: "邮箱",
                    })}
                    autoComplete="off"
                    error={Boolean(this.state.email.msg)}
                    helperText={this.state.email.msg}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={classes.inputRoot}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ minHeight: 60 }}>
                {this.state.show ? (
                  <TextField
                    name="password1"
                    fullWidth
                    value={this.state.password1.value}
                    onChange={this.handleChange.bind(this, "password1")}
                    placeholder={intl.formatMessage({
                      id: "请输入密码",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="unhidden"
                          size={`${24 / n}rem`}
                          onClick={() => {
                            this.setState({ show: false });
                          }}
                        />
                      ),
                    }}
                    autoComplete="off"
                    error={Boolean(this.state.password1.msg)}
                    helperText={this.state.password1.msg}
                    className={classes.inputRoot}
                  />
                ) : (
                  <TextField
                    name="password1"
                    type="password"
                    fullWidth
                    value={this.state.password1.value}
                    onChange={this.handleChange.bind(this, "password1")}
                    placeholder={intl.formatMessage({
                      id: "请输入密码",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="hidden"
                          size={`${24 / n}rem`}
                          style={{ color: "#D8DCE5" }}
                          onClick={() => {
                            this.setState({ show: true });
                          }}
                        />
                      ),
                    }}
                    autoComplete="off"
                    error={Boolean(this.state.password1.msg)}
                    helperText={this.state.password1.msg}
                    className={classes.inputRoot}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ minHeight: 60 }}>
                {this.state.show2 ? (
                  <TextField
                    name="password2"
                    fullWidth
                    value={this.state.password2.value}
                    onChange={this.handleChange.bind(this, "password2")}
                    placeholder={intl.formatMessage({
                      id: "确认密码",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="unhidden"
                          size={`${24 / n}rem`}
                          onClick={() => {
                            this.setState({ show2: false });
                          }}
                        />
                      ),
                    }}
                    autoComplete="off"
                    error={Boolean(this.state.password2.msg)}
                    helperText={this.state.password2.msg}
                    className={classes.inputRoot}
                  />
                ) : (
                  <TextField
                    name="password2"
                    type="password"
                    fullWidth
                    value={this.state.password2.value}
                    onChange={this.handleChange.bind(this, "password2")}
                    placeholder={intl.formatMessage({
                      id: "确认密码",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <Iconfont
                          type="hidden"
                          size={`${24 / n}rem`}
                          style={{ color: "#D8DCE5" }}
                          onClick={() => {
                            this.setState({ show2: true });
                          }}
                        />
                      ),
                    }}
                    autoComplete="off"
                    error={Boolean(this.state.password2.msg)}
                    helperText={this.state.password2.msg}
                    className={classes.inputRoot}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ minHeight: 60 }}>
                <TextField
                  fullWidth
                  autoComplete="new-password"
                  value={this.state.verify_code.value}
                  onChange={this.changeStatus.bind(this, "verify_code")}
                  placeholder={intl.formatMessage({
                    id: "验证码",
                  })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="off"
                  className={classes.inputRoot}
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
              <Grid item xs={12} style={{ minHeight: 60 }}>
                {invite_code ? (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    value={`${intl.formatMessage({ id: "邀请码" })}${
                      this.state.invite_code.value
                    }`}
                    error={Boolean(this.state.invite_code.msg)}
                    helperText={this.state.invite_code.msg}
                    placeholder={intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    disabled
                    InputLabelProps={{
                      shrink: true,
                    }}
                    className={classes.inputRoot}
                  />
                ) : (
                  <TextField
                    fullWidth
                    autoComplete="new-password"
                    value={this.state.invite_code.value}
                    error={Boolean(this.state.invite_code.msg)}
                    helperText={this.state.invite_code.msg}
                    onChange={this.changeStatus.bind(this, "invite_code")}
                    placeholder={intl.formatMessage({
                      id: window.WEB_CONFIG.checkInviteCode
                        ? "邀请码"
                        : "邀请码(选填)",
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    className={classes.inputRoot}
                  />
                )}
              </Grid>
              <Grid item xs={12} style={{ minHeight: 38 }}>
                <div className={classes.checkbox}>
                  <Radio
                    color="primary"
                    checked={this.state.agreement.value}
                    onClick={this.changeStatus.bind(this, "agreement")}
                    style={{ padding: 0 }}
                    // checkedIcon={<Iconfont type="levelcheck" size="28" />}
                  />
                  {intl.formatMessage({ id: "我已阅读并同意" })}{" "}
                  <a
                    href={this.props.index_config.userAgreement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {intl.formatMessage({ id: "服务协议" })}
                  </a>{" "}
                  <a
                    href={this.props.index_config.privacyAgreement}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {intl.formatMessage({ id: "隐私协议" })}
                  </a>
                </div>
                <div className={classes.msg}>
                  <span>{this.state.agreement.msg}</span>
                </div>
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
                      color="secondary"
                      disabled
                      className={classes.button}
                    >
                      <CircularProgress
                        size={`${24 / n}rem`}
                        style={{ color: "#D8DCE5" }}
                      />
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      onClick={this.formSubmit}
                    >
                      <FormattedMessage id="完成并领取" />
                    </Button>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
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
                  lang={window.localStorage.lang === "zh-cn" ? "zh-cn" : "en"}
                  dispatch={this.props.dispatch}
                  geetestData={this.props.geetestData}
                  onSuccess={this.senseSuccess}
                  onError={this.senseError}
                  onClose={this.senseClose}
                  ref={(ref) => (this.recaptcha = ref)}
                />
              )}
            </div>
          </div>
          <Drawer
            anchor="left"
            open={this.state.anchor}
            onClose={this.toggleDrawer(false)}
            onOpen={this.toggleDrawer(true)}
            classes={{
              paper: classes.drawer_modal,
            }}
          >
            <div>
              <div className={classes.search_area}>
                <TextFieldCN
                  placeholder={intl.formatMessage({
                    id: "国家/地区",
                  })}
                  name="search"
                  autoComplete="off"
                  value={this.state.search}
                  onChange={this.handleChange.bind(this, "search")}
                  InputProps={{
                    classes: { root: classes.inputHeight },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconfont type="search" size={`${24 / n}rem`} />
                      </InputAdornment>
                    ),
                  }}
                />
                <span onClick={this.toggleDrawer(false)}>
                  {intl.formatMessage({ id: "取消" })}
                </span>
              </div>
              <ul className={classes.drawer}>
                {options.map((item, index) => {
                  const n = item.value.split("/");
                  return (
                    <li
                      key={index}
                      onClick={this.SelectChange.bind(this, item.label)}
                    >
                      <span>{n[1]}</span>
                      <span>{n[0]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Drawer>
        </div>
        <Dialog open={this.state.modal} classes={{ paper: classes.paper }}>
          <Iconfont
            type="levellimited"
            size={`${28 / n}rem`}
            onClick={() => {
              this.setState({ modal: false });
            }}
            className={classes.closeBtn}
          />
          {this.state.drawStatus == 1 ? (
            <div className={classes.opened}>
              <p className="info">
                {this.state.bonus_info.senderUsername}
                <br />
                {intl.formatMessage({ id: "发送的红包" })}
              </p>
              <p className="desc">
                {intl.formatMessage({ id: "恭喜发财，万事如意！" })}
              </p>
              <div className={classes.line}></div>
              <h3>
                {this.state.bonus_info.amount}
                {this.state.bonus_info.tokenName}
              </h3>
              <strong>{intl.formatMessage({ id: "已转入你的资产" })}</strong>
              <a
                href={
                  "/activity/hb/info?id=" +
                  this.state.bonus_info.redPacketId +
                  "&novice=1"
                }
              >
                {intl.formatMessage({ id: "查看详情" })}
              </a>
            </div>
          ) : this.state.drawStatus == 2 ? (
            <div className={classnames(classes.opened, classes.looted)}>
              <img src={require("../../assets/looted.png")} />
              <div className={classes.line}></div>
              <h3>{intl.formatMessage({ id: "来晚了" })}</h3>
              <strong>{intl.formatMessage({ id: "红包被人抢完了" })}</strong>
              <a
                href={shareConfig.openUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl.formatMessage({ id: "下载APP" })}
              </a>
              <p
                style={{
                  color: "#FCE5CB",
                  fontSize: `${12 / n}rem`,
                  marginTop: `${10 / n}rem`,
                }}
              >
                {intl.formatMessage({ id: "请去APP查看详情" })}
              </p>
            </div>
          ) : (
            ""
          )}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(BonusRegister));
