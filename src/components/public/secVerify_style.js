export default theme => ({
  noVerify: {
    padding: "50px 30px 0",
    "& p": {
      ...theme.typography.body1,
      color: theme.palette.common.text,
      margin: "0 0 20px"
    },
    "& em": {
      cursor: "pointer",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: theme.palette.common.text,
      width: "100%",
      "&:hover": {
        background: "rgba(0, 0, 0, 0.1)"
      }
    },
    "& div": {
      display: "flex",
      margin: "0 0 40px",
      "& a": {
        display: "flex",
        position: "relative",
        width: "200px",
        height: "60px",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${theme.palette.grey[500]}`,
        transition: "all 0.3s ease-in-out",
        borderRadius: "3px",
        "&:nth-child(2n + 1)": {
          margin: "0 20px 0 0"
        },
        "&:hover": {
          border: `1px solid ${theme.palette.primary.main}`
        },
        "& i": {
          position: "absolute",
          right: "0px",
          top: "0px",
          fontSize: "12px",
          color: theme.palette.common.white,
          background: theme.palette.primary.main,
          display: "inline-block",
          height: "16px",
          lineHeight: "16px",
          padding: "0 9px",
          borderRadius: "2px"
        }
      }
    }
  },
  verify: {
    padding: "50px 30px 0"
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    margin: "0 0 24px"
  },
  tab: {
    ...theme.typography.caption,
    color: theme.palette.common.text
  },
  selected: {
    color: theme.palette.primary.main
  },
  item: {
    margin: "0 0 20px",
    display: "none"
  },
  on: {
    margin: "0 0 20px"
  },
  input: {
    width: "100%"
  },
  button: {
    width: "100%"
  },
  verfCode: {}
});
