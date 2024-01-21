// 设置页
import React from "react";
import { injectIntl } from "react-intl";
import { Iconfont, Icon } from "../../lib";
import { CopyToClipboard } from "react-copy-to-clipboard";

import style from "./user.style";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Collapse,
  CircularProgress,
} from "@material-ui/core";
import Cookie from "../../utils/cookie";
import route_map from "../../config/route_map";

class SettingRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      open2: false,
      open3: false,
      copyed: false,
    };
  }
  // 语言选择
  changeLang = (lang) => async (e) => {
    if (lang == window.localStorage.lang) {
      this.setState({
        open: false,
      });
      return;
    }
    await this.props.dispatch({
      type: "layout/setCustomConfig",
      payload: {
        lang: lang,
      },
    });
    let tmp = window.location.hostname.split(".");
    window.localStorage.lang = lang;
    Cookie.write({
      name: "locale",
      value: lang,
      domain: window.location.hostname.replace(tmp.shift() + ".", ""),
    });
    const s = window.location.search;
    let lang2 = s.match(/lang\=([^&]{0,})/);
    if (lang2 && lang2[1]) {
      let link = window.location.href;
      link = link.replace(/lang\=[^&]{0,}/, "lang=" + lang);
      window.location.href = link;
    } else {
      window.location.reload();
    }
  };
  // 法币选择
  changeValue = (v) => (e) => {
    let lang = "";
    this.props.config.supportLanguages.map((item) => {
      if (item.suffix == v && !lang) {
        lang = item.lang;
      }
    });
    if (lang) {
      window.localStorage.unit = lang;
      this.props.dispatch({
        type: "layout/setCustomConfig",
        payload: {
          unit: lang,
        },
      });
      this.props.dispatch({
        type: "layout/setUnit",
        payload: {
          unit: lang,
        },
      });
      this.setState({
        open2: false,
      });
    }
  };
  // 颜色配置
  changeColor = (v) => (e) => {
    window.localStorage.up_down = v;
    this.props.dispatch({
      type: "layout/setCustomConfig",
      payload: {
        up_down: v,
      },
    });
    this.setState({
      open3: false,
    });
  };
  copy = () => {
    if (this.state.copyed) return;
    this.setState(
      {
        copyed: true,
      },
      () => {
        this.props.enqueueSnackbar &&
          this.props.enqueueSnackbar(
            this.props.intl.formatMessage({
              id: "复制成功",
            }),
            { variant: "success" }
          );
      }
    );
  };
  logout = () => {
    this.props.dispatch({
      type: "layout/logout",
      payload: {},
    });
  };
  goto(link) {
    window.location.href = link;
  }
  render() {
    let lang_text = "";
    let value_text = "";
    let values = new Set();
    (this.props.config.supportLanguages || []).map((item) => {
      if (item.lang == window.localStorage.lang) {
        lang_text = item.text;
      }
      if (item.lang === this.props.unit) {
        value_text = item.suffix;
      }
      values.add(item.suffix);
    });
    const classes = this.props.classes;
    const functions = this.props.config.functions || {};
    return (
      <div className={classes.user_setting}>
        <div className={classes.user_info}>
          <Iconfont
            type="back"
            size="24"
            style={{ display: "block" }}
            onClick={() => {
              window.history.back();
            }}
          />
          <Grid
            container
            className={classes.user_desc}
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Avatar className={classes.user_icon}>
                <Iconfont type="user" size="48" />
              </Avatar>
            </Grid>
            {this.props.userinfo.userId ? (
              <Grid item>
                <strong>
                  {this.props.userinfo.registerType == 2
                    ? this.props.userinfo.email
                    : this.props.userinfo.mobile}
                </strong>
                <CopyToClipboard
                  text={this.props.userinfo.userId}
                  onCopy={this.copy}
                >
                  <div>
                    <span>UID:{this.props.userinfo.userId}</span>
                    <label>
                      {this.props.intl.formatMessage({ id: "复制" })}
                    </label>
                  </div>
                </CopyToClipboard>
              </Grid>
            ) : this.props.loading &&
              this.props.loading.effects &&
              this.props.loading.effects["layout/userinfo"] ? (
              <Grid item>
                <CircularProgress />
              </Grid>
            ) : (
              <Grid item>
                <a
                  href={
                    route_map.login +
                    "?redirect=" +
                    encodeURIComponent(window.location.href)
                  }
                >
                  {this.props.intl.formatMessage({ id: "登录" })}
                </a>
              </Grid>
            )}
          </Grid>
        </div>
        {this.props.userinfo.userId && functions && functions["userLevel"] ? (
          <div className={classes.setting}>
            <List>
              <ListItem onClick={this.goto.bind(this, route_map.grade)}>
                <ListItemText>
                  {this.props.intl.formatMessage({ id: "我的等级" })}
                </ListItemText>
                <Iconfont type="arrowRight" size="20" />
              </ListItem>
            </List>
          </div>
        ) : (
          ""
        )}
        <div className={classes.setting}>
          <List>
            <ListItem
              button
              onClick={() => {
                this.setState({
                  open: !this.state.open,
                });
              }}
            >
              <ListItemText>
                {this.props.intl.formatMessage({ id: "语言" })}
              </ListItemText>
              <ListItemText className={classes.item}>{lang_text}</ListItemText>
              {this.state.open ? (
                <Iconfont type="arrowDown" size="20" />
              ) : (
                <Iconfont type="arrowRight" size="20" />
              )}
            </ListItem>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                className={classes.borderTop}
              >
                {(this.props.config.supportLanguages || []).map((item) => {
                  return (
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={this.changeLang(item.lang)}
                      key={item.lang + "a"}
                    >
                      <ListItemText className={classes.option_item}>
                        {item.text}
                      </ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
            <ListItem
              button
              onClick={() => {
                this.setState({
                  open2: !this.state.open2,
                });
              }}
              className={classes.borderTop}
            >
              <ListItemText>
                {this.props.intl.formatMessage({ id: "计价货币" })}
              </ListItemText>
              <ListItemText className={classes.item}>{value_text}</ListItemText>
              {this.state.open2 ? (
                <Iconfont type="arrowDown" size="20" />
              ) : (
                <Iconfont type="arrowRight" size="20" />
              )}
            </ListItem>
            <Collapse in={this.state.open2} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                className={classes.borderTop}
              >
                {Array.from(values).map((item) => {
                  return (
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={this.changeValue(item)}
                      key={item}
                    >
                      <ListItemText className={classes.option_item}>
                        {item}
                      </ListItemText>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
            <ListItem
              button
              onClick={() => {
                this.setState({
                  open3: !this.state.open3,
                });
              }}
              className={classes.borderTop}
            >
              <ListItemText>
                {this.props.intl.formatMessage({ id: "颜色配置" })}
              </ListItemText>
              <ListItemText className={classes.item}>
                {this.props.intl.formatMessage({
                  id:
                    window.localStorage.up_down == 1 ? "红涨绿跌" : "绿涨红跌",
                })}
              </ListItemText>
              {this.state.open3 ? (
                <Iconfont type="arrowDown" size="20" />
              ) : (
                <Iconfont type="arrowRight" size="20" />
              )}
            </ListItem>
            <Collapse in={this.state.open3} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                className={classes.borderTop}
              >
                <ListItem
                  button
                  className={classes.nested}
                  onClick={this.changeColor(0)}
                  key={0}
                >
                  <ListItemText className={classes.option_item}>
                    {this.props.intl.formatMessage({ id: "绿涨红跌" })}
                  </ListItemText>
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  onClick={this.changeColor(1)}
                  key={1}
                >
                  <ListItemText className={classes.option_item}>
                    {this.props.intl.formatMessage({ id: "红涨绿跌" })}
                  </ListItemText>
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
        <div className={classes.logout}>
          {this.props.userinfo.userId ? (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={this.logout}
            >
              {this.props.intl.formatMessage({ id: "退出" })}
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(SettingRC));
