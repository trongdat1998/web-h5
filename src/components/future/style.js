import helper from "../../utils/helper";

export default (theme) => ({
  qplayer: {
    background: helper.hex_to_rgba(theme.palette.primary.main, 0.05),
    color: theme.palette.grey[800],
    borderBottom: `1px solid ${theme.palette.common.white}`,
    lineHeight: "32px",
    padding: "0 16px",
  },
  qpdesc: {
    color: theme.palette.grey[800],
    fontSize: 12,
  },
  stop_content: {
    fontSize: 12,
  },
  title_desc: {
    margin: "10px 0 5px",
    padding: "10px 0 0",
    borderTop: `1px solid ${theme.palette.grey[50]}`,
  },
  profit_show: {},
  profit_hide: {
    color: theme.palette.grey[500],
  },
  ul_desc: {
    fontSize: 12,
    lineHeight: "16px",
    listStyle: "decimal",
    padding: "0 0 0 20px",
    color: theme.palette.grey[800],
  },
  labelPlacementStart: {
    marginLeft: 0,
    marginRight: 5,
  },
  calculator: {
    padding: "0 !important",
    overflowX: "hidden",
  },
  cal_tab: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    padding: "0 20px",
    "& i": {
      cursor: "pointer",
    },
  },
  cal_content: {
    padding: 20,
  },
  cal_item: {
    height: 50,
    "& label": {
      ...theme.typography.caption,
      color: theme.palette.grey[800],
      lineHeight: "30px",
    },
  },
  cal_result: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    padding: 16,
    height: "100%",
    "& label": {
      ...theme.typography.caption,
      color: theme.palette.grey[800],
      fontWeight: 400,
    },
  },
  cal_result2: {
    color: theme.palette.grey[800],
    padding: 16,
    height: "100%",
    "& strong": {
      color: theme.palette.common.text,
    },
    "& p": {
      margin: "0 0 10px",
    },
  },
  depth: {
    height: 70,
    margin: "0 24px 0 8px",
    position: "relative",
    "& canvas": {
      "&:nth-child(2n+1)": {
        height: 54,
        opacity: 0.1,
      },
      "&:nth-child(2n)": {
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
      },
    },
  },
  depthRC: {
    height: 170,
    margin: "0",
    position: "relative",
    "& canvas": {
      opacity: 0.4,
      height: 154,
    },
  },
  un: {
    wordBreak: "keep-all",
  },
  depth_price: {
    ...theme.typography.caption,
    color: theme.palette.grey[500],
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  depth_amount: {
    ...theme.typography.caption,
    position: "absolute",
    color: theme.palette.grey[500],
    height: "calc(100% - 16px)",
    left: 0,
    top: 0,
    "& div": {
      height: 18,
      lineHeight: "18px",
    },
  },
  handicap: {},
  handicap_type: {
    minWidth: 70,
    height: 24,
    position: "relative",
    overflow: "hidden",
    "& select": {
      opacity: 0,
      width: "100%",
    },
    "& span": {
      position: "absolute",
      height: 24,
      right: 0,
      top: 0,
      pointerEvents: "none",
    },
  },
  digit: {
    height: 24,
    position: "relative",
    overflow: "hidden",
    "& select": {
      opacity: 0,
      width: "100%",
    },
    "& i": {
      position: "absolute",
      width: 24,
      height: 24,
      left: 0,
      top: 0,
      pointerEvents: "none",
    },
    "& img": {
      position: "absolute",
      width: 14,
      height: 14,
      right: 0,
      top: 4,
      pointerEvents: "none",
    },
    "& span": {
      position: "absolute",
      minWidth: 60,
      height: 24,
      lineHeight: "24px",
      left: 0,
      top: 0,
      pointerEvents: "none",
      fontSize: 12,
      color: theme.palette.grey[500],
      "& i": {
        position: "initial",
        display: "inline",
      },
    },
  },
  handicap_exchange: {
    padding: "6px 24px",
    marginTop: "8px",
    borderTop: `1px solid rgba(255,255,255,.05)`,
  },
  handicapList: {
    height: 240,
    overflow: "auto",
  },
  handicapItem: {
    ...theme.typography.caption,
    height: 22,
    position: "relative",
    "& span": {
      position: "absolute",
      display: "block",
      height: 22,
      right: 0,
      top: 0,
    },
  },
  handicapItemEx: {
    color: theme.palette.primary.contrastText,
    height: 32,
    lineHeight: "32px",
    position: "relative",
    "& span": {
      position: "absolute",
      display: "block",
      height: 32,
      right: 0,
      top: 0,
    },
  },
  handicapTitle: {
    height: 24,
    ...theme.typography.caption,
    color: theme.palette.grey[500],
  },
  handicapInfo: {
    height: 24,
    "& strong": {
      ...theme.typography.subtitle2,
      display: "block",
      fontWeight: 600,
    },
    "& span": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
    },
  },
  bg_green: {
    background: theme.palette.up.main,
  },
  bg_red: {
    background: theme.palette.down.main,
  },
  grey500: {
    color: theme.palette.grey[500],
  },
  slider: {
    width: "90%",
    margin: "0 0 0 5%",
  },
  rail: {
    height: 4,
    background: theme.palette.grey[50],
  },
  mark: {
    width: 12,
    height: 12,
    margin: "-5px 0 0 -6px",
    borderRadius: 6,
    background: theme.palette.grey[50],
  },
  markActive: {
    background: theme.palette.primary.main,
    opacity: 1,
  },
  amount: {
    ...theme.typography.body2,
    color: theme.palette.common.text,
    textAlign: "center",
    margin: "0 0 16px",
    "& strong": {
      display: "block",
      fontWeight: 600,
    },
    "& span": {
      color: theme.palette.grey[500],
    },
  },
  greenBtn: {
    border: `1px solid ${theme.palette.up.main}`,
    color: theme.palette.up.main,
    borderRadius: "2px 0 0 2px",
  },
  greenBtn2: {
    background: theme.palette.up.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      background: theme.palette.success.dark,
    },
  },
  redBtn: {
    border: `1px solid ${theme.palette.down.main}`,
    color: theme.palette.down.main,
    borderRadius: "0 2px 2px 0",
  },
  redBtn2: {
    background: theme.palette.down.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
  defaultBtn: {
    border: `1px solid ${theme.palette.grey[100]}`,
  },
  selectTokens: {
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    fontSize: "1rem",
    "& h2": {
      padding: "14px",
    },
    "& ul": {
      paddingLeft: 16,
      "& span": {
        color: theme.palette.grey[500],
      },
    },
  },
  token_list: {
    borderTop: `1px solid ${theme.palette.grey[100]}`,
    flex: 1,
    overflowY: "auto",
  },
  bottomLine: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    paddingLeft: 0,
  },
  kline: {
    position: "relative",
    height: 360,
  },
  chart: {
    height: "calc(100% - 50px)",
  },
  kline_mark: {
    height: "100%",
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    background: theme.palette.background.dark,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  kline_btns: {
    color: theme.palette.grey[500],
    height: 50,
    borderTop: `1px solid rgba(255,255,255,0.6)`,
    borderBottom: `1px solid rgba(255,255,255,0.6)`,
    "& span": {
      display: "block",
      margin: "0 10px",
      padding: "0 2px",
      whiteSpace: "nowrap",
      height: 32,
      lineHeight: "32px",
      borderBottom: `2px solid rgba(0,0,0,0)`,
      "&.selected": {
        color: theme.palette.primary.main,
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      },
    },
  },
  exchange: {
    background: theme.palette.background.dark,
    minHeight: "100%",
  },
  exchange_nav: {
    ...theme.typography.subtitle1,
    color: theme.palette.primary.contrastText,
    padding: "18px 24px",
  },
  exchange_realtime: {
    height: 88,
    padding: "0 24px",
    color: theme.palette.primary.contrastText,
    "& strong": {
      fontSize: 32,
      lineHeight: "40px",
      display: "block",
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
    },
    "& span": {
      color: theme.palette.grey[500],
      minWidth: 50,
      textAlign: "right",
      display: "inline-block",
    },
    "& i": {
      margin: "0 0 0 10px",
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
    },
    "& label": {
      textAlign: "right",
      display: "block",
      margin: "0 0 0 10px",
    },
  },
  trades: {
    padding: "0 24px",
    color: theme.palette.primary.contrastText,
    "& span": {
      ...theme.typography.caption,
      color: theme.palette.grey[500],
    },
  },
  tabs_info: {
    borderBottom: `1px solid  rgba(255,255,255,.05)`,
    margin: "0 0 16px",
  },
  info_tab: {
    ...theme.typography.subtitle2,
    color: theme.palette.grey[500],
    fontWeight: 600,
  },
  exchange_btns: {
    position: "fixed",
    zIndex: 10,
    left: 0,
    bottom: 0,
  },
  green: {
    color: theme.palette.up.main,
  },
  red: {
    color: theme.palette.down.main,
  },
  detailItem: {
    borderTop: `1px solid ${theme.palette.grey[50]}`,
    margin: "10px 0 0",
    padding: "10px 0 0",
    lineHeight: 1.6,
  },
  token_info: {
    padding: "10px 0 10px 24px",
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    "& strong": {
      ...theme.typography.subtitle1,
      fontWeight: 600,
    },
  },
  fundingRate: {
    fontSize: 12,
    borderTop: `1px solid ${theme.palette.grey[50]}`,
    margin: "3px 0 0",
    padding: "3px 0 0",
  },
  settingTitle: {
    padding: 16,
  },
  setting_list: {
    minWidth: 290,
    fontSize: 12,
  },
  secondaryAction: {
    right: 6,
  },
  itemText: {
    "& span": {
      fontSize: 12,
    },
  },
  tabsRoot: {
    minHeight: 36,
    margin: "0 0 10px",
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
  },
  tabRoot: {
    minHeight: 36,
  },
  order: {
    padding: "0 10px 24px 24px",
    background: theme.palette.background.default,
  },
  future_order: {
    background: theme.palette.background.default,
  },
  order_nav: {
    padding: "10px 24px",
  },
  modal_order: {
    minWidth: 300,
    background: theme.palette.background.default,
    padding: "0 10px 24px 24px",
    "& p": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
    },
    "& div": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
      "& span": {
        color: theme.palette.grey[500],
        display: "inline-block",
        width: 88,
      },
    },
  },
  borderBottom: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
  },
  orderTab: {
    whiteSpace: "nowrap",
  },
  getMore: {
    padding: "20px 0",
    textAlign: "center",
    "& p": {
      color: theme.palette.grey[500],
    },
  },
  sides: {
    "& span": {
      margin: "0 10px 0 0",
      cursor: "pointer",
    },
  },
  side: {
    color: theme.palette.primary.main,
  },
  margin_input: {
    margin: "0 !important",
    //width: "50% !important",
    "& input": {
      padding: 0,
    },
  },
  // 增加保证金 弹层
  margin: {
    minWidth: 300,
    padding: "0 20px 20px",
    "& p": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
    },
    "& div": {
      color: theme.palette.grey[800],
      margin: "0 0 10px",
      //display: "flex !important",
      "& span": {
        color: theme.palette.grey[500],
        display: "block",
        margin: "0 0 8px",
        // width: "50%"
        // width: 188
      },
    },
  },
});
