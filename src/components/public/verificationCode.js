/**
 * 发送验证码
 */
import React from "react";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";
//import s from "../layout.less";
import { Button } from "@material-ui/core";

class VerCode extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      timer: null,
      count: 60,
      initText: <FormattedMessage id="发送验证码" />
    };
    this.click = this.click.bind(this);
    this.change = this.change.bind(this);
  }
  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }
  click(e) {
    if (this.state.loading || !this.props.value) return;
    this.setState(
      {
        loading: true,
        count: 60,
        timer: setTimeout(this.change, 1000)
      },
      () => {
        this.props.onClick(e);
      }
    );
  }
  async start() {
    if (this.state.loading || !this.props.value) return;
    await this.reset();
    await this.setState({
      loading: true,
      count: 60,
      timer: setTimeout(this.change, 1000)
    });
  }
  change() {
    let count = this.state.count;
    count--;
    if (count < 0) {
      this.setState({
        loading: false,
        count: 60,
        timer: null
      });
    } else {
      this.setState({
        loading: true,
        count,
        timer: setTimeout(this.change, 1000)
      });
    }
  }
  async reset() {
    clearTimeout(this.state.timer);
    await this.setState({
      loading: false,
      count: 60,
      timer: null
    });
  }
  render() {
    const className = classnames(this.props.className);
    const style = Object({ minWidth: "100px" }, this.props.style || {});
    return (
      <Button
        disabled={this.state.loading || !this.props.value ? true : false}
        onClick={this.click}
        className={className}
        style={style}
        variant="contained"
        color="primary"
        size="small"
      >
        {this.state.loading ? this.state.count + "s" : this.state.initText}
      </Button>
    );
  }
}

export default VerCode;
