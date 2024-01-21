export default (theme) => ({
  orderItem: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    padding: "10px 14px 10px 0",
    ...theme.typography.caption,
    "& i": {
      color: theme.palette.grey[500],
      cursor: "pointer",
    },
  },
  grey: {
    color: theme.palette.grey[500],
  },
  type: {
    margin: "0 0 8px",
    "& strong": {
      ...theme.typography.subtitle2,
    },
    "& label": {
      margin: "0 10px 0 0",
    },
    "& span": {
      color: theme.palette.grey[500],
    },
  },
  green: {
    color: theme.palette.up.main,
  },
  red: {
    color: theme.palette.down.main,
  },
});
