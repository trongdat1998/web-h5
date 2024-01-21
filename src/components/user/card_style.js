export default theme => ({
    list: {
      padding: `${theme.typography.pxToRem(54)} 0 0`,
      "& h2": {
        ...theme.typography.display1,
        color: theme.palette.secondary.contrastText,
        padding: "40px 0"
      }
    },
    item: {
      width: theme.typography.pxToRem(360),
      margin: `${theme.typography.pxToRem(10)} auto`,
    },
    card: {
      width: theme.typography.pxToRem(360),
      height: theme.typography.pxToRem(195),
      background: `url(${require("../../assets/locked.png")}) no-repeat`,
      backgroundSize: "100% 100%",
      padding: `${theme.typography.pxToRem(16)} ${theme.typography.pxToRem(32)}`,
      textAlign: "center",
      position: "relative"
    },
    cardInfo: {
      padding: `${theme.typography.pxToRem(18)} ${theme.typography.pxToRem(56)} ${theme.typography.pxToRem(18)} 0`,
      "& p": {
        "&:nth-of-type(1)": {
          ...theme.typography.body2
        },
        "&:nth-of-type(2)": {
          color: theme.palette.secondary.contrastText,
          fontSize: theme.typography.pxToRem(12),
          lineHeight: theme.typography.pxToRem(18),
          fontWeight: 500,
          marginTop: theme.typography.pxToRem(12),
          "& i": {
            verticalAlign: "text-bottom",
            marginRight: theme.typography.pxToRem(5)
          }
        }  
      },
      "& strong": {
        ...theme.typography.heading,
        marginTop: theme.typography.pxToRem(10),
        display: "block",
        color: "#EDB83F"
      },
      "& em": {
        ...theme.typography.caption,
        display: "block",
        marginTop: theme.typography.pxToRem(10),
        color: theme.palette.grey[500],
        padding: `0 ${theme.typography.pxToRem(5)}`,
        flexWrap: "wrap"
      }
    },
    status: {
      borderBottom: `1px dotted #EDB83F`,
      height: theme.typography.pxToRem(56),
      lineHeight: theme.typography.pxToRem(56),
      width: theme.typography.pxToRem(163),
      transform: "rotate(90deg)",
      transformOrigin: "top right",
      position: "absolute",
      right: theme.typography.pxToRem(32),
      bottom: theme.typography.pxToRem(-40),
      "& span": {
        fontWeight: 500,
        fontSize: theme.typography.pxToRem(12),
        lineHeight: theme.typography.pxToRem(18)
      },
      "& i": {
        transform: "rotate(-90deg)",
        transformOrigin: "center",
        marginRight: theme.typography.pxToRem(10)
      }
    },
    used: {
      borderBottom: `1px dotted ${theme.palette.grey[100]}`
    },
    expired: {
      background: `url(${require("../../assets/expired.png")}) no-repeat`,
      backgroundSize: "100% 100%",
      "& strong": {
        color: theme.palette.grey[500]
      },
      "& span": {
        color: theme.palette.grey[500]
      }
    },
    info: {
      padding: `${theme.typography.pxToRem(8)} 0 ${theme.typography.pxToRem(13)}`,
      flex: 1,
      "& >div": {
        marginTop: theme.typography.pxToRem(10),
        ...theme.typography.body2,
        display: "flex",
        "& span": {
          flex: 1,
          color: theme.palette.grey[500]
        },
        "& em": {
          flex: 2
        }
      }
    },
    nav: {
      padding: `${theme.typography.pxToRem(16)} 0 ${theme.typography.pxToRem(8)}`,
      display: "flex",
      width: "100%",
      background: theme.palette.common.white,
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 1,
      boxShadow: theme.shadows[1],
      "& p": {
        ...theme.typography.subtitle1,
        flex: 1,
        textAlign: "center"
      }
    },
    navShadow: {
      boxShadow: theme.shadows[1],
    },
    active: {
      color: `${theme.palette.primary.main} !important`
    },
    noData: {
      textAlign: "center",
      "& img": {
        width: theme.typography.pxToRem(77),
        height: theme.typography.pxToRem(66),
        margin: `0 0 ${theme.typography.pxToRem(16)}`
      },
      "& p": {
        ...theme.typography.caption,
        color: theme.palette.grey[500]
      }
    },
    grey: {
      color: `${theme.palette.grey[500]} !important`
    }  
  });
  