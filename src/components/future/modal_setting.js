// 设置弹层
import React from "react";
import { injectIntl } from "react-intl";
import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Select,
  Menu,
  MenuItem
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../../lib";
import style from "./style";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: 8
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Iconfont type="close" size="24" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: 8
  }
}))(MuiDialogContent);

class ModalSetting extends React.Component {
  constructor() {
    super();
  }
  handleClose = key => {
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_setting: false
      }
    });
  };
  handleToggle = (key, name) => e => {
    let symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    if (!symbolId) return;
    const order_setting = this.props.order_setting[symbolId] || {};
    let orderSetting = order_setting.orderSetting || {};
    const target = e.target;
    orderSetting[target.name] =
      key == "checked" ? target.checked : target.value;
    let old = {};
    //old.is_passive_order = orderSetting.isPassiveOrder;
    old.time_in_force = orderSetting.timeInForce;
    old.is_confirm = orderSetting.isConfirm;
    this.props.dispatch({
      type: "future/set_order_setting",
      payload: {
        symbol_id: symbolId,
        ...old,
        [name]: key == "checked" ? target.checked : target.value
      },
      dispatch: this.props.dispatch
    });
  };
  render() {
    let symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    if (!symbolId) {
      return <div />;
    }
    const order_setting = this.props.order_setting[symbolId] || {};
    const orderSetting = order_setting.orderSetting || {
      //isPassiveOrder: "1",
      timeInForce: "GTC",
      isConfirm: "1"
    };
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.props.open}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={this.handleClose}
          classes={{
            root: this.props.classes.settingTitle
          }}
        >
          {this.props.intl.formatMessage({ id: "设置" })}
        </DialogTitle>
        <DialogContent>
          <List className={this.props.classes.setting_list}>
            {/* <ListItem>
              <ListItemText
                primary={this.props.intl.formatMessage({
                  id: "启用被动委托或取消"
                })}
              />
              <ListItemSecondaryAction>
                <Switch
                  color="primary"
                  name="isPassiveOrder"
                  onChange={this.handleToggle("checked", "is_passive_order")}
                  checked={Boolean(Number(orderSetting.isPassiveOrder))}
                />
              </ListItemSecondaryAction>
            </ListItem> */}
            <ListItem>
              <ListItemText
                primary={this.props.intl.formatMessage({
                  id: "下单条件"
                })}
                classes={{ root: this.props.classes.itemText }}
              />
              <ListItemSecondaryAction
                classes={{ root: this.props.classes.secondaryAction }}
              >
                <Select
                  value={orderSetting.timeInForce}
                  name="timeInForce"
                  onChange={this.handleToggle("value", "time_in_force")}
                >
                  <MenuItem value="GTC">
                    {this.props.intl.formatMessage({ id: "一直有效" })}
                  </MenuItem>
                  <MenuItem value="FOK">
                    {this.props.intl.formatMessage({
                      id: "只做TAKER单(全部成交)"
                    })}
                  </MenuItem>
                  <MenuItem value="IOC">
                    {this.props.intl.formatMessage({
                      id: "只做TAKER单(部分成交)"
                    })}
                  </MenuItem>
                  <MenuItem value="MAKER">
                    {this.props.intl.formatMessage({ id: "只做MAKER单" })}
                  </MenuItem>
                </Select>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={this.props.intl.formatMessage({
                  id: "启用下单弹窗确认"
                })}
                classes={{ root: this.props.classes.itemText }}
              />
              <ListItemSecondaryAction
                classes={{ root: this.props.classes.secondaryAction }}
              >
                <Switch
                  color="primary"
                  name="isConfirm"
                  onChange={this.handleToggle("checked", "is_confirm")}
                  checked={Boolean(Number(orderSetting.isConfirm))}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(style)(injectIntl(ModalSetting));
