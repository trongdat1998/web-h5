import helper from "../../utils/helper";
export default (theme) => ({
  blank: {
    background: theme.palette.background.part,
    height: 8,
    width: "100%",
  },
  info: {
    padding: "16px 24px 24px",
    display: "flex",
  },
  grade_icon: {
    width: 88,
    margin: "0 7px 0 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    "& img": {
      width: 88,
      height: 88,
    },
    "& p": {
      fontSize: 17,
      lineHeight: "24px",
    },
  },
  trade_info: {
    ...theme.typography.body2,
    lineHeight: 1.75,
    borderLeft: `1px solid ${theme.palette.grey[50]}`,
    padding: "0 0 0 24px",
    flex: 1,
    "& ul": {
      margin: "16px 0 0",
      "& li": {
        display: "flex",
        "& label": {
          flex: 1,
        },
        "& span": {
          flex: 1.35,
          textAlign: "right",
          color: theme.palette.primary.light,
        },
      },
    },
  },
  content: {
    overflowX: "auto",
    "-webkit-overflow-scrolling": "touch",
    scrollbarWidth: "none",
    "-ms-overflow-style": "none",
    "&::-webkit-scrollbar": {
      display: "none",
      width: 0,
      height: 0,
      backgroundColor: "transparent",
    },
  },
  section: {
    margin: "0 15px 24px",
    "& h2": {
      fontSize: 17,
      lineHeight: "24px",
      margin: "0 0 8px 0",
      fontWeight: 500,
    },
  },
  condition: {
    "& p": {
      ...theme.typography.body2,
      margin: "0 0 2px",
      "&:last-of-type": {
        margin: 0,
      },
    },
    "& h3": {
      ...theme.typography.body2,
      margin: "8px 0",
      fontWeight: 500,
    },
  },
  table: {
    margin: "16px 0 24px",
    textAlign: "center",
    "& h3": {
      ...theme.typography.subtitle1,
      height: 40,
      lineHeight: "40px",
      background: theme.palette.background.part,
    },
    "& table": {
      borderLeft: `1px solid ${theme.palette.grey[50]}`,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      "& .MuiTableCell-root": {
        borderBottom: `1px solid ${theme.palette.grey[50]}`,
        borderRight: `1px solid ${theme.palette.grey[50]}`,
        padding: "10px 3px",
        "&:last-of-type": {
          borderRight: 0,
        },
      },
      "& th": {
        ...theme.typography.caption,
        lineHeight: "20px",
      },
      "& td": {
        ...theme.typography.body2,
        color: theme.palette.primary.main,
      },
    },
  },
  about: {
    ...theme.typography.body2,
    wordBreak: "break-all",
    "& img": {
      maxWidth: "100%",
    },
    "& p": {
      lineHeight: 1.5,
      margin: "8px 0",
    },
    "& a": {
      color: theme.palette.primary.main,
    },
  },
  half: {
    flex: 1,
    margin: "0 8px 0 0",
    background: theme.palette.common.white,
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    padding: 16,
    textAlign: "center",
    "&:last-of-type": {
      margin: "0 0 0 8px",
    },
    "& h4": {
      ...theme.typography.caption,
      margin: "0 0 8px",
    },
    "& span": {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: helper.hex_to_rgba(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      margin: "0 auto 8px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& p": {
      fontWeight: 500,
      fontSize: 17,
      lineHeight: "25px",
      color: theme.palette.primary.main,
    },
    "&.error": {
      "& span": {
        background: helper.hex_to_rgba(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
      },
      "& p": {
        color: theme.palette.error.main,
      },
    },
  },
  slider_bg: {
    width: "calc(100% + 30px)",
    margin: "0 -15px",
    overflow: "scroll",
  },
  slider: {
    margin: "0 35px",
    "& .MuiSlider-root": {
      padding: "5px 0",
      margin: 0,
      height: 10,
    },
    "& .MuiSlider-rail": {
      height: 10,
      opacity: 1,
      background: theme.palette.background.part,
    },
    "& .MuiSlider-track": {
      height: 10,
      background: helper.hex_to_rgba(theme.palette.primary.main, 0.2),
    },
    "& .MuiSlider-mark": {
      width: 10,
      height: 10,
      background: theme.palette.grey[100],
      borderRadius: "100%",
      marginLeft: -5,
    },
    "& .MuiSlider-thumb": {
      width: 10,
      height: 10,
      margin: "0 0 0 -5px",
      "&:after": {
        top: -5,
        left: -5,
        border: `1px solid ${theme.palette.primary.main}`,
        boxSizing: "border-box",
        width: 20,
        height: 20,
        borderRadius: "100%",
      },
    },
    "& .MuiSlider-markLabel": {
      top: -30,
      lineHeight: 1.75,
      color: theme.palette.grey[800],
      fontWeight: 500,
    },
    "& .MuiSlider-markActive": {
      background: theme.palette.primary.main,
      opacity: 1,
    },
    "& .MuiSlider-markLabelActive": {
      color: theme.palette.primary.main,
      "&:last-child": {
        color: `${theme.palette.primary.main} !important`,
      },
    },
  },
  indicator: {
    transform: "scale(0.5,1)",
  },
  tabs: {
    minHeight: "auto",
    margin: "0 0 8px",
    padding: "0 15px",
  },
  tab: {
    ...theme.typography.subtitle2,
    color: theme.palette.common.text,
    margin: "0 20px 0 0",
    padding: 0,
    minHeight: 42,
    minWidth: "auto",
  },
  desc_con: {
    // minWidth: 950,
    padding: "0 15px 10px",
  },
  table: {
    width: "100%",
    overflow: "scroll",
    border: `1px solid ${theme.palette.grey[50]}`,
    "& thead": {
      backgroundColor: theme.palette.background.part,
      "& .MuiTableRow-head": {
        // border: `1px solid ${theme.palette.grey[50]}`,
        borderTop: `1px solid ${theme.palette.grey[50]}`,
        borderBottom: `1px solid ${theme.palette.grey[50]}`,
      },
    },
    "& tbody": {
      "& .MuiTableRow-root": {
        // border: `1px solid ${theme.palette.grey[50]}`,
        // borderTop: 0,
        "&:hover": {
          backgroundColor: theme.palette.background.part,
        },
        "&.selected": {
          border: `1px solid ${helper.hex_to_rgba(
            theme.palette.primary.main,
            0.4
          )}`,
          borderTop: 0,
          position: "relative",
          "& td": {
            borderTop: `1px solid ${helper.hex_to_rgba(
              theme.palette.primary.main,
              0.4
            )}`,
          },
          "& td:first-of-type": {
            color: theme.palette.primary.main,
            position: "relative",
            "& i": {
              position: "absolute",
              left: 5,
              top: "50%",
              marginTop: -12,
            },
          },
        },
        "& h4": {
          fontWeight: 500,
          margin: "3px 0",
        },
      },
    },
    "& th": {
      color: theme.palette.grey[800],
      padding: 0,
      border: 0,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      "&:last-of-type": {
        borderRight: 0,
      },
    },
    "& td": {
      border: 0,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      "&:nth-of-type(1)": {
        minWidth: 134,
        padding: "0 30px",
        "& p": {
          overflow: "hidden",
          maxWidth: 73,
          margin: "0 auto",
          whiteSpace: "nowrap",
        },
      },
      "&:nth-of-type(2)": {
        minWidth: 360,
      },
      "&:nth-of-type(3), &:nth-of-type(4)": {
        minWidth: 120,
      },
      "&:nth-of-type(5)": {
        minWidth: 100,
      },
      "&:last-of-type": {
        borderRight: 0,
        minWidth: 100,
        color: theme.palette.primary.main,
        "&.error": {
          color: theme.palette.error.main,
        },
      },
    },
    "& .MuiTableCell-root": {
      paddingLeft: 0,
      paddingRight: 0,
      fontSize: 12,
      "& .whole": {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        "& em": {
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 35,
          height: "100%",
        },
      },
    },
    "& th em": {
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      padding: "0 5px",
      "&:last-of-type": {
        borderRight: 0,
      },
    },
  },
  rate_table: {
    width: "100%",
    overflow: "scroll",
    border: `1px solid ${theme.palette.grey[50]}`,
    "& thead": {
      backgroundColor: theme.palette.background.part,
      "& .MuiTableRow-head": {
        borderTop: `1px solid ${theme.palette.grey[50]}`,
        borderBottom: `1px solid ${theme.palette.grey[50]}`,
      },
      "& th:first-of-type": {
        padding: 0,
        backgroundColor: theme.palette.background.part,
      },
    },
    "& tbody": {
      "& .MuiTableRow-root": {
        "& td": {
          backgroundColor: theme.palette.common.white,
        },
        "&:hover td": {
          backgroundColor: theme.palette.background.part,
        },
      },
    },
    "& th, & td": {
      color: theme.palette.grey[800],
      border: 0,
      borderRight: `1px solid ${theme.palette.grey[50]}`,
      minWidth: 115,
      borderBottom: `1px solid ${theme.palette.grey[50]}`,
      "&:last-of-type": {
        borderRight: 0,
      },
      "&:first-of-type": {
        position: "sticky",
        left: 0,
        boxShadow: "4px 4px 4px hsla(0,0%,39.2%,.1)",
        width: 115,
      },
    },
  },
  item: {
    margin: "0 0 15px",
    "&:last-of-type": {
      margin: 0,
    },
  },
  first: {
    "&.MuiTableRow-root:hover": {
      backgroundColor: "transparent !important",
    },
    "& td": {
      padding: "6px 5px",
    },
  },
  up: {
    padding: "9px 0",
    minHeight: 43,
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
  },
  down: {
    height: 80,
  },
  fold_up: {
    padding: 0,
    "& span": {
      fontSize: 12,
      lineHeight: "14px",
      color: theme.palette.error.main,
    },
  },
  red: {
    color: theme.palette.error.main,
  },
  way: {
    flex: 1,
    borderRight: `1px solid ${theme.palette.grey[50]}`,
    "& p": {
      minHeight: 40,
      "&:first-of-type": {
        borderBottom: `1px solid ${theme.palette.grey[50]}`,
      },
    },
    "&:last-of-type": {
      borderRight: 0,
    },
  },
  mask: {
    display: "flex",
    height: 66,
    position: "relative",
    "& >div:first-child": {
      textAlign: "center",
      flex: "1 1 0%",
      alignSelf: "flex-end",
      height: 33,
      lineHeight: "33px",
    },
    "& >div:last-child": {
      alignSelf: "flex-start",
      flex: "1 1 0%",
      height: 33,
      lineHeight: "33px",
    },
    "&:after": {
      position: "absolute",
      content: '""',
      width: 140,
      height: 1,
      background: theme.palette.grey[100],
      top: 30,
      left: -16,
      transform: "rotate(30deg)",
    },
  },
  tip: {
    margin: "8px 0",
    color: theme.palette.error.main,
  },
});
