import helper from "../../utils/helper";

export default (theme) => ({
  tokenInfo: {
    background: theme.palette.background.default,
  },
  topic: {
    background: `url(${require("../../assets/defi_bg.png")}) no-repeat #000C34`,
    backgroundSize: "cover",
    padding: "20px 20px 20px",
    "& h2": {
      fontSize: 30,
      lineHeight: "46px",
      margin: "0 0 8px",
      color: "#fff",
      "& strong": {
        color: "#0FCCF5",
      },
    },
    "& a": {
      background: "rgba(51, 117, 224, 0.2)",
      border: "1px solid #3D68AD",
      color: theme.palette.common.white,
      fontSize: 12,
      height: 30,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
    },
    "& img": {
      margin: "0 0 0 6px",
    },
    "& p": {
      color: theme.palette.grey[100],
      fontSize: 12,
      lineHeight: "16px",
      margin: "18px 0 0",
    },
  },
  tabsbox: {
    boxShadow: "0px 2px 10px rgba(163, 177, 204, 0.25)",
  },
  conbox: {
    padding: "0 20px",
  },
  tab: {
    fontSize: 14,
    color: theme.palette.common.text,
  },
  tokenItem: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    height: 70,
    "& span": {
      display: "block",
      lineHeight: "16px",
      color: theme.palette.grey[500],
      fontSize: 12,
    },
    "& label": {
      display: "block",
      lineHeight: "24px",
    },
    "& strong, & label": {
      display: "block",
      lineHeight: "24px",
      fontWeight: 500,
      fontSize: 18,
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "& i": {
      color: theme.palette.primary.contrastText,
      height: 24,
      lineHeight: "24px",
      fontSize: 12,
      minWidth: 64,
      borderRadius: 2,
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
    },
    "& a": {
      background: helper.hex_to_rgba(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      fontSize: 16,
      fontWeight: 500,
      display: "block",
      padding: "2px 0",
      textAlign: "center",
      height: 32,
      lineHeight: "28px",
      maxWidth: 100,
      minWidth: 60,
    },
  },
});
