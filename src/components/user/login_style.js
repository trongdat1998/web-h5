export default (theme) => ({
  login: {
    padding: "24px 30px",
    maxWidth: 750,
    margin: "0 auto",
  },
  content: {
    "& h1": {
      ...theme.typography.display1,
      color: theme.palette.common.text,
      margin: " 0 0 50px",
      textAlign: "center",
    },
  },
  formControl: {
    width: "100%",
    margin: "0 0 6px",
  },
  helper_text: {
    marginTop: 6,
    "& i": {
      fontSize: "0.857rem",
      margin: "0 5px 0 2px",
    },
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
    margin: "0 0 24px",
  },
  tab: {
    ...theme.typography.caption,
    color: theme.palette.common.text,
  },
  selected: {
    color: theme.palette.primary.main,
  },
  national_code: {
    minWidth: 90,
    "&::before": {
      border: 0,
    },
  },
  link: {
    margin: "40px 0 0",
    textAlign: "center",
    ...theme.typography.caption,
    color: theme.palette.common.text,
    "& a": {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.light,
      },
    },
  },
  checkbox: {
    padding: 0,
    fontSize: "0.85714rem",
    color: "#787878",
    "& a": {
      color: "#fea673",
    },
  },
  root: {
    width: 20,
    height: 20,
    padding: 0,
    margin: "-1px 2px 0 0",
    "& svg": {
      width: 16,
      height: 16,
      color: "#fea673",
    },
  },
  invite_register: {
    height: "100vh",
    background: `url(${require("../../assets/landingbg.png")}) no-repeat center bottom`,
  },
  invite_user: {
    padding: "96px 0 0",
    textAlign: "center",
    "& strong": {
      ...theme.typography.subtitle1,
      color: theme.palette.common.text,
      display: "block",
    },
    "& span": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
    },
  },
  invite_logo: {
    ...theme.typography.display2,
    color: theme.palette.common.text,
    textAlign: "center",
    margin: "32px 0 120px",
  },
  invite_btn: {
    textAlign: "center",
    "& a": {
      width: 150,
    },
  },
  invite_register2: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  invite_logo2: {
    textAlign: "center",
    "& h1": {
      ...theme.typography.display2,
      color: theme.palette.common.text,
      textAlign: "center",
      margin: "50px auto 0",
    },
    "& img": {
      maxHeight: 53,
    },
  },
  invite_download: {
    textAlign: "center",
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[500],
      margin: "0 0 28px",
    },
  },
  wx_tip: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    background: "rgba(0,0,0,0.8)",
    textAlign: "right",
    padding: "32px 40px 0 0",
    "& img": {
      width: 70,
      margin: "0 0 20px",
    },
    "& p": {
      color: "#fff",
      fontSize: "1rem",
      textAlign: "left",
      paddingLeft: "50%",
    },
  },
  oauth_info: {
    margin: "0 0 20px",
    "& p": {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      margin: " 0 0 10px",
    },
    "& ul": {
      padding: "10px 30px",
    },
    "& li": {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      listStyleType: "initial",
      padding: "0 0 4px",
    },
  },
  register_step: {
    background: "#fff",
    minHeight: "100vh",
    padding: 0,
  },

  content2: {
    width: "93%",
    margin: "0 auto 0",
    position: "relative",
    zIndex: 10,
    top: -10,
    //background: "#2a66d8",
    borderRadius: 20,
    padding: "10px 10px 15px",
    //boxShadow:"0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12),0px 2px 4px rgba(0, 0, 0, 0.14)"
  },
  tabContainer2: {
    background: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: "14px 16px",
    boxShadow: "0px 1px 15px rgba(115, 144, 244, 0.4)",
  },
  register_step_input: {
    background: "rgba(219, 234, 255, 0.63)",
    borderRadius: 13,
    padding: "4px 15px 4px 13px",
    "& input": {
      paddingLeft: 10,
      height: "1.358em",
      lineHeight: "1.358em",
      color: "#fea673",
      flex: 1,
      caretColor: "#fea673",
    },
    "& input::placeholder": {
      color: "#fea673",
      opacity: 1,
    },
    "& img": {
      width: 20,
      height: 20,
    },
  },
  verfCode2: {
    borderRadius: 7,
    background: "none",
    border: "1px solid #fea673",
    color: "#fea673",
    padding: 0,
    minHeight: 20,
    minWidth: "85px !important",
    fontSize: "1rem",
    boxShadow: 0,
    "&:disabled": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  select: {
    color: "#fea673",
    border: 0,
    borderRight: `1px solid #dbeaff`,
    backgroundColor: "transparent !important",
    borderRadius: 0,
    zIndex: 1,
    appearance: "none",
    padding: "0 22px 0 5px",
    height: "100%",
    fontSize: 14,
    "& svg": {
      color: "#fea673",
    },
    "&:before, &:after": {
      display: "none",
    },
    "& >div": {
      backgroundColor: "transparent !important",
      padding: "8px 20px 8px 5px",
    },
    "&:hover": {
      backgroundColor: "transparent !important",
    },
    "&:focus": {
      backgroundColor: "transparent !important",
      outline: "none",
    },
  },
  arrow: {
    width: 0,
    position: "relative",
    fontSize: 12,
    right: 20,
    transform: "scale(0.8)",
    color: "#fea673",
    zIndex: 0,
  },

  captchaWrapper: {
    display: "flex",
    justifyContent: "center",
  },
});
