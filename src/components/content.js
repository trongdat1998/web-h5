import React from "react";
import { injectIntl } from "react-intl";
import style from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

const app = Boolean(/bhe.?App/i.test(navigator.userAgent));

class ContentRC extends React.Component {
  constructor() {
    super();
  }
  render() {
    const classes = this.props.classes;
    const styles = this.props.style || {};
    return (
      <div
        className={app ? classes.content_body_app : classes.content_body}
        style={{ ...styles }}
      >
        <div className={app ? classes.content_app : classes.content}>
          <div className={app ? classes.content_con_app : classes.content_con}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(ContentRC));
