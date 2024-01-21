import React from "react";
import { injectIntl } from "react-intl";
import style from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../lib";
import { Grid } from "@material-ui/core";
import route_map from "../config/route_map";

class HeaderRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      display: 0,
    };
  }
  componentDidMount() {
    if (
      window.sessionStorage.display != 1 &&
      window.location.href.indexOf("/register") == -1
    ) {
      this.setState({
        display: 1,
      });
    }
  }
  change = () => {
    window.sessionStorage.display = 1;
    this.setState({
      display: 0,
    });
  };
  render() {
    const classes = this.props.classes;
    const display = this.state.display;
    const shareConfig = this.props.index_config.shareConfig || {};
    if (/bhe.?App/i.test(navigator.userAgent)) {
      return "";
    }
    return (
      <div className={classes.footer}>
        <div
          key="layer"
          style={{ display: display && shareConfig.openUrl ? "block" : "none" }}
        >
          {display && shareConfig.openUrl ? (
            <div className={classes.download_layer}>
              <div>
                {shareConfig.logoUrl ? <img src={shareConfig.logoUrl} /> : ""}
              </div>
              <div>
                <h2>{shareConfig.title}</h2>
                <p>{shareConfig.description}</p>
              </div>
              <div>
                {shareConfig.openUrl ? (
                  <a
                    href={shareConfig.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.props.intl.formatMessage({ id: "APP下载" })}
                  </a>
                ) : (
                  ""
                )}
              </div>
              <div onClick={this.change} style={{ padding: "0 8px" }}>
                <Iconfont type="close" size="24" />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Grid
          container
          justify="space-around"
          alignItems="center"
          className={classes.footerCon}
        >
          <Grid item>
            <a
              href={route_map.index}
              className={
                window.location.pathname == route_map.index ||
                window.location.pathname == route_map.index2
                  ? "choose"
                  : ""
              }
            >
              {window.location.pathname == route_map.index ||
              window.location.pathname == route_map.index2 ? (
                <Iconfont
                  type="home"
                  size="24"
                  style={{ color: window.palette.primary.main }}
                />
              ) : (
                <Iconfont type="home" size="24" />
              )}

              <span>{this.props.intl.formatMessage({ id: "首页" })}</span>
            </a>
          </Grid>
          <Grid item>
            <a
              href={route_map.quotes}
              className={
                window.location.pathname == route_map.quotes ? "choose" : ""
              }
            >
              {window.location.pathname == route_map.quotes ? (
                <Iconfont
                  type="markets"
                  size="24"
                  style={{ color: window.palette.primary.main }}
                />
              ) : (
                <Iconfont type="markets" size="24" />
              )}

              <span>{this.props.intl.formatMessage({ id: "行情" })}</span>
            </a>
          </Grid>
          <Grid item>
            <a
              href={route_map.trade}
              className={
                window.location.pathname.indexOf(route_map.trade) > -1
                  ? "choose"
                  : ""
              }
            >
              {window.location.pathname.indexOf(route_map.trade) > -1 ? (
                <Iconfont
                  type="trade"
                  size="24"
                  style={{ color: window.palette.primary.main }}
                />
              ) : (
                <Iconfont type="trade" size="24" />
              )}

              <span>{this.props.intl.formatMessage({ id: "交易" })}</span>
            </a>
          </Grid>
          {this.props.config.functions &&
          this.props.config.functions["futures"] ? (
            <Grid item>
              <a
                href={route_map.future_trade}
                className={
                  window.location.pathname.indexOf(route_map.future_trade) > -1
                    ? "choose"
                    : ""
                }
              >
                {window.location.pathname.indexOf(route_map.future_trade) >
                -1 ? (
                  <Iconfont
                    type="contract"
                    size="24"
                    style={{ color: window.palette.primary.main }}
                  />
                ) : (
                  <Iconfont type="contract" size="24" />
                )}

                <span>{this.props.intl.formatMessage({ id: "合约" })}</span>
              </a>
            </Grid>
          ) : (
            ""
          )}
          <Grid item>
            <a
              href={route_map.finance}
              className={
                window.location.pathname.indexOf(route_map.finance) > -1
                  ? "choose"
                  : ""
              }
            >
              {window.location.pathname.indexOf(route_map.finance) > -1 ? (
                <Iconfont
                  type="asset"
                  size="24"
                  style={{ color: window.palette.primary.main }}
                />
              ) : (
                <Iconfont type="asset" size="24" />
              )}

              <span>{this.props.intl.formatMessage({ id: "资产" })}</span>
            </a>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(HeaderRC));
