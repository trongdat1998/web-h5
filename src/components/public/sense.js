// 极验 深知

import React from "react";
import initSense from "../../utils/sense.js";
import CONST from "../../config/const";

class Sense extends React.Component {
  constructor() {
    super();
    this.state = {
      id: CONST.SENSE_ID,
      sense: null,
    };
  }
  componentDidMount() {
    initSense(
      {
        id: this.state.id,
        lang: this.props.lang,
        onError: (err) => {
          window.trackPageError({
            type: "error_sense",
            error_code: err.code,
            error_message: err.msg,
          });
        },
      },
      (sense) => {
        this.setState({
          sense,
        });
      }
    );
  }
  reset() {}
  // 执行验证
  sense() {
    const _this = this;
    this.state.sense &&
      this.state.sense.getSid(
        (res) => {
          _this.props.onSuccess && _this.props.onSuccess(res);
        },
        (err) => {
          _this.props.onError && _this.props.onError(err);
        }
      );
  }
  execute() {
    const _this = this;
    this.state.sense &&
      this.state.sense.getSid(
        (res) => {
          _this.props.onSuccess && _this.props.onSuccess(res);
        },
        (err) => {
          _this.props.onError && _this.props.onError(err);
        }
      );
  }
  render() {
    return <span />;
  }
}

export default Sense;
