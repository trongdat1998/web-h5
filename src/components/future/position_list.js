// 交易页 持仓订单区
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import styles from "./style";
import WSDATA from "../../models/data_source";
import OrderItem from "./position_item";
import ModalMargin from "./modal_margin";
import ModalPosition from "./modal_position";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
  Switch,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  Tooltip
} from "@material-ui/core";
import { message } from "../../lib";

let firstloading = false;

class TokenInfoRC extends React.Component {
  constructor() {
    super();
    this.state = {
      subed: false,
      side: "add",
      data: {},
      open: false,
      tokenName: "",

      stop_profit: false, // 是否止盈
      profit_price: "", // 止盈价格
      profit_condition_type: "1", // 触发价格条件类型 0-按最新价触发  1-按指数价触发 默认为1
      profit_close_type: "0", // 平仓类型 0-只平当前可平仓位  1-平所有仓位 默认为0

      stop_loss: false, // 是否止损
      loss_price: "", // 止损价格
      loss_condition_type: "1", // 触发价格条件类型 0-按最新价触发  1-按指数价触发 默认为1
      loss_close_type: "0", // 平仓类型 0-只平当前可平仓位  1-平所有仓位 默认为0

      is_long: "",
      symbol_id: "",
      exchange_id: "",
      set_msg: ""
    };
  }
  componentDidMount() {
    this.httpAction2();
  }
  componentWillUnmount() {
    firstloading = false;
  }
  componentDidUpdate(preProps) {
    if (this.props.ws && !this.state.subed) {
      this.setState(
        {
          subed: true
        },
        () => {
          // 当前持仓
          this.props.ws.sub(
            {
              id: "futures_position",
              topic: "futures_position",
              event: "sub",
              params: {
                org: this.props.config.orgId,
                binary: !Boolean(window.localStorage.ws_binary)
              }
            },
            this.httpAction2,
            this.callback2
          );
        }
      );
    }
    if (preProps.symbol_id != this.props.symbol_id) {
      firstloading = false;
      this.httpAction2();
    }
  }
  // 当前持仓
  httpAction2 = async payload => {
    await this.props.dispatch({
      type: "future/updatePositionOrder",
      payload: {
        symbol_id: this.props.symbol_id,
        exchange_id: this.props.exchange_id
      }
    });
    firstloading = true;
  };
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback2 = data => {
    data && data.data && WSDATA.setData("future_position_source", data.data);
  };
  changeItem = (side, data) => {
    this.setState({
      side,
      data
    });
  };
  changeProfit = k => e => {
    const v = e.target.checked;
    // 止盈
    if (k) {
      this.setState({
        stop_profit: v,
        profit_price: "",
        profit_condition_type: "1",
        profit_close_type: "0"
      });
      return;
    }
    // 止损
    this.setState({
      stop_loss: v,
      loss_price: "",
      loss_condition_type: "1",
      loss_close_type: "0"
    });
  };
  cancel = () => {
    this.setState({
      open: false,
      stop_profit: false,
      profit_price: "",
      profit_price_msg: "",
      profit_condition_type: "1",
      profit_close_type: "0",

      stop_loss: false,
      loss_price: "",
      loss_price_msg: "",
      loss_condition_type: "1",
      loss_close_type: "0",

      symbol_id: "",
      exchange_id: "",
      tokenName: "",
      is_long: "",
      set_msg: ""
    });
  };
  submitStop = () => {
    // 止盈
    if (this.state.stop_profit) {
      if (!this.state.profit_price) {
        this.setState({
          profit_price_msg: this.props.intl.formatMessage({ id: "请输入价格" })
        });
        return;
      }
    }
    // 止损
    if (this.state.stop_loss) {
      if (!this.state.loss_price) {
        this.setState({
          loss_price_msg: this.props.intl.formatMessage({ id: "请输入价格" })
        });
        return;
      }
    }

    const type =
      this.state.stop_profit || this.state.stop_loss
        ? "future/stop_profit_loss_set"
        : "future/stop_profit_loss_cancel";
    let data = {
      symbol_id: this.state.symbol_id,
      exchange_id: this.state.exchange_id,
      is_long: this.state.is_long
    };
    if (this.state.stop_profit) {
      data.stop_profit_price = this.state.profit_price;
      data.sp_trigger_condition_type = this.state.profit_condition_type;
      data.sp_close_type = this.state.profit_close_type;
    }
    if (this.state.stop_loss) {
      data.stop_loss_price = this.state.loss_price;
      data.sl_trigger_condition_type = this.state.loss_condition_type;
      data.sl_close_type = this.state.loss_close_type;
    }
    this.props.dispatch({
      type: type,
      payload: data,
      cb: res => {
        if (res.code != "OK") {
          res.msg && this.props.enqueueSnackbar(res.msg, { variant: "error" });
        } else {
          this.cancel();
        }
      }
    });
  };
  changePrice = key => e => {
    if (Number(e.target.value) || Number(e.target.value) >= 0) {
      this.setState({
        [key]: e.target.value,
        [key + "_msg"]: ""
      });
    }
  };
  // 触发类型，平仓方式变化
  radioChange = k => e => {
    this.setState({
      [k]: e.target.value
    });
  };
  openStop = (symbol_id, is_long, tokenName, exchange_id) => {
    this.setState(
      {
        open: true,
        symbol_id,
        exchange_id,
        is_long,
        tokenName,
        set_msg: ""
      },
      () => {
        this.props.dispatch({
          type: "future/stop_profit_loss_get",
          payload: {
            symbol_id,
            is_long
          },
          cb: res => {
            if (res.code == "OK") {
              const data = res.data;
              this.setState({
                stop_profit: data.stopProfit,
                profit_price: data.stopProfitPrice || "",
                profit_price_msg: "",
                profit_condition_type: data.stopProfitTriggerConditionType + "",
                profit_close_type: data.stopProfitCloseType + "",

                stop_loss: data.stopLoss,
                loss_price: data.stopLossPrice || "",
                loss_price_msg: "",
                loss_condition_type: data.stopLossTriggerConditionType + "",
                loss_close_type: data.stopLossCloseType + ""
              });
            } else {
              res.msg && message.error(res.msg);
            }
          }
        });
      }
    );
  };
  openPosition = data => {
    this.setState({
      data
    });
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_position: true
      }
    });
  };

  render() {
    const { classes, ...otherProps } = this.props;
    const loading = this.props.loading || { effects: {} };
    return (
      <div className={classes.order}>
        <div>
          {(this.props.position_list || []).map((item, i) => {
            if (
              !this.props.symbol_id ||
              this.props.symbol_id == item.symbolId
            ) {
              return (
                <OrderItem
                  key={item.positionId}
                  n={i}
                  data={item}
                  symbols_obj={this.props.config.symbols_obj}
                  cancel_order={this.cancel_order}
                  changeItem={this.changeItem}
                  openStop={this.openStop}
                  openPosition={this.openPosition}
                  dispatch={this.props.dispatch}
                />
              );
            }
          })}
          {this.props.userinfo.userId && firstloading ? (
            <div className={classes.getMore}>
              <p>{this.props.intl.formatMessage({ id: "无更多数据" })}</p>
            </div>
          ) : (
            ""
          )}
          {this.props.userinfo.userId && !firstloading ? (
            <div className={classes.getMore}>
              <CircularProgress />
            </div>
          ) : (
            ""
          )}
        </div>
        <ModalMargin
          open={this.props.modal_margin}
          side={this.state.side}
          item={this.state.data}
          {...otherProps}
        />
        <ModalPosition
          open={this.props.modal_position}
          data={this.state.data}
          {...otherProps}
        />
        <Dialog open={this.state.open}>
          {loading.effects["future/stop_profit_loss_get"] ? (
            <DialogContent style={{ minWidth: 310, padding: "8px 12px" }}>
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: 305, width: "100%" }}
              >
                <Grid>
                  <CircularProgress color="primary" size={30} />
                </Grid>
              </Grid>
            </DialogContent>
          ) : (
            <DialogContent
              style={{ minWidth: 310, padding: "8px 12px" }}
              className={classes.stop_content}
            >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.stop_profit}
                        onChange={this.changeProfit(1)}
                      />
                    }
                    classes={{
                      labelPlacementStart: classes.labelPlacementStart
                    }}
                    label={this.props.intl.formatMessage({ id: "止盈" })}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
              <TextField
                // label={this.props.intl.formatMessage({ id: "止盈价格" })}
                placeholder={this.props.intl.formatMessage({
                  id: "止盈触发价格"
                })}
                helperText={this.state.profit_price_msg}
                disabled={!this.state.stop_profit}
                value={this.state.profit_price}
                onChange={this.changePrice("profit_price")}
                autoFocus
                fullWidth
                InputProps={{
                  endAdornment: (
                    <span className={classes.grey}>{this.state.tokenName}</span>
                  )
                }}
                error={Boolean(this.state.profit_price_msg)}
                style={{ margin: "0 0 10px" }}
              />
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.stop_profit
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "触发价格类型" })}:
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.profit_condition_type}
                      onChange={this.radioChange("profit_condition_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            title={this.props.intl.formatMessage({
                              id: "profit_condition_type_1"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "指数价格"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "profit_condition_type_0"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "市场价格"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.stop_profit
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "平仓方式" })}:
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.profit_close_type}
                      onChange={this.radioChange("profit_close_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "profit_close_type_0"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "可平仓位"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_profit}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "profit_close_type_1"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "全部仓位"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ margin: "10px 0 10px" }}
              >
                <Grid item>
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        color="primary"
                        checked={this.state.stop_loss}
                        onChange={this.changeProfit()}
                      />
                    }
                    classes={{
                      labelPlacementStart: classes.labelPlacementStart
                    }}
                    label={this.props.intl.formatMessage({ id: "止损" })}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
              <TextField
                // label={this.props.intl.formatMessage({ id: "止损价格" })}
                placeholder={this.props.intl.formatMessage({
                  id: "止损触发价格"
                })}
                helperText={this.state.loss_price_msg}
                disabled={!this.state.stop_loss}
                value={this.state.loss_price}
                onChange={this.changePrice("loss_price")}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <span className={classes.grey}>{this.state.tokenName}</span>
                  )
                }}
                error={Boolean(this.state.loss_price_msg)}
                style={{ margin: "0 0 10px" }}
              />
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.stop_loss
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "触发价格类型" })}:
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.loss_condition_type}
                      onChange={this.radioChange("loss_condition_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "loss_condition_type_1"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "指数价格"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "loss_condition_type_0"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "市场价格"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container alignItems="center">
                <Grid
                  item
                  xs={12}
                  className={
                    this.state.stop_loss
                      ? classes.profit_show
                      : classes.profit_hide
                  }
                >
                  {this.props.intl.formatMessage({ id: "平仓方式" })}:
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={this.state.loss_close_type}
                      onChange={this.radioChange("loss_close_type")}
                      row
                    >
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="0"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "loss_close_type_0"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "可平仓位"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        disabled={!this.state.stop_loss}
                        value="1"
                        control={<Radio color="primary" />}
                        label={
                          <Tooltip
                            disableHoverListener
                            title={this.props.intl.formatMessage({
                              id: "loss_close_type_1"
                            })}
                            placement="top"
                          >
                            <span
                              style={{
                                fontSize: 12
                              }}
                            >
                              {this.props.intl.formatMessage({
                                id: "全部仓位"
                              })}
                            </span>
                          </Tooltip>
                        }
                        classes={{
                          labelPlacementStart: classes.labelPlacementStart
                        }}
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {/* <p style={{ margin: "0 0 10px" }}>{this.state.set_msg}</p> */}
              <p className={classes.title_desc}>
                {this.props.intl.formatMessage({ id: "温馨提示" })}
              </p>
              <ul className={classes.ul_desc}>
                <li>
                  {this.props.intl.formatMessage({
                    id: "condition_type_0_des"
                  })}
                </li>
                <li>
                  {this.props.intl.formatMessage({ id: "close_type_1_des" })}
                </li>
              </ul>
            </DialogContent>
          )}
          <DialogActions>
            <Button color="primary" onClick={this.cancel}>
              {this.props.intl.formatMessage({ id: "取消" })}
            </Button>
            {loading.effects["future/stop_profit_loss_set"] ||
            loading.effects["future/stop_profit_loss_cancel"] ? (
              <Button disabled color="primary">
                <CircularProgress color="primary" size={20} />
              </Button>
            ) : (
              <Button onClick={this.submitStop} color="primary">
                {this.props.intl.formatMessage({ id: "确定" })}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TokenInfoRC));
