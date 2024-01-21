export default (theme) => ({
  form: {},
  greenBtn: {
    border: `1px solid ${theme.palette.up.main}`,
    color: theme.palette.up.main,
    borderRadius: "2px 0 0 2px",
  },
  redBtn: {
    border: `1px solid ${theme.palette.down.main}`,
    color: theme.palette.down.main,
    borderRadius: "0 2px 2px 0",
  },
  defaultBtn: {
    border: `1px solid ${theme.palette.grey[100]}`,
  },
  greenBtn2: {
    background: theme.palette.up.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      background: theme.palette.success.dark,
    },
  },
  redBtn2: {
    background: theme.palette.down.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      background: theme.palette.error.dark,
    },
  },
  tradeable: {
    fontSize: 12,
    lineHeight: "20px",
    height: 40,
  },
  transform: {
    color: theme.palette.primary.main,
    margin: "0 0 10px",
  },
});
