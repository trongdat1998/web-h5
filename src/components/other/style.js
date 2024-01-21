export default (theme) => ({
  body: {
    backgroundSize: "100% auto",
    minHeight: "100%",
    overflow: "hidden",
  },
  banner: {
    margin: "0 0 40px",
    padding: "36px 24px 0",
    "& h2": {
      fontSize: 33,
      color: "#fff",
      margin: 0,
      fontWeight: "bold",
      lineHeight: "41px",
    },
    "& p": {
      fontSize: 25,
      color: "#56CCF2",
      lineHeight: "32px",
      margin: 0,
    },
    "& img": {
      maxHeight: 81,
      maxWidth: 313,
      width: "96%",
      display: "block",
      margin: 0,
    },
    "& a": {
      background: "#05163D",
      border: `1px solid rgba(98, 217, 250, 0.3)`,
      boxSizing: "border-box",
      borderRadius: 100,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 20px",
      lineHeight: "28px",
      color: "#62DAFB",
    },
    "& i": {
      margin: "0 0 0 8px",
    },
  },
  content: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    padding: "0 16px 24px",
    "& > div": {
      margin: "0 0 16px",
      "&:last-of-type": {
        margin: "0 0 48px",
      },
    },
    "& h3": {
      fontSize: 19,
      lineHeight: "28px",
      height: 24,
      color: "#56CCF2",
      fontWeight: 500,
    },
  },
  bg: {
    background: "linear-gradient(90deg, #05163D 0%, rgba(5, 22, 61, 0) 100%);",
  },
  part01: {
    backgroundSize: "100% auto",
    width: "100%",
    maxHeight: 168,
    padding: "24px 32px",
    position: "relative",
    "& img": {
      width: "100%",
      maxHeight: 80,
      marginTop: 16,
      maxWidth: 280,
    },
    "&:before, &:after": {
      position: "absolute",
      content: `""`,
      left: 0,
      width: "100%",
      height: 1,
      background:
        "linear-gradient(90.49deg, rgba(48, 186, 255, 0) 0%, #30BAFF 48.96%, rgba(48, 186, 255, 0) 100%);",
    },
    "&:before": {
      top: 0,
    },
    "&:after": {
      bottom: 0,
    },
  },
  part02: {
    padding: "24px 8px",
    "& img": {
      margin: "16px 0 8px",
      width: 80,
      height: 80,
    },
    "& p": {
      fontWeight: 500,
      fontSize: 15,
      lineHeight: "22px",
      color: "#fff",
    },
    "& .MuiGrid-item": {
      padding: "0 5px",
    },
  },
  part03: {
    padding: "24px 8px 16px",
    "& p": {
      margin: "0 0 8px",
    },
  },
  part04: {
    padding: "24px 8px",
    "& table": {
      margin: "24px auto 0",
      border: "1px solid #0C264A",
      width: "100%",
      "& .MuiTableCell-root": {
        color: "#D8DCE5",
        border: "1px solid #0C264A",
        textAlign: "center",
        paddingLeft: 2,
        paddingRight: 2,
        fontSize: 12,
        lineHeight: "17px",
      },
      "& thead": {
        background: "rgba(86, 204, 242, 0.1)",
      },
      "& td": {
        fontWeight: "bold",
      },
    },
  },
  part05: {
    padding: "24px 0",
    "& img": {
      width: "100%",
      margin: "30px auto 0",
    },
  },
  part06: {
    padding: "24px 16px",
    "& p": {
      fontSize: 15,
      lineHeight: "22px",
      color: "#D8DCE5",
      margin: "24px 0 0",
      textAlign: "left",
    },
  },
});
