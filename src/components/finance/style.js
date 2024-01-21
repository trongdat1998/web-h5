import helper from "../../utils/helper";
export default (theme) => ({
  // 资产
  tit: {
    display: "flex",
    height: 56,
    padding: "0 24px",
    alignItems: "center",
    "& i": {
      width: 24,
      marginRight: 8,
    },
    "& h2": {
      fontSize: "1.2857rem",
      lineHeight: "26px",
      fontWeight: "bold",
      flex: 1,
    },
  },
  finance_tit: {
    color: theme.palette.common.white,
    background: theme.palette.primary.main,
  },
  total: {
    background: theme.palette.primary.main,
    padding: "2px 24px 15px",
    color: theme.palette.common.white,
    minHeight: 125,
    "& p": {
      ...theme.typography.body2,
      lineHeight: "24px",
      color: "rgba(255, 255, 255, 0.7)",
      display: "flex",
      "& span": {
        flex: 1,
      },
      "& i": {
        color: theme.palette.common.white,
      },
    },
    "& h2": {
      ...theme.typography.display1,
      lineHeight: "32px",
      marginTop: 8,
      "& strong": {
        ...theme.typography.body2,
        lineHeight: "24px",
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
  },
  infobox: {
    background: theme.palette.grey[50],
    padding: "0 0 5px",
  },
  info: {
    // margin: "4px 24px",
    // height: 108,
    background: theme.palette.common.white,
    // backgroundImage: `url(${require("../../assets/finance_line.png")})`,
    // backgroundSize: "166px 49px",
    // backgroundRepeat: "no-repeat",
    // backgroundPosition: "bottom right",
    padding: "16px 24px",
    // borderRadius: 2,
    // boxShadow:
    //   "0px 1px 20px rgba(36, 43, 50, 0.05), 0px 0px 4px rgba(36, 43, 50, 0.2)",
    "& h3": {
      ...theme.typography.body1,
      fontWeight: 500,
      marginBottom: 4,
    },
    "& h2": {
      ...theme.typography.display1,
      marginTop: 4,
      lineHeight: "40px",
      "& strong": {
        ...theme.typography.caption,
        lineHeight: "16px",
        color: theme.palette.grey[500],
      },
    },
    "& p": {
      ...theme.typography.caption,
      lineHeight: "16px",
      color: theme.palette.grey[500],
    },
  },
  content: {
    padding: "15px 24px",
  },
  button: {
    height: 32,
    width: 96,
    fontSize: 12,
    lineHeight: "17px",
    background: "rgba(51, 117, 224, 0.05)",
    "& span": {
      background: "rgba(51, 117, 224, 0.05)",
    },
    "&.select": {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
  },
  inputHeight: {
    width: 120,
    height: 32,
    "& i": {
      color: theme.palette.grey[500],
    },
    "&:before": {
      borderColor: `${theme.palette.grey[500]} !important`,
    },
  },
  input: {
    float: "right",
  },
  list: {
    borderTop: `1px solid rgba(36, 43, 50, 0.05)`,
    marginLeft: 24,
    "& li": {
      padding: "7px 24px 7px 0",
      borderBottom: `1px solid rgba(36, 43, 50, 0.05)`,
      "& h2": {
        fontSize: 14,
        lineHeight: "16px",
        fontWeight: "bold",
      },
    },
  },
  item: {
    display: "flex",
    marginTop: 8,
    "& label": {
      color: theme.palette.grey[500],
    },
    "& >div": {
      width: "30%",
      marginRight: 10,
      "&:first-of-type": {
        width: "40%",
      },
      "&:last-of-type": {
        textAlign: "right",
        marginRight: 0,
      },
    },
  },
  // 充币
  deposit_con: {
    textAlign: "center",
    padding: 24,
    "& img": {
      width: 152,
      height: 152,
      // marginTop: 24
    },
  },
  desc: {
    ...theme.typography.body2,
    color: theme.palette.grey[500],
    lineHeight: "21px",
    "& em": {
      color: "#F69400",
    },
  },
  chain: {
    marginTop: 24,
    textAlign: "left",
    "& p": {
      padding: "4px 0",
      color: theme.palette.grey[500],
      height: 32,
      lineHeight: "24px",
      fontSize: 14,
      fontWeight: "bold",
      wordBreak: "break-all",
    },
  },
  chain_tag: {
    marginTop: 8,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    "& button": {
      ...theme.typography.body2,
      minWidth: 96,
      height: 32,
      margin: "0 0 8px 0",
      borderRadius: 2,
      color: "#000",
      background: theme.palette.common.white,
      border: 0,
      outline: "none",
      boxShadow:
        "0px 1px 2px rgba(44, 53, 61, 0.1), 0px 0px 2px rgba(44, 53, 61, 0.1), 0px 0px 2px rgba(44, 53, 61, 0.1)",
      "&.active": {
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      },
    },
  },
  address: {
    "& p": {
      // marginTop: 24,
      fontSize: 14,
      lineHeight: "16px",
      fontWeight: "bold",
      padding: "8px 0",
      wordBreak: "break-all",
    },
    "& button": {
      minWidth: 136,
      height: 40,
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: 2,
      fontSize: 12,
      fontWeight: "bold",
      color: theme.palette.primary.main,
      background: theme.palette.common.white,
      marginTop: 16,
    },
  },
  tag: {
    "& p": {
      marginTop: 40,
    },
  },
  rule: {
    fontSize: 12,
    lineHeight: "16px",
    color: theme.palette.grey[500],
    marginTop: 24,
    textAlign: "left",
    margin: "48px 0",
    "& p": {
      fontSize: 12,
    },
    "& ul": {
      padding: "0 0 0 20px",
    },
    "& li": {
      fontSize: 12,
      listStyle: "initial",
      "& i": {
        color: theme.palette.secondary.dark,
        fontWeight: 700,
      },
    },
  },
  tip: {
    ...theme.typography.caption,
    display: "flex",
    alignItems: "center",
    textAlign: "left",
    background: "#FDEACC",
    color: "#F69400",
    padding: 8,
    marginTop: 16,
    lineHeight: "16px",
    "& i": {
      marginRight: 4,
    },
  },
  tabs: {
    // margin: "-40px 0 0"
  },
  tab: {
    display: "flex",
    height: 40,
    padding: "0 24px",
    color: theme.palette.common.text,
    alignItems: "center",
    borderBottom: "1px solid rgba(36, 43, 50, 0.05)",
    background: theme.palette.common.white,
    "& .MuiGrid-item": {
      height: 40,
      lineHeight: "40px",
      display: "flex",
      margin: "0 16px 0 0",
      fontWeight: 500,
    },
  },
  choose: {
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  action: {
    margin: "15px 0 0",
    "& .MuiGrid-item": {
      flex: 1,
      margin: "0 15px 0 0",
      "&:last-child": {
        margin: 0,
      },
    },
    "& .MuiButton-outlined": {
      borderColor: helper.hex_to_rgba(theme.palette.common.white, 0.5),
      color: theme.palette.common.white,
      padding: 3,
      width: "100%",
    },
  },
  drawer_modal: {
    width: "85%",
    "& >div": {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  },
  drawer: {
    padding: "0 0 0 24px",
    flex: 1,
    overflowY: "auto",
    "& li": {
      height: 36,
      lineHeight: "36px",
      borderBottom: `1px dashed rgba(36, 43, 50, 0.05)`,
    },
  },
  search_area: {
    padding: "0 10px 0 24px",
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
    "& .MuiFormControl-root": {
      flex: 1,
      margin: "0 20px 0 0",
    },
    "& .MuiInput-root": {
      width: "100%",
    },
  },
});
