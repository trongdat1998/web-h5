import helper from "../../utils/helper";
export default (theme) => ({
  body: {
    background: "#00081D",
  },
  register: {
    padding: "24px 24px 40px",
    maxWidth: 750,
    margin: "0 auto",
    position: "relative",
    "&:before": {
      position: "absolute",
      content: `""`,
      width: "90%",
      height: 2,
      background:
        "linear-gradient(90.49deg, rgba(48, 186, 255, 0) 0%, #30BAFF 48.96%, rgba(48, 186, 255, 0) 100%)",
      top: 0,
      left: "5%",
    },
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
  indicator: {
    transform: "scale(0.2,1)",
    backgroundColor: "#56CCF2",
  },
  tabs: {
    margin: "0 0 20px",
    minHeight: "36px",
  },
  tab: {
    color: "#99A3BF",
    margin: "0 24px 0 0",
    padding: 0,
    minHeight: 32,
    minWidth: "auto",
    opacity: 1,
    fontSize: "1.21428rem",
    "&.Mui-selected": {
      color: "#56CCF2",
    },
  },
  inputRoot: {
    display: "block",
    width: "100%",
    height: 48,
    margin: "0 0 14px",
    "& .MuiInputBase-root": {
      display: "flex",
      height: "100%",
    },
    "& input": {
      color: "#D8DCE5",
      fontSize: 15,
      "&::placeholder": {
        color: "#5C698C",
        opacity: 1,
      },
    },
    "& .MuiInput-underline:before, & .MuiInput-underline:hover:before, & .MuiInput-underline:after":
      {
        borderBottom: "1px solid #2C3242",
      },
    "& .MuiInput-underline.Mui-error:after": {
      borderColor: "#ED3756",
    },
    "& i": {
      color: "#56CCF2",
    },
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
    fontSize: "1.07142rem",
    color: "#D8DCE5",
    "& a": {
      color: "#56CCF2",
    },
    "& .MuiCheckbox-root": {
      width: 18,
      height: 18,
      border: "1px solid #56CCF2",
      boxSizing: "border-box",
      borderRadius: 2,
      margin: "-2px 8px 0 0px",
      "& svg": {
        display: "none",
      },
      "& i": {
        color: "#56CCF2",
        marginLeft: 2,
      },
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
  verfCode: {
    ...theme.typography.body2,
    background: "transparent",
    color: "#56CCF2",
    fontSize: "1.07142rem",
    "&:hover": {
      background: "transparent",
    },
    "&.Mui-disabled": {
      color: "#99A3BF",
    },
  },
  button: {
    height: 48,
    width: "100%",
    color: "#56CCF2",
    fontSize: 17,
    margin: "0 auto 56px",
    fontWeight: "bold",
    background: "rgba(86, 204, 242, 0.1)",
    border: "1px solid rgba(86, 204, 242, 0.3)",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      borderColor: "rgba(86, 204, 242, 0.3)",
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
  link: {
    fontSize: 15,
    lineHeight: "24px",
    color: `${helper.hex_to_rgba("#56CCF2", 0.8)}`,
    letterSpacing: "0.04em",
    textAlign: "center",
  },
  drawer_modal: {
    width: "100%",
    background: "#00081D",
    "& >div": {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  },
  drawer: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0 0",
    borderTop: "1px solid #202430",
    "& li": {
      padding: "0 16px",
      height: 48,
      fontSize: 17,
      lineHeight: "48px",
      color: "#D8DCE5",
      display: "flex",
      "& span": {
        flex: 1,
        "&:last-of-type": {
          textAlign: "right",
          color: "#56CCF2",
        },
      },
    },
  },
  search_area: {
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
    fontSize: 15,
    color: "#99A3BF",
    "& .MuiFormControl-root": {
      flex: 1,
      margin: "0 20px 0 0",
    },
    "& .MuiInput-root": {
      width: "100%",
      "& input": {
        color: "#5C698C",
        fontSize: 15,
        lineHeight: "24px",
        fontWeight: 500,
        "&::placeholder": {
          opacity: 1,
          color: "#5C698C",
        },
      },
      "&:before,&:after": {
        display: "none",
      },
    },
    "& i": {
      color: "#5C698C",
    },
  },
  result: {
    padding: "240px 24px 40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "375px 280px",
    minHeight: "100%",
    "& img": {
      width: "375px",
      height: "auto",
    },
    "& h2": {
      fontSize: 25,
      fontWeight: 500,
      lineHeight: "36px",
      color: "#56CCF2",
      margin: "0 auto",
    },
    "& p": {
      fontSize: 17,
      lineHeight: "25px",
      margin: "16px auto 0",
      color: "#D8DCE5",
    },
  },
  result_btn: {
    margin: "207px auto 24px",
    height: 48,
    width: "100%",
    color: "#56CCF2",
    fontSize: 17,
    fontWeight: "bold",
    background: "rgba(86, 204, 242, 0.1)",
    border: "1px solid rgba(86, 204, 242, 0.3)",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  msg: {
    color: "#ED3756",
  },
});
