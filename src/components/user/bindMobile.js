// 绑定二次验证，email，ga，mobile
import React from "react";
import { Link } from "dva/router";
import { FormattedMessage, injectIntl } from "react-intl";
import route_map from "../../config/route_map";
import { Input, Button, Dropdown, Icon } from "../../lib";
import VerfiCodeRC from "../public/verificationCode";
import classnames from "classnames";
import gs from "../../lib/css/public.less";
import s from "./style.less";
import helper from "../../utils/helper";

class UserCenterBindMobile extends React.Component {
  constructor() {
    super();
    this.state = {
      country_id: "1",
      national_code: "86",
      sendVerfiCode: false, // email发送验证码按钮点击状态
      sendMobileVerfiCode: false, // mobile发送验证码按钮点击状态
      mobile: {
        value: "",
        msg: ""
      },
      mobileCode: {
        value: "",
        msg: ""
      },
      emailCode: {
        value: "",
        msg: ""
      }
    };
    this.changeStatus = this.changeStatus.bind(this);
    this.sendVerfiCode = this.sendVerfiCode.bind(this);
    this.bindMobile = this.bindMobile.bind(this);
    this.dropchange = this.dropchange.bind(this);
  }
  componentDidMount() {}
  dropchange(n, v) {
    // const d = v.value.split("-");
    // this.setState({
    //   national_code: d[0],
    //   country_name: d[1]
    // });
    let country = this.props.countries.filter(
      item => item.id == v.value
    )[0];
    this.setState({
      national_code: country.nationalCode,
      country_name: country.countryName
    });
  }
  // 发送验证码
  sendVerfiCode(order_id_name) {
    const type = this.props.match.params.type.toLowerCase();
    if (order_id_name === "mobile_order_id") {
      if (!this.state.mobile.value) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                <Icon type="exclamation-circle" />
                {this.props.intl.formatMessage({
                  id: "此项不能为空"
                })}
              </React.Fragment>
            ),
            value: ""
          }
        });
        this.verfiCode.reset();
        return;
      }
      if (
        this.state.national_code === "86" &&
        !/^1[3456789]\d{9}$/.test(this.state.mobile.value)
      ) {
        this.setState({
          mobile: {
            status: "error",
            msg: (
              <React.Fragment>
                <Icon type="exclamation-circle" />
                {this.props.intl.formatMessage({
                  id: "无效的手机"
                })}
              </React.Fragment>
            ),
            value: ""
          }
        });
        this.verfiCode.reset();
        return;
      }
    }
    this.setState(
      {
        [order_id_name ? "sendMobileVerfiCode" : "sendVerfiCode"]: true
      },
      () => {
        let data = {};

        if (order_id_name) {
          data.mobile = this.state.mobile.value;
          data.national_code = this.state.national_code;
        } else {
          data.email = this.props.userinfo.email;
        }
        data.type = 5;

        this.props.dispatch({
          type: "layout/get_verify_code",
          payload: data,
          n: data.mobile ? 0 : 1,
          order_id_name: order_id_name || "order_id",
          errorCallback: () => {
            this.setState({
              [order_id_name ? "sendMobileVerfiCode" : "sendVerfiCode"]: false
            });
            if (order_id_name) {
              this.verfiCode.reset();
            } else {
              this.verfiCode2.reset();
            }
          } // 验证码错误回调
        });
      }
    );
  }
  changeStatus(n, e) {
    const t = e.target;
    if (n === "mobile") {
      this.verfiCode.reset();
      this.setState({
        sendMobileVerfiCode: false,
        mobileCode: {
          value: "",
          msg: ""
        }
      });
    }
    this.setState({
      [n]: {
        msg: "",
        value: helper.removeEmoji(t.value.replace(/\s/g, ""))
      }
    });
  }

  // 绑定
  bindMobile() {
    // 请获取手机验证码
    if (!this.state.sendMobileVerfiCode) {
      this.setState({
        mobileCode: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "请获取验证码"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode.reset();
      return;
    }
    // 请获取邮箱验证码
    if (!this.state.sendVerfiCode) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "请获取验证码"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode.reset();
      return;
    }
    // 请输入手机号
    if (!this.state.mobile.value) {
      this.setState({
        mobile: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "此项不能为空"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode.reset();
      return;
    }
    // 请输入正确的手机号
    if (
      this.state.national_code === "86" &&
      !/^1[3456789]\d{9}$/.test(this.state.mobile.value)
    ) {
      this.setState({
        mobile: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "无效的手机"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode.reset();
      return;
    }
    // 手机验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.mobileCode.value)) {
      this.setState({
        mobileCode: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "验证码错误"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode.reset();
      return;
    }

    // 请输入邮箱验证码
    if (!this.state.emailCode.value) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "请输入验证码"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode2.reset();
      return;
    }
    // 邮箱验证码不正确
    if (!/^[a-z0-9A-Z]{6,8}$/.test(this.state.emailCode.value)) {
      this.setState({
        emailCode: {
          status: "error",
          msg: (
            <React.Fragment>
              <Icon type="exclamation-circle" />
              {this.props.intl.formatMessage({
                id: "验证码错误"
              })}
            </React.Fragment>
          ),
          value: ""
        }
      });
      this.verfiCode2.reset();
      return;
    }

    this.props.dispatch({
      type: "user/bind_mobile",
      payload: {
        national_code: this.state.national_code,
        mobile: this.state.mobile.value,
        mobile_order_id: this.props.mobile_order_id,
        mobile_verify_code: this.state.mobileCode.value,
        order_id: this.props.order_id,
        verify_code: this.state.emailCode.value
      },
      history: this.props.history
    });
  }

  render() {
    if (this.props.userinfo.bindMobile) {
      return (
        <div className={s.bind}>
          {this.props.intl.formatMessage({
            id: "手机已绑定"
          })}
        </div>
      );
    }
    let options = [];
    this.props.countries.map(item => {
      options.push({
        label: (
          <React.Fragment>
            <span>{item.countryName}</span>
            <i>{item.nationalCode}</i>
          </React.Fragment>
        ),
        value: item.id
      });
    });
    const selected = {
      label: "+" + this.state.national_code,
      value: this.state.country_id
    };
    return (
      <div className={gs.g_layout}>
        <div className={gs.g_path}>
          <Link to={route_map.user_center}>
            <Icon type="left" />
            <FormattedMessage id="手机" />
          </Link>
        </div>
        <div className={gs.g_title}>
          <FormattedMessage id="绑定手机验证" />
        </div>
        <div className={gs.g_content}>
          <div className={s.bind}>
            <div className={gs.g_form}>
              <div className={gs.g_formItem}>
                <label className={gs.g_formLabel}>
                  <FormattedMessage id="手机号" />
                </label>
                <div className={classnames(gs.g_formContent, s.mobile)}>
                  <div className={s.selectbox}>
                    <Dropdown
                      className={s.select}
                      options={options}
                      value={selected}
                      onChange={this.dropchange.bind(this, "country")}
                    />
                  </div>
                  <Input
                    autoComplete="new-password"
                    value={this.state.mobile.value}
                    onChange={this.changeStatus.bind(this, "mobile")}
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入手机号"
                    })}
                  />
                </div>
                <p className={gs.g_formMsg}>{this.state.mobile.msg}</p>
              </div>

              <div className={gs.g_formItem}>
                <label className={gs.g_formLabel}>
                  <FormattedMessage id="手机验证码" />
                </label>
                <div className={gs.g_formContent}>
                  <Input
                    value={this.state.mobileCode.value}
                    onChange={this.changeStatus.bind(this, "mobileCode")}
                    suffix={
                      <VerfiCodeRC
                        value={this.props.userinfo.email}
                        onClick={this.sendVerfiCode.bind(
                          this,
                          "mobile_order_id"
                        )}
                        className={s.verfCode}
                        ref={ref => (this.verfiCode = ref)}
                      />
                    }
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入验证码"
                    })}
                  />
                </div>
                <p className={gs.g_formMsg}>{this.state.mobileCode.msg}</p>
              </div>

              <div className={gs.g_formItem}>
                <label className={classnames(gs.g_formLabel, s.nocontent)}>
                  <FormattedMessage id="邮箱" />
                  <em>{this.props.userinfo.email}</em>
                </label>
              </div>

              <div className={gs.g_formItem}>
                <label className={gs.g_formLabel}>
                  <FormattedMessage id="邮箱验证码" />
                </label>
                <div className={gs.g_formContent}>
                  <Input
                    value={this.state.emailCode.value}
                    onChange={this.changeStatus.bind(this, "emailCode")}
                    suffix={
                      <VerfiCodeRC
                        value={this.props.userinfo.email}
                        onClick={this.sendVerfiCode.bind(this, "")}
                        className={s.verfCode}
                        ref={ref => (this.verfiCode2 = ref)}
                      />
                    }
                    placeholder={this.props.intl.formatMessage({
                      id: "请输入验证码"
                    })}
                  />
                </div>
                <p className={gs.g_formMsg}>{this.state.emailCode.msg}</p>
              </div>
            </div>
            {this.props.loading.effects["user/bind_mobile"] ? (
              <Button className={s.btn} disabled loading>
                {this.props.intl.formatMessage({
                  id: "确定"
                })}
              </Button>
            ) : (
              <Button className={s.btn} onClick={this.bindMobile}>
                {this.props.intl.formatMessage({
                  id: "确定"
                })}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(UserCenterBindMobile);
