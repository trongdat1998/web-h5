export default (theme) => ({
  tokenInfo: {
    background: theme.palette.background.default,
  },
  quotes: {
    // height:"calc(100vh - 96px)"
  },
  quoteTokens: {
    minHeight: 40,
    boxShadow: theme.shadows[0],
    ...theme.typography.subtitle2,
    fontWeight: 500,
  },
  quotesTypes: {
    padding: "10px 0",
  },
  subtitle2: {
    fontSize: "1.14rem",
    fontWeight: 600,
  },
  sort: {
    padding: "10px 24px",
  },
  trade: {
    padding: "0 8px 0 24px",
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
  handicap: {
    padding: "0 24px 0 8px",
  },
  handicap_exchange: {
    padding: "6px 24px",
    marginTop: "8px",
    borderTop: `1px solid rgba(255,255,255,.05)`,
  },
  handicapList: {
    height: 330,
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
  underline: {
    display: "none",
  },
  token_info: {
    padding: "16px 24px",
    "& strong": {
      ...theme.typography.subtitle1,
      fontWeight: 600,
    },
  },
  green: {
    color: theme.palette.up.main,
  },
  red: {
    color: theme.palette.down.main,
  },
  order_type: {
    position: "relative",
    width: "100%",
    height: 24,
    margin: "20px 0 0",
  },
  order_type_info: {
    color: theme.palette.grey[500],
    fontSize: "12px",
    position: "absolute",
    width: "100%",
    height: 24,
    top: 0,
    left: 0,
    zIndex: 2,
    pointerEvents: "none",
    "& i": {
      color: theme.palette.common.text,
    },
  },
  balance: {
    ...theme.typography.caption,
    margin: "18px 0 0",
    color: theme.palette.grey[500],
  },
  searchbox: {
    display: "flex",
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
  },
  search_input: {
    padding: "6px 10px",
  },
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
  input: {
    "& input": {
      padding: "12px 14px",
    },
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
  order: {
    padding: "0 10px 24px 24px",
    background: theme.palette.background.default,
    // height:"calc(100vh - 96px)"
  },
  getMore: {
    padding: "10px 0",
    textAlign: "center",
    "& p": {
      color: theme.palette.grey[500],
    },
  },
  order_nav: {
    padding: "10px 0",
    margin: "0 0 10px",
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
  selectSymbol: {
    overflow: "hidden",
  },
  exchange: {
    background: theme.palette.background.dark,
    minHeight: "100%",
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
  base_token_info: {
    color: theme.palette.primary.contrastText,
    padding: "0 24px",
    "& label": {
      color: theme.palette.grey[500],
      display: "block",
      height: 32,
      lineHeight: "32px",
    },
    "& i": {
      color: theme.palette.grey[500],
    },
    "& h2": {
      fontSize: `${24 / 14}rem`,
      padding: "13px 0 4px",
    },
    "& .desc": {
      margin: "16px 0",
      lineHeight: "20px",
      wordBreak: "break-all",
    },
    "& li": {
      padding: "8px 0",
      borderTop: `1px solid rgba(255,255,255,.05)`,
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
  orderTab: {
    whiteSpace: "nowrap",
  },
  "@media screen and (max-width: 340px)": {
    exchange_realtime: {
      "& strong": {
        fontSize: 24,
        lineHeight: "30px",
      },
    },
    handicapItemEx: {
      fontSize: 12,
    },
    handicap_exchange: {
      padding: "6px 12px",
    },
    trades: {
      fontSize: 12,
      padding: "0px 12px",
    },
    handicapInfo: {
      "& strong": {
        fontSize: 12,
      },
    },
  },
});
