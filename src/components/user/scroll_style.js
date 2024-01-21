export default theme => ({
  loading: {
    margin: "25px 0",
    display: "flex",
    justifyContent: "center",
    "& span": {
      ...theme.typography.caption,
      color: theme.palette.grey["500"],
      margin: "0 0 0 10px"
    }
  }
});
