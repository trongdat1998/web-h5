// scroll
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import classnames from "classnames";
import styles from "./scroll_style";

let timer;
class ScrollRC extends React.Component {
  constructor() {
    super();
    this.state = {
      timer: null
    };
    this.getMore = this.getMore.bind(this);
  }
  componentDidMount() {
    this.loop();
  }
  componentWillUnmount() {
    clearTimeout(timer);
    timer = null;
  }
  loop = () => {
    clearTimeout(timer);
    timer = setTimeout(this.add, 1000);
  };
  add = () => {
    if (this.props.loading) {
      this.loop();
      return;
    }
    const obj = this.getPosition();
    const height = window.document.documentElement.clientHeight;
    const fix = this.props.threshold || 40;
    if (obj.top - fix <= height) {
      this.getMore();
    }
    this.loop();
  };
  getPosition = () => {
    return this.loading.getBoundingClientRect();
  };
  getMore() {
    this.props.getMore && this.props.getMore();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.scroll}>
        {this.props.children}
        <div className={classes.loading} ref={ref => (this.loading = ref)}>
          {this.props.hasmore ? (
            <React.Fragment>
              <CircularProgress size={16} /> <span>loading...</span>
            </React.Fragment>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ScrollRC);
