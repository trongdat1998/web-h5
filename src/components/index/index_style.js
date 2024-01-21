export default (theme) => ({
  home: {
    background: theme.palette.grey[50],
    // height:"calc(100vh - 96px)"
  },
  banner: {
    height: 150,
    position: "relative",
    background: theme.palette.background.paper,
  },
  stepper: {
    justifyContent: "center",
    background: "none",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  dot: {
    background: theme.palette.grey[500],
  },
  dotActive: {
    background: theme.palette.primary.contrastText,
  },
  messages: {
    margin: "2px 0 8px",
    padding: "0 12px",
    height: 24,
    background: theme.palette.background.paper,
    "& i": {
      color: theme.palette.primary.main,
    },
  },
  announcements: {
    width: "100%",
    height: 24,
    overflow: "hidden",
    lineHeight: "24px",
    "& a": {
      color: theme.palette.grey[800],
    },
  },
  content: {
    padding: "14px 24px 0",
    margin: "8px 0 0",
    background: theme.palette.background.paper,
    "& h2": {
      ...theme.typography.subtitle1,
      color: theme.palette.common.text,
    },
  },
  tabs: {
    background: theme.palette.background.paper,
  },
  tab: {
    height: 32,
    margin: "4px 0 0",
    "& span": {
      ...theme.typography.subtitle1,
      color: theme.palette.common.text,
      transition: "all .3s ease-in-out",
      fontWeight: 500,
      lineHeight: "32px",
      margin: "0 42px 0 0",
    },
  },
  choose: {
    color: `${theme.palette.primary.main} !important`,
  },
  tokenItem: {
    borderBottom: `1px solid ${theme.palette.grey[50]}`,
    height: 70,
    "& span": {
      display: "block",
      lineHeight: "16px",
      color: theme.palette.grey[500],
    },
    "& label": {
      display: "block",
      lineHeight: "24px",
    },
    "& strong": {
      display: "block",
      lineHeight: "24px",
      fontWeight: 500,
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "& i": {
      display: "inline-block",
      ...theme.typography.body1,
      color: theme.palette.primary.contrastText,
      height: 24,
      lineHeight: "24px",
      textAlign: "center",
      minWidth: 64,
      borderRadius: 2,
      "&.green": {
        background: theme.palette.up.main,
      },
      "&.red": {
        background: theme.palette.down.main,
      },
    },
  },
  recommend: {
    width: "100%",
    overflowX: "auto",
    background: theme.palette.background.paper,
  },
  recommendItem: {
    textAlign: "center",
    overflow: "hidden",
    "& p": {
      ...theme.typography.body1,
      fontWeight: 600,
      color: theme.palette.common.text,
    },
    "& strong": {
      ...theme.typography.subtitle2,
      display: "block",
      fontWeight: 600,
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
    },
    "& span": {
      ...theme.typography.caption,
      display: "block",
      color: theme.palette.grey[500],
      "&.green": {
        color: theme.palette.up.main,
      },
      "&.red": {
        color: theme.palette.down.main,
      },
    },
  },
  tokenList: {
    padding: "0 0 0 24px",
    background: theme.palette.background.default,
    height: 350,
    overflow: "hidden",
  },
});
