// 个人中心
import React from "react";
import { Link } from "dva/router";
import route_map from "../../config/route_map";
import { FormattedMessage, injectIntl } from "react-intl";
import { Table } from "../../lib";
import classnames from "classnames";
import g from "../../lib/css/public.less";
import s from "./style.less";
import moment from "moment";

class UserCenter extends React.Component {
  constructor() {
    super();
    this.getMore = this.getMore.bind(this);
  }

  // 获取更多
  getMore() {
    this.props.dispatch({
      type: "user/authorize_log",
      payload: {}
    });
  }
  render() {
    const column = [
      {
        title: <FormattedMessage id="登录时间" />,
        key: "created",
        render: (text, record) => {
          return (
            <span>
              {moment
                .utc(Number(record.created))
                .local()
                .format("YYYY/MM/DD HH:mm:ss")}
            </span>
          );
        }
      },
      {
        title: <FormattedMessage id="IP地址" />,
        key: "ip"
      },
      {
        title: <FormattedMessage id="状态" />,
        key: "status",
        render: text => {
          return [
            "",
            <FormattedMessage id="成功" />,
            <FormattedMessage id="失败" />,
            <FormattedMessage id="未完成" />
          ][text];
        }
      }
    ];
    return (
      <div className={classnames(g.g_layout, s.center)}>
        <div className={s.info}>
          <img src={require("../../assets/defaulticon.png")} />
          <ul>
            <li>UID {this.props.userinfo.userId}</li>
            <li>
              {this.props.userinfo.registerType == 1
                ? this.props.userinfo.mobile
                : this.props.userinfo.email}
            </li>
            <li>
              {this.props.userinfo.verifyStatus === 0 ? (
                <Link to={route_map.user_kyc}>
                  {this.props.intl.formatMessage({ id: "未实名认证" })}
                </Link>
              ) : (
                ""
              )}
              {this.props.userinfo.verifyStatus === 1 ? (
                <Link to={route_map.user_kyc}>
                  {this.props.intl.formatMessage({ id: "未实名认证" })}
                </Link>
              ) : (
                ""
              )}
              {this.props.userinfo.verifyStatus === 2 ? (
                <i>
                  <FormattedMessage id="已认证" />
                </i>
              ) : (
                ""
              )}
              {this.props.userinfo.verifyStatus === 3 ? (
                <Link
                  to={{ pathname: route_map.user_kyc, state: { review: true } }}
                >
                  {this.props.intl.formatMessage({ id: "未实名认证" })}
                </Link>
              ) : (
                ""
              )}
              {this.props.userinfo.userType === 1 ? (
                <em>
                  <FormattedMessage id="普通用户" />
                </em>
              ) : (
                <strong>
                  <FormattedMessage id="机构用户" />
                </strong>
              )}
            </li>
          </ul>
        </div>
        <div className={s.module}>
          <div className={s.item}>
            <h2>
              <FormattedMessage id="登录密码" />
            </h2>
            <p />
            <Link to={route_map.resetpwd}>
              <FormattedMessage id="修改" />
            </Link>
          </div>
          <div className={s.item}>
            <h2>
              <FormattedMessage id="手机" />
            </h2>
            <p>
              <FormattedMessage id="用于提现及安全设置验证" />
            </p>
            {this.props.userinfo.mobile ? (
              <em>
                <FormattedMessage id="已绑定" />
              </em>
            ) : (
              <Link to={route_map.user_bind + "/mobile"}>
                <FormattedMessage id="绑定" />
              </Link>
            )}
          </div>
          <div className={s.item}>
            <h2>
              <FormattedMessage id="邮箱" />
            </h2>
            <p>
              <FormattedMessage id="用于提现及安全设置验证" />
            </p>
            {this.props.userinfo.email ? (
              <em>
                <FormattedMessage id="已绑定" />
              </em>
            ) : (
              <Link to={route_map.user_bind + "/email"}>
                <FormattedMessage id="绑定" />
              </Link>
            )}
          </div>
          <div className={s.item}>
            <h2>API</h2>
            <p>
              <FormattedMessage id="api.desc.1" />
            </p>
            <Link to={route_map.user_api}>
              <FormattedMessage id="设置" />
            </Link>
          </div>
          <div className={s.item}>
            <h2>
              <FormattedMessage id="谷歌验证" />
            </h2>
            <p>
              <FormattedMessage id="用于提现及安全设置验证" />
            </p>
            {this.props.userinfo.bindGA ? (
              <em>
                <FormattedMessage id="已绑定" />
              </em>
            ) : (
              <Link to={route_map.user_bind + "/ga"}>
                {this.props.intl.formatMessage({ id: "绑定" })}
              </Link>
            )}
          </div>
          <div className={s.item}>
            <h2>
              <FormattedMessage id="实名认证" />
            </h2>
            <p>
              <FormattedMessage id="用于提现及API设置验证" />
            </p>
            {this.props.userinfo.verifyStatus === 2 &&
            this.props.userinfo.userType == 1 ? (
              <Link to={route_map.user_kyc}>
                <FormattedMessage id="已实名" />
              </Link>
            ) : (
              ""
            )}
            {this.props.userinfo.verifyStatus === 1 &&
            this.props.userinfo.userType == 1 ? (
              <Link to={route_map.user_kyc}>
                <FormattedMessage id="审核中" />
              </Link>
            ) : (
              ""
            )}
            {this.props.userinfo.verifyStatus === 0 &&
            this.props.userinfo.userType == 1 ? (
              <Link to={route_map.user_kyc}>
                {this.props.intl.formatMessage({ id: "未实名" })}
              </Link>
            ) : (
              ""
            )}
            {this.props.userinfo.verifyStatus === 3 &&
            this.props.userinfo.userType == 1 ? (
              <Link to={{ pathname: route_map.user_kyc }}>
                {this.props.intl.formatMessage({ id: "认证失败" })}
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className={g.layout}>
          <div className={g.g_title}>
            <FormattedMessage id="最近登录" />
          </div>
          <Table
            className={s.authorize_log}
            widthStyle={s.authorize_logTitle}
            data={this.props.authorize_log}
            titles={column}
            hasMore={false}
            getMore={this.getMore}
            useWindow={true}
          />
        </div>
      </div>
    );
  }
}

export default injectIntl(UserCenter);
