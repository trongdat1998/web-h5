import helper from "../../utils/helper";
const n = window.n;
export default (theme) => ({
  body: {
    background: "#BD2730",
    minHeight: "100%",
  },
  step1: {
    background: "#A11651",
    minHeight: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `url(${require("../../assets/bg.jpg")})`,
    textAlign: "center",
    color: theme.palette.common.white,
    padding: `${40 / n}rem 0 ${70 / n}rem`,
    overflow: "hidden",
    "& p": {
      fontSize: `${15 / n}rem`,
      lineHeight: `${22 / n}rem`,
      margin: `${10 / n}rem 0`,
    },
  },
  step1_logo: {
    height: `${28 / n}rem`,
    display: "block",
    margin: "0 auto",
  },
  header: {
    position: "relative",
    color: theme.palette.common.white,
    width: "100%",
    "& img": {
      width: "100%",
      display: "block",
    },
    "& h2": {
      position: "absolute",
      width: "100%",
      top: `${28 / n}rem`,
      left: 0,
      padding: `0 ${150 / n}rem 0 ${18 / n}rem`,
      fontSize: `${20 / n}rem`,
      lineHeight: `${29 / n}rem`,
      fontWeight: "bold",
    },
    "& p": {
      position: "absolute",
      width: "100%",
      fontWeight: 500,
      fontSize: `${15 / n}rem`,
      lineHeight: `${22 / n}rem`,
      top: `${63 / n}rem`,
      padding: `0 ${150 / n}rem 0 ${18 / n}rem`,
    },
  },
  register: {
    padding: `${12 / n}rem ${15 / n}rem ${15 / n}rem`,
  },
  content: {
    background: theme.palette.common.white,
    boxShadow: `inset 0 ${4 / n}rem ${14 / n}rem #FCC3C2`,
    borderRadius: `${6 / n}rem`,
    padding: `${16 / n}rem ${18 / n}rem`,
  },
  formControl: {
    width: "100%",
    margin: `0 0 ${6 / n}rem`,
  },
  indicator: {
    transform: "scale(0.25,1)",
    backgroundColor: theme.palette.primary.main,
  },
  tabs: {
    margin: `0 0 ${12 / n}rem`,
    minHeight: `${36 / n}rem`,
  },
  tab: {
    color: "#99A3BF",
    margin: `0 ${24 / n}rem 0 0`,
    padding: 0,
    minHeight: `${32 / n}rem`,
    minWidth: "auto",
    opacity: 1,
    fontSize: `${17 / n}rem`,
    "&.Mui-selected": {
      color: theme.palette.primary.main,
    },
  },
  inputRoot: {
    display: "block",
    width: "100%",
    height: `${48 / n}rem`,
    margin: `0 0 ${14 / n}rem`,
    "& .MuiInputBase-root": {
      display: "flex",
      height: "100%",
    },
    "& input": {
      // color: "#D8DCE5",
      fontSize: `${15 / n}rem`,
      "&::placeholder": {
        color: "#99A3BF",
        opacity: 1,
      },
    },
    "& .MuiInput-underline:before, & .MuiInput-underline:hover:before, & .MuiInput-underline:after": {
      borderBottom: "1px solid #EDEFF2",
    },
    "& .MuiInput-underline.Mui-error:after": {
      borderColor: "#ED3756",
    },
    "& i": {
      color: theme.palette.primary.main,
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: theme.palette.common.text,
    },
  },
  checkbox: {
    padding: 0,
    fontSize: `${12 / n}rem`,
    "& a": {
      color: theme.palette.primary.main,
    },
    "& .MuiRadio-root": {
      width: `${18 / n}rem`,
      height: `${18 / n}rem`,
      // border: "2px solid #D8DCE5",
      color: "#D8DCE5",
      boxSizing: "border-box",
      borderRadius: "100%",
      margin: `-${2 / n}rem ${8 / n}rem 0 0`,
      "& svg": {
        // display: "none",
      },
      "&.Mui-checked": {
        color: theme.palette.primary.main,
      },
      "& i": {
        color: theme.palette.primary.main,
        marginLeft: `${2 / n}rem`,
      },
    },
  },
  verfCode: {
    ...theme.typography.body2,
    background: "transparent",
    color: theme.palette.primary.main,
    fontSize: `${15 / n}rem`,
    minWidth: `${90 / n}rem !important`,
    padding: `${4 / n}rem`,
    "&:hover": {
      background: "transparent",
    },
    "&.Mui-disabled": {
      background: "transparent",
      color: "#99A3BF",
    },
  },
  button: {
    height: `${48 / n}rem`,
    width: "100%",
    color: theme.palette.common.white,
    fontSize: `${17 / n}rem`,
    margin: "0 auto",
    fontWeight: "bold",
    background: "#D53842",
    // border: "1px solid rgba(86, 204, 242, 0.3)",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      borderColor: "rgba(86, 204, 242, 0.3)",
      background: `${helper.hex_to_rgba("#D53842", 0.8)}`,
    },
    "&.Mui-disabled": {
      background: "#D8DCE5",
      color: theme.palette.common.white,
    },
  },
  line: {
    background: `url(${require("../../assets/line.png")}) no-repeat center`,
    backgroundSize: "100% 100%",
    width: `${133 / n}rem`,
    height: `${8 / n}rem`,
    margin: "0 auto",
  },
  drawer_modal: {
    width: "100%",
    "& >div": {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  },
  drawer: {
    flex: 1,
    overflowY: "auto",
    padding: `${8 / n}rem 0`,
    borderTop: `1px solid ${theme.palette.grey[50]}`,
    "& li": {
      padding: `0 ${16 / n}rem`,
      height: `${48 / n}rem`,
      fontSize: `${17 / n}rem`,
      lineHeight: `${48 / n}rem`,
      // color: "#D8DCE5",
      display: "flex",
      "& span": {
        flex: 1,
        "&:last-of-type": {
          textAlign: "right",
          // color: theme.palette.primary.main,
        },
      },
    },
  },
  search_area: {
    padding: `0 ${16 / n}rem`,
    display: "flex",
    alignItems: "center",
    margin: `${10 / n}rem 0`,
    fontSize: `${15 / n}rem`,
    color: theme.palette.grey[800],
    "& .MuiFormControl-root": {
      flex: 1,
      margin: `0 ${20 / n}rem 0 0`,
    },
    "& .MuiInput-root": {
      width: "100%",
      "& input": {
        color: theme.palette.grey[500],
        fontSize: `${15 / n}rem`,
        lineHeight: `${24 / n}rem`,
        fontWeight: 500,
        "&::placeholder": {
          opacity: 1,
          color: theme.palette.grey[500],
        },
      },
      "&:before,&:after": {
        display: "none",
      },
    },
    "& i": {
      color: theme.palette.grey[800],
    },
  },
  msg: {
    color: "#ED3756",
    fontSize: `${12 / n}rem`,
    minHeight: `${18 / n}rem`,
  },
  bonus_bg: {
    margin: `${50 / n}rem auto 0`,
    position: "relative",
    "& img": {
      width: "100%",
      height: "auto",
    },
  },
  animation: {
    animationName: "$Large, $Bob, $Small, $Move",
    animationDuration: ".4s, .5s, .4s, .5s",
    animationDelay: ".6s, 1.1s, 1.7s, 2.2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "1, 2, 1, 2",
    animationFillMode: "forwards",
    animationDirection: "normal, alternate, normal, alternate",
  },
  "@keyframes Move": {
    "0%": {
      transform: "translateY(0px)",
    },
    "25%": {
      transform: "translateY(20px)",
    },
    "50%": {
      transform: "translateY(0px)",
    },
    "75%": {
      transform: "translateY(-20px)",
    },
    "100%": {
      transform: "translateY(0px)",
    },
  },
  "@keyframes Bob": {
    "0%": {
      transform: "translateY(40px) scale(1.2)",
    },
    "25%": {
      transform: "translateY(0px) scale(1.2)",
    },
    "50%": {
      transform: "translateY(40px) scale(1.2)",
    },
    "75%": {
      transform: "translateY(80px) scale(1.2)",
    },
    "100%": {
      transform: "translateY(40px) scale(1.2)",
    },
  },
  "@keyframes Large": {
    "100%": {
      transform: "translateY(80px) scale(1.2)",
    },
  },
  "@keyframes Small": {
    "100%": {
      transform: "translateY(0px) scale(1)",
    },
  },

  bonus: {
    position: "absolute",
    top: "7%",
    left: 0,
    right: 0,
    "& h2": {
      fontSize: `${21 / 14}rem`,
      lineHeight: `${30 / n}rem`,
      fontWeight: 500,
    },
    "& p": {
      margin: "3.5% 0",
    },
  },
  openBtn: {
    // margin: "9% 0 0",
    position: "absolute",
    top: "28%",
    left: 0,
    right: 0,
    "& img": {
      width: "24.8%",
    },
    "& p": {
      position: "absolute",
      left: 0,
      right: 0,
      top: -5,
      margin: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: `${25 / 14}rem`,
      lineHeight: "36px",
      color: "#C67100",
    },
    "& .em": {
      width: "30%",
      position: "absolute",
      top: "-9.5%",
      left: "35%",
    },
  },
  bonus_em: {
    width: "100%",
    padding: "25.8% 0",
    position: "absolute",
    top: "4.6%",
    "& .em": {
      width: "30%",
    },
  },
  paper: {
    height: `${417 / n}rem`,
    width: `${310 / n}rem`,
    boxShadow: "none",
    background: "transparent",
    position: "relative",
    color: "#2C3242",
  },
  closeBtn: {
    position: "absolute",
    left: `calc(50% - ${14 / n}rem)`,
    bottom: 0,
    color: theme.palette.common.white,
  },
  opened: {
    background: `url(${require("../../assets/opened.png")}) no-repeat center`,
    backgroundSize: "100% 100%",
    // width: `${310 / n}rem`,
    width: "100%",
    height: `${358 / n}rem`,
    position: "relative",
    top: `${9 / n}rem`,
    padding: `${30 / n}rem 0 ${10 / n}rem`,
    textAlign: "center",
    "& p": {
      fontSize: `${15 / n}rem`,
      lineHeight: `${22 / n}rem`,
    },
    "& .info": {
      fontWeight: "bold",
    },
    "& .desc": {
      margin: `${20 / n}rem 0 ${15 / n}rem`,
    },
    "& h3": {
      margin: `${9 / n}rem 0 ${5 / n}rem`,
      fontSize: `${20 / n}rem`,
      lineHeight: `${29 / n}rem`,
      fontWeight: "bold",
    },
    "& strong": {
      fontSize: `${14 / n}rem`,
      lineHeight: `${20 / n}rem`,
      fontWeight: "normal",
      display: "block",
    },
    "& a": {
      margin: `${80 / n}rem 0 0`,
      minWidth: `${103 / n}rem`,
      height: `${30 / n}rem`,
      lineHeight: `${30 / n}rem`,
      border: `1px solid ${theme.palette.common.white}`,
      color: theme.palette.common.white,
      borderRadius: `${15 / n}rem`,
      fontSize: `${12 / n}rem`,
      display: "inline-block",
    },
  },
  looted: {
    "& img": {
      height: `${83 / n}rem`,
      margin: `0 0 ${20 / n}rem`,
    },
  },
});
