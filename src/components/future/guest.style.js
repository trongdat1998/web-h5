export default theme => ({
  container: {
    paddingBottom: 32,
    minHeight: 600
  },
  header: {
    marginTop: 18,
    padding: "0 20px"
  },
  title: {
    ...theme.typography.display2,
    color: theme.palette.common.black
  },
  tip: {
    marginTop: 16,
    lineHeight: "24px",
    color: theme.palette.grey[800]
  },
  steper: {
    marginTop: 36,
    padding: "0 20px",
    margin: "0 auto 28px"
  },
  steperRoot: {
    backgroundColor: "transparent",
    padding: 0
  },
  circleButton: {
    borderRadius: "50%",
    heigth: 40,
    width: 40,
    background: theme.palette.common.white
  },
  steperName: {
    color: theme.typography.contrastText,
    fontSize: "12px",
    border: "4px solid rgba(255,255,255,0.4)",
    boxShadow: "none",
    padding: "2px 6px",
    "& + div": {
      margin: 4
    },
    borderRadius: "50px",
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:disabled": {
      background: theme.palette.grey[100],
      color: theme.palette.grey[500]
    },
    "&:hover": {
      background: theme.palette.primary.main,
      color: theme.palette.common.white
    }
  },
  knowledge: {
    padding: "0 24px",
    "& > div": {
      marginTop: 20
    },
    "& h3": {
      ...theme.typography.subtitle2,
      fontSize: 16,
      heigth: 24,
      // lineHeight: '24px',
      fontWeight: "bold",
      color: theme.palette.grey[800],
      margin: "16px 0 8px"
    },
    "& > div >p": {
      fontSize: 14,
      lineHeight: "23px",
      marginTop: 8,
      color: theme.palette.grey[800]
    }
  },
  buttons: {
    margin: "10px 0 0 24px"
  },
  centerBtn: {
    display: "flex",
    justifyContent: "center",
    margin: "8px 0 0"
  },
  button: {
    marginRight: "10px",
    borderRadius: 2,
    height: 32,
    padding: "2px 16px",
    "&:nth-last-child(1)": {
      marginRight: 0
    }
  },
  firstBtn: {
    border: "1px solid " + theme.palette.common.black,
    borderWidth: 1
  },
  question: {
    padding: "0 24px",
    "& > div": {
      marginTop: 20,
      "& > b": {
        minWidth: 75,
        display: "inline-block",
        textAlign: "left"
      }
    }
  },
  error: {
    margin: "0 24px",
    padding: "12px 10px",
    color: theme.palette.error.main,
    background: "rgba(210,52,52, 0.2)",
    "&  svg": {
      verticalAlign: "middle"
    }
  },
  errorTip: {
    "& > h3": {
      color: theme.palette.error.main
    }
  },
  noticeTip: {
    color: theme.palette.error.main
  },
  finish: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > img": {
      width: 48
    },
    "& h1": {
      textAlign: "center",
      fontSize: 16,
      lineHeight: "24px",
      margin: "16px 0 0",
      "& span": {
        fontWeight: "bold"
      }
    },
    "& >p": {
      ...theme.typography.body2
    }
  },
  link: {
    color: theme.palette.primary.main
  },
  service: {
    textAlign: "center",
    margin: "20px auto 0",
    "& img": {
      maxWidth: 120,
      maxHeight: 120
    },
    "& p": {
      ...theme.typography.caption,
      lineHeight: "16px",
      margin: "8px 0 0"
    }
  },
  connectorActive: {
    "& $connectorLine": {
      borderColor: theme.palette.primary.main
    }
  },
  connectorCompleted: {
    "& $connectorLine": {
      borderColor: theme.palette.primary.main
    }
  },
  connectorDisabled: {
    "& $connectorLine": {
      borderColor: theme.palette.grey[200]
    }
  },
  connectorLine: {
    transition: theme.transitions.create("border-color")
  }
});
