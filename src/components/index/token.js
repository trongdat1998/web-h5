import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import styles from "./index_style";
import helper from "../../utils/helper";
import route_map from "../../config/route_map";

function TokenItem(props) {
  const { symbols_obj, data, type, rates, unit } = props;
  const classes = props.classes;
  const tokenInfo =
    data.s && symbols_obj.all[data.s] ? symbols_obj.all[data.s] : {};
  const coin =
    type == "合约"
      ? tokenInfo.baseTokenFutures.displayTokenId
      : tokenInfo.quoteTokenId;
  const cRates = data.c
    ? helper.currencyValue(rates, data.c, coin, unit)
    : ["", ""];
  const goto = function () {
    let url =
      route_map.exchange +
      "/" +
      tokenInfo.baseTokenId +
      "/" +
      tokenInfo.quoteTokenId;
    if (type == "合约") {
      url = route_map.future_quotes + "/" + tokenInfo.symbolId;
    }
    window.location.href = url;
  };
  return (
    <Grid
      container
      className={classes.tokenItem}
      alignItems="center"
      onClick={goto}
    >
      <Grid item xs={4}>
        <strong>
          {type == "币币"
            ? (tokenInfo.baseTokenName || "") +
              " / " +
              (tokenInfo.quoteTokenName || "")
            : tokenInfo.symbolName}
        </strong>
        <span>
          Vol:{data.v || Number(data.v) === 0 ? helper.digits(data.v, 2) : "--"}
        </span>
      </Grid>
      <Grid item xs={3} style={{ textAlign: "right" }}>
        <label>{data.c}</label>
        <span>
          {cRates[0]}
          {cRates[1]}
        </span>
      </Grid>
      <Grid item xs={5} style={{ padding: "0 24px 0 0", textAlign: "right" }}>
        <i className={Number(data.m || 0) >= 0 ? "green" : "red"}>
          {data.m || Number(data.m) === 0
            ? Math.floor(data.m * 10000) / 100 + "%"
            : "0%"}
        </i>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(TokenItem);
