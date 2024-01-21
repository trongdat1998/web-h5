import React from "react";
import { useSnackbar } from "notistack";

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    const { enqueueSnackbar } = useSnackbar();
    return <Component {...props} enqueueSnackbar={enqueueSnackbar} />;
  }
  return WithRoot;
}

export default withRoot;
