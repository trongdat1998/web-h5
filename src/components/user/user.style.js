export default theme => ({
  user_setting: {
    height: "calc(100vh - 56px)",
    background: theme.palette.grey[50],
    display: "flex",
    flexDirection: "column"
  },
  user_info: {
    background: theme.palette.background.default,
    padding: 24
  },
  user_icon: {
    background: theme.palette.primary.main,
    opacity: 0.3
  },
  user_desc: {
    margin: "10px 0 0",
    "& strong": {
      display: "block",
      ...theme.typography.body1
    },
    "& span": {
      color: theme.palette.grey[500]
    },
    "& label": {
      display: "inline-block",
      padding: "0 4px",
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: 2,
      margin: "0 0 0 5px"
    },
    "& a": {
      color: theme.palette.primary.main
    }
  },
  setting: {
    background: theme.palette.background.default,
    padding: "0 0 0 8px",
    margin: "8px 0 0",

    "& i": {
      color: theme.palette.grey[500]
    }
  },
  borderTop: {
    borderTop: `1px solid ${theme.palette.grey[50]}`
  },
  option_item: {
    textAlign: "right",
    color: theme.palette.grey[500],
    padding: "0 24px 0 0"
  },
  item: {
    textAlign: "right",
    color: theme.palette.grey[500]
  },
  logout: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    padding: "0 24px 20px"
  }
});
