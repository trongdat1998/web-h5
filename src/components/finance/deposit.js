// 首页
import React from "react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import route_map from "../../config/route_map";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { Iconfont, message } from "../../lib";
import styles from "./style";
import classnames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      copied: false,
      jump: false,
      chain_type: "",
    };
    this.copy = this.copy.bind(this);
  }
  componentDidMount() {
    this.setState({
      jump: false,
      to: "",
    });
    const token = (this.props.match.params.token || "").toUpperCase();
    const currentToken = window.WEB_CONFIG.token.find((i) => {
      return i.tokenId == token;
    });
    debugger;
    if (window.WEB_CONFIG.token && currentToken) {
      const chainTypes = (currentToken["chainTypes"] || []).filter(
        (item) => item.allowDeposit
      );
      const chain_type = chainTypes.length ? chainTypes[0]["chainType"] : "";
      this.getData(token, chain_type);
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   const token = (this.props.match.params.token || "").toUpperCase();
  //   if (!token) return;
  //   const currentToken = window.WEB_CONFIG.token.find((i) => {
  //     return i.tokenId == token;
  //   });
  //   if (!currentToken) {
  //     const chainTypes = currentToken["chainTypes"] || [];
  //     const chain_type =
  //       chainTypes.length && chainTypes[0]["allowDeposit"]
  //         ? chainTypes[0]["chainType"]
  //         : "";
  //     this.getData(token, chain_type);
  //   }
  // }
  // 获取充币地址
  getData = (token, chain_type) => {
    const loading = Boolean(
      this.props.loading &&
        this.props.loading["effects"] &&
        this.props.loading["effects"]["finance/getAddress"]
    );
    if ((chain_type && chain_type == this.state.chain_type) || loading) return;
    this.props.dispatch({
      type: "finance/propsChange",
      payload: {
        deposit: {},
      },
    });
    this.setState(
      {
        chain_type,
      },
      () => {
        this.props.dispatch({
          type: "finance/getAddress",
          payload: {
            token_id: token,
            chain_type: chain_type,
          },
        });
      }
    );
  };
  componentWillUnmount() {
    this.props.dispatch({
      type: "finance/propsChange",
      payload: {
        deposit: {},
      },
    });
  }
  copy() {
    this.setState({
      copied: true,
    });
    message.info(
      this.props.intl.formatMessage({
        id: "复制成功",
      })
    );
  }
  goBack() {
    window.history.go(-1);
  }
  render() {
    const { classes } = this.props;
    const token = (this.props.match.params.token || "").toUpperCase();
    const currentToken = window.WEB_CONFIG.token.find((i) => {
      return i.tokenId == token;
    });
    const BTCToken = window.WEB_CONFIG.token.find((i) => {
      return i.tokenId == "BTC";
    });
    if (BTCToken && !currentToken) {
      const url =
        window.location.protocol +
        "//" +
        window.location.host +
        route_map.finance;
      return (window.location.href = url);
    }
    const chainTypes = currentToken ? currentToken["chainTypes"] : [];
    return (
      <div>
        <Grid className={classes.tit}>
          <Iconfont onClick={this.goBack} type="close" size="24" />
          <h2>
            {currentToken ? currentToken.tokenName : ""}
            {this.props.intl.formatMessage({ id: "充币" })}
          </h2>
        </Grid>
        <Grid className={classes.deposit_con}>
          <p className={classes.desc}>
            <FormattedHTMLMessage
              id="发送 <em>{tokenFullName}</em> 地址到下方地址"
              values={{
                tokenFullName: currentToken ? currentToken.tokenName : "",
              }}
              tagName="span"
            />
          </p>
          {chainTypes && chainTypes.length ? (
            <div className={classes.chain}>
              <p>{this.props.intl.formatMessage({ id: "链名称" })}</p>
              <div className={classes.chain_tag}>
                {chainTypes.map((item) => {
                  return (
                    <Button
                      disabled={!item.allowDeposit}
                      onClick={this.getData.bind(this, token, item.chainType)}
                      className={
                        item.chainType == this.state.chain_type ? "active" : ""
                      }
                    >
                      {item.chainType}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            ""
          )}
          {this.props.deposit &&
          this.props.deposit.allowDeposit === true &&
          this.props.deposit.qrcode ? (
            <img src={"data:image/png;base64," + this.props.deposit.qrcode} />
          ) : (
            ""
          )}
          <div className={classes.address}>
            <p>
              {this.props.deposit.allowDeposit === false
                ? this.props.intl.formatMessage({ id: "充币已关闭" })
                : this.props.deposit.address}
            </p>
            {this.props.deposit.allowDeposit === true ? (
              <CopyToClipboard
                text={this.props.deposit.address}
                onCopy={this.copy}
              >
                <Button color="primary" variant="outlined">
                  {this.props.intl.formatMessage({
                    id: "复制地址",
                  })}
                </Button>
              </CopyToClipboard>
            ) : (
              ""
            )}
          </div>
          {this.props.deposit.needAddressTag &&
          this.props.deposit.allowDeposit === true ? (
            <div className={classnames(classes.address, classes.tag)}>
              <p>{this.props.deposit.addressExt}</p>
              <CopyToClipboard
                text={this.props.deposit.addressExt}
                onCopy={this.copy}
              >
                <Button color="primary" variant="outlined">
                  {this.props.intl.formatMessage({
                    id: "复制",
                  })}
                  TAG
                </Button>
              </CopyToClipboard>
            </div>
          ) : (
            ""
          )}
          {this.props.deposit.needAddressTag &&
          this.props.deposit.allowDeposit === true ? (
            <div className={classes.tip}>
              <Iconfont type="Suspended" size="24" />
              {this.props.intl.formatMessage({
                id: "提示：充币时请务必填写Tag并仔细核对，否则将造成资产损失并不可找回",
              })}
            </div>
          ) : (
            ""
          )}
          <div className={classes.rule}>
            <p>{this.props.intl.formatMessage({ id: "温馨提示" })}</p>
            <ul>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.1"
                  values={{
                    name: currentToken ? currentToken["tokenName"] : "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.4"
                  values={{
                    token: currentToken ? currentToken["tokenName"] : "",
                    v: this.props.deposit.requiredConfirmNum
                      ? this.props.deposit.requiredConfirmNum
                      : "",
                    m: this.props.deposit
                      ? this.props.deposit.canWithdrawConfirmNum
                      : "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.2"
                  values={{
                    name: currentToken ? currentToken["tokenName"] : "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.3"
                  values={{
                    name: this.props.deposit.minQuantity || "",
                  }}
                />
              </li>
              <li>
                <FormattedHTMLMessage
                  tagName="span"
                  id="deposit.desc.5"
                  values={{
                    name: this.props.deposit.minQuantity || "",
                  }}
                />
              </li>
              {this.props.deposit.tokenType == "ERC20_TOKEN" ? (
                <li>
                  <FormattedHTMLMessage
                    tagName="span"
                    id="deposit.desc.erc20"
                    values={{
                      name: currentToken ? currentToken["tokenName"] : "",
                    }}
                  />
                </li>
              ) : (
                ""
              )}
              {token == "ETH" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.eth" />
                </li>
              ) : (
                ""
              )}
              {token == "ETH" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.eth2" />
                </li>
              ) : (
                ""
              )}
              {token == "ZEC" ? (
                <li>
                  <FormattedHTMLMessage tagName="span" id="deposit.desc.zec" />
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(Index));
