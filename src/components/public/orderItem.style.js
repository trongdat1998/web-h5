export default (theme) => ({
  orderItem: {
    borderTop: `1px solid ${theme.palette.grey[100]}`,
    padding: "16px 24px 16px 0",
    ...theme.typography.caption,
    "& span": {
      color: theme.palette.grey[500],
    },
    "& i": {
      color: theme.palette.grey[500],
      cursor: "pointer",
    },
  },
  type: {
    margin: "0 0 8px",
    "& strong": {
      ...theme.typography.subtitle2,
    },
    "& label": {
      margin: "0 10px 0 0",
    },
  },
  green: {
    color: theme.palette.up.main,
  },
  red: {
    color: theme.palette.down.main,
  },
});
