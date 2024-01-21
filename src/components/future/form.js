// 合约交易区
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import {
  Grid,
  Button,
  TextField,
  Slider,
  CircularProgress,
  Select,
  MenuItem,
  InputAdornment
} from "@material-ui/core";
import styles from "./form.style";
import WSDATA from "../../models/data_source";
import helper from "../../utils/helper";
import vali from "../../utils/validator";
import math from "../../utils/mathjs";
import CONST from "../../config/const";
import cookie from "../../utils/cookie";
import route_map from "../../config/route_map";
import ModalOrder from "./modal_order";
import TransferModal from "../public/transfer_modal";

class TradeRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      max: 999999999,
      slider: 0,
      subed: false,
      firstPrice: false,

      max: 9999999999,
      buy_price: {
        value: "",
        msg: ""
      },
      buy_trigger_price: {
        msg: ""
      },
      buy_quantity: {
        value: "",
        msg: ""
      },
      sale_price: {
        value: "",
        msg: ""
      },
      sale_trigger_price: {
        msg: ""
      },
      sale_quantity: {
        value: "",
        msg: ""
      },
      buy_other: {
        msg: ""
      },
      sale_other: { msg: "" },
      buy_auto: false,
      sale_auto: false
    };
  }
  componentDidMount() {
    if (cookie.read("account_id")) {
      //this.httpAction();
    }
    const search = this.props.history.location.search;
    if (/side=sell/i.test(search)) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          order_side: 1
        }
      });
    }
  }

  componentDidUpdate() {
    let symbol_info = this.props.future_info;

    // 写入输入框价格
    const symbol_quote = this.props.symbol_quote;
    const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    const tokenQuote = symbol_quote[symbolId] || {};
    if (this.props.buy_price === "" && tokenQuote.c && !this.state.buy_auto) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          buy_price: tokenQuote.c || ""
        }
      });
      this.setState({
        buy_auto: true
      });
    }
    if (this.props.sale_price === "" && tokenQuote.c && !this.state.sale_auto) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          sale_price: tokenQuote.c || ""
        }
      });
      this.setState({
        sale_auto: true
      });
    }
    // 写入杠杠值初始值
    // if (!this.props.buy_leverage && symbolId && symbol_info.baseTokenFutures) {
    //   const buy =
    //     symbolId.toUpperCase() + this.props.order_choose + "buy_leverage";
    //   const sale =
    //     symbolId.toUpperCase() + this.props.order_choose + "sale_leverage";
    //   const len = symbol_info.baseTokenFutures.levers.length;
    //   window.localStorage[buy] =
    //     window.localStorage[buy] ||
    //     symbol_info.baseTokenFutures.levers[
    //       Math.max(0, Math.ceil(len / 2) - 1)
    //     ];
    //   const buy_leverage = window.localStorage[buy];
    //   window.localStorage[sale] =
    //     window.localStorage[sale] ||
    //     symbol_info.baseTokenFutures.levers[
    //       Math.max(0, Math.ceil(len / 2) - 1)
    //     ];
    //   const sale_leverage = window.localStorage[sale];
    //   this.props.dispatch({
    //     type: "future/save",
    //     payload: {
    //       buy_leverage,
    //       sale_leverage
    //     }
    //   });
    // }
    // 写入风险限额初始值
    if (
      !this.props.buy_risk &&
      symbolId &&
      this.props.order_setting[symbolId.toUpperCase()]
    ) {
      const order_setting = this.props.order_setting[symbolId.toUpperCase()];
      if (!order_setting.riskLimit || !order_setting.riskLimit.length) return;
      let buy_risk = "";
      let sale_risk = "";
      order_setting.riskLimit.map(item => {
        if (item.side == "BUY_OPEN") {
          buy_risk = item.riskLimitId;
        }
        if (item.side == "SELL_OPEN") {
          sale_risk = item.riskLimitId;
        }
      });
      this.props.dispatch({
        type: "future/save",
        payload: {
          buy_risk,
          sale_risk
        }
      });
    }

    if (this.props.ws && !this.state.subed) {
      this.setState(
        {
          subed: true
        },
        () => {
          this.props.ws.sub(
            {
              id: "futures_tradeable",
              topic: "futures_tradeable",
              event: "sub"
            },
            this.httpAction,
            this.callback
          );
          this.httpAction();
        }
      );
    }
  }
  httpAction = payload => {
    return this.props.dispatch({
      type: "future/tradeable_req",
      payload: {}
    });
  };
  /**
   * data={
   *   topic:'broker',
   *   params:{},
   *   f: true/false,
   *   id: 'broker,
   *   shared: true/false,
   *   data:[{t:123123123123,s:'BTCUSDT',c:1,o:1,e:301,h:1,l:1,m:0,v:0,qv:0}] m:涨跌幅
   * }
   */
  callback = data => {
    data && data.data && WSDATA.setData("future_tradeable_source", data.data);
  };
  // 资产变化时，重新计算buymax
  componentWillReceiveProps(nextProps) {
    // id变化时，清除state msg状态
    if (this.props.symbol_id != nextProps.symbol_id) {
      this.setState({
        buy_price: {
          value: "",
          msg: ""
        },
        buy_quantity: {
          value: "",
          msg: ""
        },
        buy_trigger_price: {
          msg: ""
        },
        sale_price: {
          value: "",
          msg: ""
        },
        sale_trigger_price: {
          msg: ""
        },
        sale_quantity: {
          value: "",
          msg: ""
        },
        buy_other: {
          msg: ""
        },
        sale_other: { msg: "" }
      });
    } else {
      const old_available = this.props.future_tradeable[this.props.symbol_id];
      const new_available = nextProps.future_tradeable[this.props.symbol_id];
      if (
        old_available &&
        old_available.profitLoss &&
        new_available &&
        new_available.profitLoss &&
        old_available.profitLoss.coinAvailable !=
          new_available.profitLoss.coinAvailable
      ) {
        const buy_max = nextProps.buy_price
          ? this.getMax(
              "BUY",
              nextProps.buy_price,
              new_available.profitLoss.coinAvailable
            )
          : 0;
        const sale_max = nextProps.sale_price
          ? this.getMax(
              "SELL",
              nextProps.sale_price,
              new_available.profitLoss.coinAvailable
            )
          : 0;
        this.props.dispatch({
          type: "future/save",
          payload: {
            buy_max,
            sale_max
          }
        });
      }
    }
  }

  equalDigit = (v, d) => {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    let s = `${v}`.split(".");
    s = s[1] || "";
    if (d - 1 >= 0 || d == 0) {
      if (s.length > 0 || v < d) {
        return false;
      } else {
        return true;
      }
    }
    if (s.length > CONST["depth"][d]) return false;
    return true;
  };
  // 是否为精度整倍数
  // d  100，10，1，0.1，0.01，0.001
  multipleDigit = (v, d) => {
    if (!v && v !== 0) return false;
    if (!d && d !== 0) return false;
    const r = math
      .chain(math.bignumber(v))
      .divide(d)
      .format({ notation: "fixed" })
      .done();
    if (!vali.isInt(r)) {
      return false;
    }
    return true;
  };
  /**
   * 下单验证规则
   * @param {string} order_side BUY|SELL
   * @param {boolean} where 下单按钮=true, 弹窗确认按钮=false
   * 限价买
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 限价卖
   * 价格：精度(min_price_precision)，可输入最大值(99,999,999)
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   * 金额：无

   * 市价买
   * 金额：最小值(min_trade_amount)，精度(quote_precision)及精度倍数

   * 市价卖
   * 数量：精度(base_precision)及精度倍数，最小值(min_trade_quantity)
   *
   */
  orderCreate = async (order_side, where, e) => {
    // 最小交易价格, 最小交易数量 不存在,拒绝交易
    if (
      (!this.props.min_price_precision &&
        this.props.min_price_precision !== 0) ||
      (!this.props.min_trade_quantity && this.props.min_trade_quantity !== 0)
    ) {
      window.console.error(
        "最小交易价格, 最小交易数量 不存在",
        this.props.min_price_precision,
        this.props.min_trade_quantity
      );
      this.props.enqueueSnackbar(
        this.props.intl.formatMessage({
          id: "价格错误，请重新输入"
        }),
        { variant: "error" }
      );
      return;
    }

    // sale
    if (order_side === "SELL") {
      // 计划委托价格
      if (
        !Number(this.props.sale_trigger_price) &&
        this.props.sale_price !== "0" &&
        this.props.sale_type == 1
      ) {
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "请填写委托价格"
          }),
          { variant: "error" }
        );
        this.setState({
          sale_trigger_price: {
            msg: this.props.intl.formatMessage({
              id: "请填写委托价格"
            })
          },
          sale_price: {
            msg: ""
          },
          sale_quantity: {
            msg: ""
          },
          sale_other: { msg: "" }
        });
        return;
      }
      // 价格不存在或=0, 限价时验证
      if (
        !Number(this.props.sale_price) &&
        this.props.sale_price !== "0" &&
        this.props.sale_price_type == 0
      ) {
        window.console.error("价格不存在", this.props.sale_price);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: this.props.sale_price_type == 0 ? "请填写价格" : "价格不存在"
          }),
          { variant: "error" }
        );
        this.setState({
          sale_price: {
            msg: this.props.intl.formatMessage({
              id: this.props.sale_price_type == 0 ? "请填写价格" : "价格不存在"
            })
          },
          sale_quantity: {
            msg: ""
          },
          sale_trigger_price: { msg: "" },
          sale_other: { msg: "" }
        });
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.sale_price) <
          Number(this.props.min_price_precision) &&
        this.props.sale_price_type == 0
      ) {
        window.console.error(
          "价格小于最小值",
          this.props.sale_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "价格不能小于"
          }) + this.props.min_price_precision,
          { variant: "error" }
        );
        this.setState({
          sale_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能小于"
              }) + this.props.min_price_precision
          },
          sale_quantity: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }
      // 价格大于最大值
      if (
        Number(this.props.sale_price) > this.state.max &&
        this.props.sale_price_type == 0
      ) {
        window.console.error(
          "价格大于最大值",
          this.props.sale_price,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "价格不能大于"
          }) + this.state.max,
          { variant: "error" }
        );
        this.setState({
          sale_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能大于"
              }) + this.state.max
          },
          sale_quantity: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.sale_price),
          this.props.min_price_precision
        ) &&
        this.props.sale_price_type == 0
      ) {
        window.console.error(
          "价格精度不正确",
          this.props.sale_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "价格精度不正确"
          }),
          { variant: "error" }
        );
        this.setState({
          sale_price: {
            msg: this.props.intl.formatMessage({
              id: "价格精度不正确"
            })
          },
          sale_quantity: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }

      // 卖出数量不存在
      if (
        !Number(this.props.sale_quantity) &&
        this.props.sale_quantity !== "0"
      ) {
        window.console.error("卖出数量不存在", this.props.sale_quantity);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "请填写数量"
          }),
          { variant: "error" }
        );
        this.setState({
          sale_quantity: {
            msg: this.props.intl.formatMessage({
              id: "请填写数量"
            })
          },
          sale_price: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }
      // 卖出数量小于最小值
      if (
        Number(this.props.sale_quantity) < Number(this.props.min_trade_quantity)
      ) {
        window.console.error(
          "卖出数量小于最小值",
          this.props.sale_quantity,
          this.props.min_trade_quantity
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能小于"
          }) + this.props.min_trade_quantity,
          { variant: "error" }
        );
        this.setState({
          sale_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能小于"
              }) + this.props.min_trade_quantity
          },
          sale_price: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }
      // 卖出数量大于最大值
      if (Number(this.props.sale_quantity) > this.state.max) {
        window.console.error(
          "卖出数量大于最大值",
          this.props.sale_quantity,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能大于"
          }) + this.state.max,
          { variant: "error" }
        );
        this.setState({
          sale_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于"
              }) + this.state.max
          },
          sale_price: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }
      // 平仓 and  数量大于最大值
      const sale_max = this.getMax("SELL");
      if (
        Number(this.props.sale_quantity) > Number(sale_max) &&
        this.props.order_choose == 1
      ) {
        window.console.error(
          "数量大于最大值",
          this.props.sale_quantity,
          sale_max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能大于"
          }) + sale_max,
          { variant: "error" }
        );
        this.setState({
          sale_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于"
              }) + sale_max
          },
          sale_price: {
            msg: ""
          },
          sale_other: { msg: "" },
          sale_trigger_price: { msg: "" }
        });
        return;
      }
      // 数量精度不正确, 非整倍数
      if (
        !this.equalDigit(
          Number(this.props.sale_quantity),
          //Math.pow(10, -this.props.base_precision)
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.sale_quantity),
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.error(
          "数量精度不正确",
          this.props.sale_quantity,
          this.props.base_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量精度不正确"
          }),
          { variant: "error" }
        );
        this.setState({
          sale_quantity: {
            msg: this.props.intl.formatMessage({
              id: "数量精度不正确"
            })
          },
          sale_price: {
            msg: ""
          },
          sale_trigger_price: { msg: "" },
          sale_other: { msg: "" }
        });
        return;
      }
      // 开仓验证 成本大于风险限额余额
      if (this.props.order_choose == 0) {
        const symbolId = this.props.match.params.symbol_id.toUpperCase();
        // 余额
        const tradeable = this.props.future_tradeable[symbolId] || {};
        const riskLimit = this.getRiskLimit(symbolId, "SELL_OPEN");
        if (
          Number(this.props.sale_quantity) +
            Number(tradeable.shortTotal || 0) -
            Number(riskLimit.riskLimitAmount || 0) >
          0
        ) {
          this.props.enqueueSnackbar(
            this.props.intl.formatMessage({
              id: "请调整风险限额大于仓位价值后可以开仓"
            }),
            { variant: "error" }
          );
          this.setState({
            sale_quantity: {
              msg: ""
            },
            sale_other: {
              msg: this.props.intl.formatMessage({
                id: "请调整风险限额大于仓位价值后可以开仓"
              })
            },
            sale_price: {
              msg: ""
            },
            sale_trigger_price: { msg: "" }
          });
          return;
        }
      }
    }
    // buy
    if (order_side === "BUY") {
      // 计划委托价格
      if (
        !Number(this.props.buy_trigger_price) &&
        this.props.buy_price !== "0" &&
        this.props.buy_type == 1
      ) {
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "请填写委托价格"
          }),
          { variant: "error" }
        );
        this.setState({
          buy_trigger_price: {
            msg: this.props.intl.formatMessage({
              id: "请填写委托价格"
            })
          },
          buy_price: {
            msg: ""
          },
          buy_quantity: {
            msg: ""
          },
          buy_other: { msg: "" }
        });
        return;
      }
      // 价格不存在或=0, 限价时验证
      if (
        !Number(this.props.buy_price) &&
        this.props.buy_price !== "0" &&
        this.props.buy_price_type == 0
      ) {
        window.console.error("价格不存在", this.props.buy_price);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: this.props.buy_price_type == 0 ? "请填写价格" : "价格不存在"
          }),
          { variant: "error" }
        );
        this.setState({
          buy_price: {
            msg: this.props.intl.formatMessage({
              id: this.props.buy_price_type == 0 ? "请填写价格" : "价格不存在"
            })
          },
          buy_quantity: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 价格小于最小值
      if (
        Number(this.props.buy_price) < Number(this.props.min_price_precision) &&
        this.props.buy_type == 1
      ) {
        window.console.error(
          "价格小于最小值",
          this.props.buy_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "价格不能小于"
          }) + this.props.min_price_precision,
          { variant: "error" }
        );
        this.setState({
          buy_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能小于"
              }) + this.props.min_price_precision
          },
          buy_quantity: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 价格大于最大值
      if (
        Number(this.props.buy_price) > Number(this.state.max) &&
        this.props.buy_type == 1
      ) {
        window.console.error(
          "价格大于最大值",
          this.props.buy_price,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "价格不能大于"
          }) + this.state.max,
          { variant: "error" }
        );
        this.setState({
          buy_price: {
            msg:
              this.props.intl.formatMessage({
                id: "价格不能大于"
              }) + this.state.max
          },
          buy_quantity: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 价格精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_price),
          this.props.min_price_precision
        ) &&
        this.props.buy_type == 1
      ) {
        window.console.error(
          "价格精度不正确",
          this.props.buy_price,
          this.props.min_price_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "价格精度不正确"
          }),
          { variant: "error" }
        );
        this.setState({
          buy_price: {
            msg: this.props.intl.formatMessage({
              id: "价格精度不正确"
            })
          },
          buy_quantity: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }

      // 数量不存在
      if (!Number(this.props.buy_quantity) && this.props.buy_quantity !== "0") {
        window.console.error("数量不存在", this.props.buy_quantity);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "请填写数量"
          }),
          { variant: "error" }
        );
        this.setState({
          buy_quantity: {
            msg: this.props.intl.formatMessage({
              id: "请填写数量"
            })
          },
          buy_price: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 数量精度不正确
      if (
        !this.equalDigit(
          Number(this.props.buy_quantity),
          //Math.pow(10, -this.props.base_precision)
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        ) ||
        !this.multipleDigit(
          Number(this.props.buy_quantity),
          //Math.pow(10, -this.props.base_precision)
          math
            .chain(math.pow(10, math.bignumber(-this.props.base_precision)))
            .format({ notation: "fixed" })
            .done()
        )
      ) {
        window.console.error(
          "数量精度不正确",
          this.props.buy_quantity,
          this.props.base_precision
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量精度不正确"
          }),
          { variant: "error" }
        );
        this.setState({
          buy_quantity: {
            msg: this.props.intl.formatMessage({
              id: "数量精度不正确"
            })
          },
          buy_price: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 数量小于最小值
      if (
        Number(this.props.buy_quantity) < Number(this.props.min_trade_quantity)
      ) {
        window.console.error(
          "数量小于最小值",
          this.props.buy_quantity,
          this.props.min_trade_quantity
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能小于"
          }) + this.props.min_trade_quantity,
          { variant: "error" }
        );
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能小于"
              }) + this.props.min_trade_quantity
          },
          buy_price: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 数量大于最大值
      if (Number(this.props.buy_quantity) > this.state.max) {
        window.console.error(
          "数量大于最大值",
          this.props.buy_quantity,
          this.state.max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能大于"
          }) + this.state.max,
          { variant: "error" }
        );
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于"
              }) + this.state.max
          },
          buy_price: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 平仓 and   buy_max 为0
      const buy_max = this.getMax("BUY");
      if (!buy_max && this.props.order_choose == 1) {
        window.console.error("买入最大值不存在", buy_max);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能大于"
          }) + buy_max,
          { variant: "error" }
        );
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于"
              }) + buy_max
          },
          buy_price: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 平仓 and  数量大于buy_max
      if (
        Number(this.props.buy_quantity) > buy_max &&
        this.props.order_choose == 1
      ) {
        window.console.error(
          "数量大于买入最大值",
          this.props.buy_quantity,
          buy_max
        );
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage({
            id: "数量不能大于"
          }) + buy_max,
          { variant: "error" }
        );
        this.setState({
          buy_quantity: {
            msg:
              this.props.intl.formatMessage({
                id: "数量不能大于"
              }) + buy_max
          },
          buy_price: {
            msg: ""
          },
          buy_trigger_price: { msg: "" },
          buy_other: { msg: "" }
        });
        return;
      }
      // 开仓验证 成本是否大于风险限额余额
      if (this.props.order_choose == 0) {
        const symbolId = this.props.match.params.symbol_id.toUpperCase();
        // 余额
        const tradeable = this.props.future_tradeable[symbolId] || {};
        const riskLimit = this.getRiskLimit(symbolId, "BUY_OPEN");
        if (
          Number(this.props.buy_quantity) +
            Number(tradeable.longTotal || 0) -
            Number(riskLimit.riskLimitAmount || 0) >
          0
        ) {
          window.console.error(
            "请调整风险限额大于仓位价值后可以开仓",
            tradeable.longTotal,
            riskLimit.riskLimitAmount
          );
          this.props.enqueueSnackbar(
            this.props.intl.formatMessage({
              id: "请调整风险限额大于仓位价值后可以开仓"
            }),
            { variant: "error" }
          );
          this.setState({
            buy_quantity: {
              msg: ""
            },
            buy_other: {
              msg: this.props.intl.formatMessage({
                id: "请调整风险限额大于仓位价值后可以开仓"
              })
            },
            buy_price: {
              msg: ""
            },
            buy_trigger_price: { msg: "" }
          });
          return;
        }
      }
    }

    // 确认弹窗
    const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    const order_setting = this.props.order_setting[symbolId];
    if (
      order_setting &&
      order_setting.orderSetting &&
      Boolean(order_setting.orderSetting.isConfirm) &&
      where
    ) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          // order_side: this.props.order_sides.findIndex(
          //   item => item == order_side
          // ),
          modal_order: true
        }
      });
      return;
    }
    let payload = {
      side:
        order_side + "_" + this.props.order_chooses[this.props.order_choose],
      type:
        order_side == "SELL"
          ? this.props.order_types[this.props.sale_type]
          : this.props.order_types[this.props.buy_type],
      price:
        order_side == "SELL" ? this.props.sale_price : this.props.buy_price,
      price_type:
        order_side == "SELL"
          ? this.props.price_types[this.props.sale_price_type]
          : this.props.price_types[this.props.buy_price_type],
      trigger_price:
        order_side == "SELL"
          ? this.props.sale_trigger_price
          : this.props.buy_trigger_price,
      leverage:
        this.props.order_choose == 0
          ? order_side == "SELL"
            ? this.props.sale_leverage
            : this.props.buy_leverage
          : "",
      // time_in_force: "1",
      // risk_limit_id:
      //   order_side == "SELL" ? this.props.sale_risk : this.props.buy_risk,
      quantity:
        order_side == "SELL"
          ? this.props.sale_quantity
          : this.props.buy_quantity,
      symbol_id: this.props.symbol_id,
      client_order_id: new Date().getTime(),
      exchange_id: this.props.exchange_id,
      order_side
    };
    if (this.props.order_choose == 1) {
      payload.leverage = "";
      //delete payload.leverage;
    }
    await this.props.dispatch({
      type: "future/createOrder",
      payload,
      enqueueSnackbar: this.props.enqueueSnackbar,
      success: () => {
        // 清空表单
        if (order_side === "SELL") {
          this.props.dispatch({
            type: "future/save",
            payload: {
              sale_quantity: "",
              //sale_price: "",
              sale_progress: 0,
              modal_order: false
            }
          });
          this.setState({
            sale_price: {
              msg: ""
            },
            sale_quantity: {
              msg: ""
            },
            sale_trigger_price: { msg: "" },
            sale_other: { msg: "" }
          });
        }
        if (order_side === "BUY") {
          this.props.dispatch({
            type: "future/save",
            payload: {
              buy_quantity: "",
              //buy_price: "",
              buy_progress: 0,
              modal_order: false
            }
          });
          this.setState({
            buy_price: {
              msg: ""
            },
            buy_quantity: {
              msg: ""
            },
            buy_trigger_price: { msg: "" },
            buy_other: { msg: "" }
          });
        }
        // 拉取最新资产
        //this.getLastAccount();
      }
    });
  };
  /**
   * 精度判断
   * @param {String} v v=number时，传入999. , 返回的数值会被忽略.
   * @param {Number} digits   -10,-1,1,2,3,4
   */
  fix_digits = (v, digits) => {
    if (!digits) {
      return v ? Math.floor(v) : v;
    }
    if (!v && v !== 0) return v;
    if (digits <= 0) {
      return Math.floor(v);
    }
    let string_v = `${v}`;
    let d = string_v.split(".");
    if (!d[1] || d[1].length <= digits) {
      return string_v;
    }
    d[1] = d[1].split("");
    d[1].length = digits;
    d[1] = d[1].join("");
    return d[0] + "." + d[1];
  };
  // 获取风险限额数据
  getRiskLimit = (symbolId, side) => {
    if (!symbolId || !side) return {};
    let obj = {};
    const order_setting =
      this.props.order_setting && this.props.order_setting[symbolId]
        ? this.props.order_setting[symbolId]
        : {};
    const riskLimit = order_setting.riskLimit;
    if (!riskLimit) return obj;
    riskLimit.map(item => {
      if (item.side == side) {
        obj = item;
      }
    });
    return obj;
  };
  getFee = () => {
    let symbolId = this.props.match.params.symbol_id;
    if (
      !symbolId ||
      !this.props.order_setting ||
      !this.props.order_setting[symbolId.toUpperCase()]
    )
      return 0;
    let fee = this.props.order_setting[symbolId.toUpperCase()];
    fee = fee ? fee["orderFee"] : null;
    const maxFee = fee
      ? Math.max(fee["takerFeeRate"], fee["makerFeeRate"])
      : CONST.fee;
    return maxFee;
  };
  /**
   * 输入框判断
   * 1、价格精度判断，
   * 2、数量精度
   * 3、金额精度
   */
  handleChange = e => {
    const t = e.target;
    const n = t.name;
    let v = t.type == "checkbox" ? t.checked : t.value;
    v = v
      .replace(/[^0-9\.]/, "")
      .replace(/^0{1,}/, "0")
      .replace(/^(0)([1-9])/, ($1, $2) => {
        return $2;
      })
      .replace(/^\./, "0.");
    if (!v) {
      let data = {
        [n]: ""
      };
      if (n.indexOf("buy") > -1) {
        data.buy_progress = 0;
      }
      this.props.dispatch({
        type: "future/save",
        payload: data
      });
      return;
    }
    if (v && !vali.isFloat(v)) {
      return;
    }

    let data = {
      [n]: v ? v : ""
    };

    // 买入价格
    // 精度判断
    // <= max
    if (n == "buy_price") {
      let d = v ? (Number(v) >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(
        `${d}`,
        CONST["depth"][this.props.min_price_precision]
      );
      data[n] = d;

      // 重新计算最大值
      data["buy_max"] = this.getMax("BUY", d);

      // 如果有数量，重新计算进度条的值
      data["buy_progress"] = 0;
      if (
        (Number(this.props.buy_quantity) ||
          Number(this.props.buy_quantity) === 0) &&
        data["buy_max"]
      ) {
        let progress = Number(data["buy_max"])
          ? math
              .chain(this.props.buy_quantity)
              .divide(data["buy_max"])
              .multiply(100)
              .format({ notation: "fixed" })
              .done()
          : 0;
        progress = Math.max(0, Math.min(100, progress));
        data["buy_progress"] = progress;
      }

      this.setState({
        buy_price: {
          msg: ""
        },
        buy_other: { msg: "" },
        buy_auto: true
      });
    }
    // 计划委托 价格
    if (n == "buy_trigger_price") {
      let d = v ? (Number(v) >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(
        `${d}`,
        CONST["depth"][this.props.min_price_precision]
      );
      data[n] = d;
      this.setState({
        buy_trigger_price: { msg: "" },
        buy_other: { msg: "" }
      });
    }
    // 买入 杠杆
    if (n == "buy_leverage") {
      let d = v;
      d = this.fix_digits(`${d}`, CONST.lever_decimal);
      // 写入本地
      // window.localStorage[
      //   this.props.match.params.symbol_id.toUpperCase() +
      //     this.props.order_choose +
      //     "buy_leverage"
      // ] = d;
      data[n] = d;
      this.closeLever.bind(this, "buy_lever");
    }
    // 买入数量
    // 精度判断,重置进度条
    // <= max
    if (n == "buy_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      const buy_max = this.getMax("BUY");
      if (d && Number(buy_max) && this.props.buy_price) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(buy_max)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      // if (vv && this.props.buy_max) {
      //   if (Number(vv) > Number(this.props.buy_max)) {
      //     v = this.props.buy_max;
      //   }
      //   if (vv < 0) {
      //     v = 0;
      //   }
      // }
      data = {
        [n]: d || d === 0 ? d : "",
        buy_progress: progress,
        buy_max: buy_max
      };

      this.setState({
        buy_quantity: {
          msg: ""
        },
        buy_other: { msg: "" }
      });
    }

    // 卖出价格
    // 精度判断
    // <= max
    if (n == "sale_price") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][this.props.min_price_precision]);
      data[n] = d;

      // 重新计算最大值
      data["sale_max"] = this.getMax("SELL", d);

      // 如果有数量，重新计算进度条的值
      data["sale_progress"] = 0;
      if (
        (Number(this.props.sale_quantity) ||
          Number(this.props.sale_quantity) === 0) &&
        data["sale_max"]
      ) {
        let progress = Number(data["sale_max"])
          ? math
              .chain(this.props.sale_quantity)
              .divide(data["sale_max"])
              .multiply(100)
              .format({ notation: "fixed" })
              .done()
          : 0;
        progress = Math.max(0, Math.min(100, progress));
        data["sale_progress"] = progress;
      }

      this.setState({
        sale_price: {
          msg: ""
        },
        sale_other: { msg: "" },
        sale_auto: true
      });
    }
    // 卖出 杠杆
    if (n == "sale_leverage") {
      let d = v;
      d = this.fix_digits(`${d}`, CONST.lever_decimal);
      // 写入本地
      // window.localStorage[
      //   this.props.match.params.symbol_id.toUpperCase() +
      //     this.props.order_choose +
      //     "sale_leverage"
      // ] = d;
      data[n] = d;
      this.closeLever.bind(this, "sale_lever");
    }
    // 计划委托 卖出价格
    if (n == "sale_trigger_price") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, CONST["depth"][this.props.min_price_precision]);
      data[n] = d;
      this.setState({
        sale_trigger_price: { msg: "" },
        sale_other: { msg: "" }
      });
    }
    // 卖出数量
    // 精度判断
    // <= max
    if (n == "sale_quantity") {
      let d = v ? (v >= this.state.max ? `${this.state.max}` : v) : "";
      d = this.fix_digits(d, this.props.base_precision);
      let progress = 0;
      const sale_max = this.getMax("SELL");
      if (d && Number(sale_max)) {
        progress = Math.min(
          100,
          math
            .chain(d)
            .divide(sale_max)
            .multiply(100)
            .format({ notation: "fixed", precision: 4 })
            //.round(4)
            .done()
        );
      }
      // if (vv && this.props.sale_max) {
      //   if (Number(vv) > Number(this.props.sale_max)) {
      //     v = this.props.sale_max;
      //   }
      //   if (vv < 0) {
      //     v = 0;
      //   }
      // }
      data = {
        [n]: d,
        sale_progress: progress,
        sale_max: sale_max
      };
      this.setState({
        sale_quantity: {
          msg: ""
        },
        sale_other: { msg: "" }
      });
    }
    this.props.dispatch({
      type: "future/save",
      payload: {
        ...data
      }
    });
  };
  /**
   * 计算最大值
   * @param {string} side BUY|SELL
   * @param {string} _price 价格,非必填
   * @return {number}
   * order_choose == 1 平仓规则
   * side == BUY  max = future_tradeable[symbolId][shortAvailable]
   * side == SELL max = future_tradeable[symbolId][longAvailable]
   * order_choose == 0 开仓规则
   * price_type = 0 限价， max = (可用保证金*杠杠)/(价格*合约乘数)
   * price_type = 1 市价, max = (可用保证金*杠杠)/(最新价*(1+x)*合约乘数); 后台配置市价浮动范围marketPriceRange y=[-0.05,0.04]; 开仓买入,平仓卖出 x= y[1]; 开仓卖出,平仓买入 x = y[0];
   * price_type = 2 对手价, max = (可用保证金*杠杠)/(x*合约乘数); 开仓买入 x=卖1; 开仓卖出 x=买1； 平仓买入 x = 买1； 平仓卖出 x = 卖1；
   * price_type = 3 排队价, max = (可用保证金*杠杠)/(x*合约乘数); 开仓买入 x=买1; 开仓卖出 x=卖1； 平仓买入 x = 卖1； 平仓卖出 x = 买1；
   * price_type = 4 超价, max = (可用保证金*杠杠)/( (x + y)**合约乘数 );  后台配置超价浮动范围 overPriceRange z=[-0.05,0.04]； 开仓买入 x= 卖1, y=z[1]； 开仓卖出 x = 买1, y = z[0]； 平仓买入 x=买1,y=z[0]； 平仓卖出 x=卖1,y=z[1]；
   *
   * 反向合约
   * 价格 = 1/价格
   */
  getMax = (side, _price, _abailable) => {
    if (!side) return 0;
    const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    if (!symbolId) return 0;
    // 平仓
    if (this.props.order_choose == 1) {
      const available = this.props.future_tradeable[symbolId];
      let v = 0;
      if (side == "BUY") {
        v =
          available && available.shortAvailable ? available.shortAvailable : 0;
      } else {
        v = available && available.longAvailable ? available.longAvailable : 0;
      }
      return v;
    }
    // 价格类型,限价，市价等
    const price_type =
      side == "BUY" ? this.props.buy_price_type : this.props.sale_price_type;

    // 价格
    let price =
      _price || (side == "BUY" ? this.props.buy_price : this.props.sale_price);
    // 杠杠
    const leverage =
      side == "BUY" ? this.props.buy_leverage : this.props.sale_leverage;

    if (!price || !leverage) return 0;

    // 可用保证金
    const coinAvailable =
      _abailable ||
      (this.props.future_tradeable &&
      this.props.future_tradeable[symbolId] &&
      this.props.future_tradeable[symbolId]["profitLoss"]
        ? this.props.future_tradeable[symbolId]["profitLoss"]["coinAvailable"]
        : 0);
    if (!coinAvailable) return 0;
    const symbol_quote = this.props.symbol_quote;
    const q = symbol_quote[symbolId] || {};
    // 最新价
    let c = q.c;
    // 永续合约信息
    let symbol_info = this.props.future_info;
    // 反向合约
    if (symbol_info.isReverse) {
      price = 1 / price;
    }
    // 合约乘数
    const contractMultiplier = symbol_info
      ? symbol_info.baseTokenFutures.contractMultiplier
      : "";
    if (!contractMultiplier) return 0;
    // 开，平仓选项
    const s = this.props.order_choose;
    let v = 0;
    // 限价
    if (price_type == 0) {
      v = helper.digits(
        (coinAvailable * leverage) / (price * contractMultiplier),
        8
      );
    }
    // 市价
    if (price_type == 1) {
      const marketPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.marketPriceRange
        : [0, 0];
      if (!c) return 0;

      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? marketPriceRange[1]
          : marketPriceRange[0];
      let y = c * (1 + Number(x));
      // 反向合约
      if (symbol_info.isReverse) {
        //c = 1 / c;
        y = 1 / y;
      }

      v = helper.digits(
        (coinAvailable * leverage) / (y * contractMultiplier),
        8
      );
    }
    const depthData = this.getDepthData();
    // 对手价
    if (price_type == 2) {
      const sell = depthData.sell || [];
      const buy = depthData.buy || [];
      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? sell[0]
            ? symbol_info.isReverse
              ? 1 / sell[0][0]
              : sell[0][0]
            : 0
          : buy[0]
          ? symbol_info.isReverse
            ? 1 / buy[0][0]
            : buy[0][0]
          : 0;
      if (!x) return 0;
      v = helper.digits(
        (coinAvailable * leverage) / (x * contractMultiplier),
        8
      );
    }
    // 排队价
    if (price_type == 3) {
      const sell = depthData.sell || [];
      const buy = depthData.buy || [];
      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? buy[0]
            ? symbol_info.isReverse
              ? 1 / buy[0][0]
              : buy[0][0]
            : 0
          : sell[0]
          ? symbol_info.isReverse
            ? 1 / sell[0][0]
            : sell[0][0]
          : 0;
      if (!x) return 0;

      v = helper.digits(
        (coinAvailable * leverage) / (x * contractMultiplier),
        8
      );
    }
    // 超价
    if (price_type == 4) {
      const overPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.overPriceRange
        : [0, 0];
      const sell = depthData.sell || [];
      const buy = depthData.buy || [];

      let x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? sell[0] && sell[0][0]
            ? sell[0][0]
            : 0
          : buy[0] && buy[0][0]
          ? buy[0][0]
          : 0;
      if (!x) return 0;
      const y =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? overPriceRange[1]
          : overPriceRange[0];
      if (symbol_info.isReverse) {
        x = 1 / (Number(x) + Number(y));
      }
      v = helper.digits(
        (coinAvailable * leverage) / (Number(x) * contractMultiplier),
        8
      );
    }
    return v;
  };
  getDepthData = () => {
    let data = this.props.merged_depth[
      this.props.exchange_id +
        "." +
        this.props.symbol_id +
        this.props.max_digits
    ];
    if (!data) {
      return {
        sell: [],
        buy: []
      };
    }
    return {
      sell: data.a || [],
      buy: data.b || []
    };
  };
  /**
   * 获取当前价格,用于计算
   * @param {string} side : BUY|SELL
   * @param {number} type : 0,1,2,3,4,5
   * @return {number}
   */
  getPrice = (side, type) => {
    let price = 0;
    const s = this.props.order_choose;
    const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    const symbol_quote = this.props.symbol_quote;
    const q = symbol_quote[symbolId] || {};
    // 永续合约信息
    let symbol_info = this.props.future_info;
    // 限价
    if (type == 0) {
      price = side == "BUY" ? this.props.buy_price : this.props.sale_price;
    }
    // 市价
    if (type == 1 && q.c) {
      const marketPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.marketPriceRange
        : [0, 0];
      const x =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? marketPriceRange[1]
          : marketPriceRange[0];
      price = q.c * (1 + Number(x));
    }
    const depthData = this.getDepthData();
    // 对手价
    if (type == 2) {
      const sell = depthData.sell || [];
      const buy = depthData.buy || [];
      price = buy[0] ? buy[0][0] : 0;
      if (side == "BUY") {
        price = sell[0] ? sell[0][0] : 0;
      }
    }
    // 排队价
    if (type == 3) {
      const sell = depthData.sell || [];
      const buy = depthData.buy || [];
      price = buy[0] ? buy[0][0] : 0;
      if (side == "SELL") {
        price = sell[0] ? sell[0][0] : 0;
      }
    }
    // 超价
    if (type == 4) {
      const overPriceRange = symbol_info
        ? symbol_info.baseTokenFutures.overPriceRange
        : [0, 0];
      const y =
        (s == 0 && side == "BUY") || (s == 1 && side != "BUY")
          ? overPriceRange[1]
          : overPriceRange[0];
      const sell = depthData.sell || [];
      const buy = depthData.buy || [];
      price = buy[0] ? buy[0][0] : "";
      if (side == "BUY") {
        price = sell[0] ? sell[0][0] : "";
      }
      if (price && Number(y)) {
        price = Number(price) + Number(y);
      }
    }
    return price;
  };
  // 杠杠blur检查范围
  leverBlurChange = (name, levers) => e => {
    let value = this.props[name];
    if (!levers.length)
      return setTimeout(() => {
        this.closeLever("buy_lever");
        this.closeLever("sale_lever");
      }, 200);
    if (Number(value) < Number(levers[0])) {
      value = levers[0];
      this.props.dispatch({
        type: "future/save",
        payload: {
          [name]: value
        }
      });
    }
    if (Number(value) > Number(levers[levers.length - 1])) {
      value = levers[levers.length - 1];
      this.props.dispatch({
        type: "future/save",
        payload: {
          [name]: value
        }
      });
    }
    window.localStorage[
      this.props.match.params.symbol_id.toUpperCase() +
        this.props.order_choose +
        name
    ] = value;
    setTimeout(() => {
      this.closeLever("buy_lever");
      this.closeLever("sale_lever");
    }, 200);
  };
  // 关闭杠杆弹层
  closeLever = (key, e) => {
    this.props.dispatch({
      type: "future/save",
      payload: {
        [key]: null
      }
    });
  };
  // 打开杠杆弹层
  openLever = (key, e) => {
    this.props.dispatch({
      type: "future/save",
      payload: {
        [key]: e.currentTarget
      }
    });
  };
  // 计算杠杠下拉列表
  // 默认杠杠列表，如：[5,10,20,50,100,200]
  // 根据当前风险限额的起始保证金率计算最大杠杆值 maxLever = 1/initialMargin, 保留2位小数, 假如 maxLever = 33.33
  // 当前杠杆列表 = [5,10,20,33.33]
  // type = BUY_OPEN|SELL_OPEN
  leversList = type => {
    const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
    // 杠杆列表
    let defaultLevers = this.props.future_info.baseTokenFutures
      ? this.props.future_info.baseTokenFutures.levers
      : [];
    if (!type) {
      return defaultLevers;
    }
    // 当前永续合约用户的配置信息
    let symbol_setting = this.props.order_setting[symbolId] || {};
    let riskLimits = symbol_setting["riskLimit"] || [];
    if (!riskLimits.length) {
      return defaultLevers;
    }
    let riskLimit = null;
    riskLimits.map(item => {
      if (item.side == type) {
        riskLimit = item;
      }
    });
    if (!riskLimit) {
      return defaultLevers;
    }

    let maxLever = math
      .chain(1)
      .divide(math.bignumber(riskLimit.initialMargin))
      .format({ notation: "fixed" })
      .done();
    maxLever = Number(helper.digits(maxLever, CONST.lever_decimal));
    let v = [];
    v.push(maxLever);
    defaultLevers.map(item => {
      if (maxLever - item > 0) {
        v.push(item);
      }
    });
    v.sort((a, b) => (a - b > 0 ? 1 : -1));
    return v;
  };
  // 修改委托类型
  // key= buy|sale
  changeProps = key => e => {
    let symbolId = this.props.symbol_id;
    const symbol_quote = this.props.symbol_quote;
    const tokenQuote = symbol_quote[symbolId] || {};
    let obj = {};
    if (key == "buy") {
      obj = {
        buy_type: Number(e.target.value),
        buy_trigger_price: "",
        buy_price_type: 0,
        buy_price: tokenQuote.c || ""
      };
    }
    if (key == "sale") {
      obj = {
        sale_type: Number(e.target.value),
        sale_trigger_price: "",
        sale_price_type: 0,
        sale_price: tokenQuote.c || ""
      };
    }
    this.props.dispatch({
      type: "future/save",
      payload: obj
    });
  };
  // 开发风险限额
  changeRisk = key => e => {
    this.props.dispatch({
      type: "future/save",
      payload: {
        modal_risk: true,
        key_risk: key
      }
    });
  };
  // 修改价格类型
  changePriceType = async e => {
    const target = e.target;
    const v = target.value;
    const name = target.name;
    let data = {
      [name]: v
    };
    // 根据类型，修改价格框的值
    if (Number(v) > 0) {
      if (name.indexOf("buy") > -1) {
        data.buy_price = this.props.intl.formatMessage({
          id: this.props.price_types_desc[v]
        });
      }
      if (name.indexOf("sale") > -1) {
        data.sale_price = this.props.intl.formatMessage({
          id: this.props.price_types_desc[v]
        });
      }
    } else {
      const symbol_quote = this.props.symbol_quote;
      const symbolId = (this.props.match.params.symbol_id || "").toUpperCase();
      const q = symbol_quote[symbolId] || {};
      if (name.indexOf("buy") > -1) {
        data.buy_price =
          q && q.c ? helper.digits(q.c, Number(this.props.max_digits)) : "";
      }
      if (name.indexOf("sale") > -1) {
        data.sale_price =
          q && q.c ? helper.digits(q.c, Number(this.props.max_digits)) : "";
      }
    }
    // 获取不到当前模式的价格时，进行提示
    const side = /buy/i.test(name) ? "BUY" : "SELL";
    const price = this.getPrice(side, Number(v));
    let msg = "";
    if (!price) {
      switch (Number(v)) {
        case 1:
          msg = this.props.intl.formatMessage({ id: "暂无市价" });
          break;
        case 2:
          msg = this.props.intl.formatMessage({ id: "暂无对手价" });
          break;
        case 3:
          msg = this.props.intl.formatMessage({ id: "暂无排队价" });
          break;
        case 4:
          msg = this.props.intl.formatMessage({ id: "暂无超价" });
          break;
      }
    }
    this.setState({
      [name.indexOf("buy") > -1 ? "buy_price" : "sale_price"]: {
        msg: msg
      }
    });
    await this.props.dispatch({
      type: "future/save",
      payload: data
    });
    // 修改价格类型后，重新计算最大值
    this.props.dispatch({
      type: "future/save",
      payload: {
        buy_max: this.getMax("BUY"),
        sale_max: this.getMax("SELL")
      }
    });
  };
  // 下拉修改杠杠值
  leverageChange = name => e => {
    const value = e.target.value;
    window.localStorage[
      this.props.match.params.symbol_id.toUpperCase() +
        +this.props.order_choose +
        name
    ] = value;
    this.props.dispatch({
      type: "future/save",
      payload: {
        [name]: value
      }
    });
    // this.closeLever("buy_lever");
    // this.closeLever("sale_lever");
  };
  // 需求变更：成本改为保证金；成本=起始保证金 + 开仓手续费； 保证金=起始保证金；
  // 计算成本(委托保证金) = 起始保证金 + 开仓手续费
  // 起始保证金 = (反向合约 ? 1/价格 : 价格) * 合约乘数 * 数量 * 起始保证金率(1/杠杠)[8位小数,向上进位]
  // 开仓手续费 = (反向合约 ? 1/价格 : 价格) * 合约乘数 * 数量 * 费率(maker,taker取最大值)
  // price = 价格
  // quantity = 数量
  // type = 方向 BUY_OPEN/SELL_OPEN
  // return [值,法币符号,法币值,起始保证金];
  cost = (quantity, type) => {
    const side = type.replace("_OPEN", "");
    const price_type =
      side == "BUY" ? this.props.buy_price_type : this.props.sale_price_type;
    let price = this.getPrice(side, price_type);
    if (
      !Boolean(Number(price)) ||
      !Boolean(Number(quantity)) ||
      !type ||
      this.props.order_choose == 1
    ) {
      return ["--", "", "--", ""];
    }
    const symbolId = (this.props.symbol_id || "").toUpperCase();
    const order_setting = this.props.order_setting;
    if (!symbolId || !order_setting || !order_setting[symbolId]) {
      return ["--", "", "--", ""];
    }
    const riskLimits = order_setting[symbolId];
    if (!riskLimits || !riskLimits.riskLimit) {
      return ["--", "", "--", ""];
    }
    let symbol_info = this.props.config.symbols_obj.all[symbolId] || {};
    if (!symbol_info.symbolId) {
      return ["--", "", "--", ""];
    }
    // 反向合约
    if (symbol_info.isReverse) {
      price = 1 / price;
    }
    let riskLimit = {}; // 当前方向的风险数据
    riskLimits.riskLimit.map(item => {
      if (item.side == type) {
        riskLimit = item;
      }
    });
    const initialMargin = riskLimit.initialMargin; // 起始保证金率,最小值
    const leverage =
      type == "BUY_OPEN" ? this.props.buy_leverage : this.props.sale_leverage;
    let currentMargin = leverage
      ? math
          .chain(1)
          .divide(math.bignumber(leverage))
          .format({ notation: "fixed" })
          .done()
      : 0; // 当前杠杠下的保证金率
    // 当前保证金率，保留8位小数，向上取整;
    currentMargin = helper.digits2(currentMargin, CONST.initialMargin);
    const contractMultiplier = symbol_info.baseTokenFutures.contractMultiplier; // 合约乘数
    //const fee = this.getFee(); // 费率
    const fee = 0; // 需求变更，仅展示保证金
    const marginPrecision =
      CONST["depth"][symbol_info.baseTokenFutures.marginPrecision]; // 保证金精度
    const v = math
      .chain(math.bignumber(currentMargin))
      //.add(math.bignumber(fee))
      .multiply(math.bignumber(contractMultiplier))
      .multiply(math.bignumber(price))
      .multiply(math.bignumber(quantity))
      .format({ notation: "fixed" })
      .done();
    const _v = helper.digits(v, marginPrecision);
    const coin = symbol_info.quoteTokenId;
    const __v = helper.currencyValue(this.props.rates, _v, coin);
    // 保证金
    let v2 = math
      .chain(math.bignumber(currentMargin))
      .multiply(math.bignumber(contractMultiplier))
      .multiply(math.bignumber(price))
      .multiply(math.bignumber(quantity))
      .format({ notation: "fixed" })
      .done();
    v2 = helper.digits(v2, marginPrecision);
    return [_v, __v[0], __v[1], v2];
  };
  // 滑动条滑动
  sliderChange = (e, v) => {
    // this.setState({
    //   slider: v
    // });
    const buy_max = this.getMax("BUY");
    if (this.props.order_side == 0 && Number(buy_max)) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          buy_quantity: v
            ? helper.digits(
                math
                  .chain(math.bignumber(v))
                  .divide(100)
                  .multiply(math.bignumber(buy_max))
                  .format({ notation: "fixed" })
                  .done(),
                this.props.base_precision
              )
            : "",
          buy_progress: v
        }
      });
      this.setState({
        buy_quantity: { msg: "" }
      });
    }
    const sale_max = this.getMax("SELL");
    if (this.props.order_side == 1 && Number(sale_max)) {
      this.props.dispatch({
        type: "future/save",
        payload: {
          sale_progress: v,
          sale_quantity: helper.digits(
            math
              .chain(math.bignumber(v))
              .divide(100)
              .multiply(math.bignumber(sale_max))
              .format({ notation: "fixed" })
              .done(),
            this.props.base_precision
          )
        }
      });
      this.setState({
        sale_quantity: { msg: "" }
      });
    }
  };
  changeSide = (key, n) => e => {
    const symbol_quote = this.props.symbol_quote;
    const quote =
      this.props.symbol_id && symbol_quote[this.props.symbol_id]
        ? symbol_quote[this.props.symbol_id]
        : {};
    this.props.dispatch({
      type: "future/save",
      payload: {
        [key]: n,
        buy_price: quote.c || this.props.buy_price,
        sale_price: quote.c || this.props.sale_price,
        buy_quantity: "",
        sale_quantity: "",
        buy_progress: 0,
        sale_progress: 0
      }
    });
  };
  change = key => () => {
    this.setState({
      open: key
    });
  };
  render() {
    const { classes, ...otherProps } = this.props;
    const token1_name = this.props.intl.formatMessage({
      id: "张"
    });

    let symbolId = this.props.match.params.symbol_id;
    if (!symbolId) {
      return <div />;
    }
    symbolId = symbolId.toUpperCase();
    const symbol_quote = this.props.symbol_quote;
    const tokenQuote = symbol_quote[symbolId] || {};

    // 当前永续合约基础信息
    let symbol_info = this.props.config.symbols_obj.all[symbolId];
    if (!symbol_info) {
      return <div />;
    }

    // 当前永续合约用户的配置信息
    let symbol_setting = this.props.order_setting[symbolId] || {};
    const isConfirm =
      symbol_setting && symbol_setting.orderSetting
        ? Boolean(symbol_setting.orderSetting.isConfirm)
        : false;
    // 风险限额列表
    let futuresRiskLimits = symbol_info.baseTokenFutures.riskLimits;
    let token2_name = symbol_info.quoteTokenName;
    // 杠杆列表
    let futuresLevers = symbol_info.baseTokenFutures
      ? symbol_info.baseTokenFutures.levers
      : [];
    // 风险总额信息,风险限额右值
    let buy_risk_info = {};
    let sale_risk_info = {};
    futuresRiskLimits.map(item => {
      if (item.riskLimitId == this.props.buy_risk) {
        buy_risk_info = item;
      }
      if (item.riskLimitId == this.props.sale_risk) {
        sale_risk_info = item;
      }
    });
    // 当前可交易信息：风险额,风险限额左值
    let tradeable = this.props.future_tradeable[symbolId] || {};
    const marginPrecision =
      CONST["depth"][symbol_info.baseTokenFutures.marginPrecision]; // 保证金精度
    const profitLoss = tradeable.profitLoss || {};

    const { buy_lever, sale_lever } = this.props;
    const displayTokenId =
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? symbol_info.baseTokenFutures.displayTokenId
        : "";
    const buy_price_rates =
      Number(this.props.buy_price) &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? helper.currencyValue(
            this.props.rates,
            this.props.buy_price,
            symbol_info.baseTokenFutures.displayTokenId
          )
        : ["", ""];
    const sale_price_rates =
      Number(this.props.sale_price) &&
      symbol_info.baseTokenFutures &&
      symbol_info.baseTokenFutures.displayTokenId
        ? helper.currencyValue(
            this.props.rates,
            this.props.sale_price,
            symbol_info.baseTokenFutures.displayTokenId
          )
        : ["", ""];
    // buy 成本
    const buy_cost = this.cost(
      //this.props.buy_price,
      this.props.buy_quantity,
      "BUY_OPEN"
    );
    // sell 成本
    const sale_cost = this.cost(
      //this.props.sale_price,
      this.props.sale_quantity,
      "SELL_OPEN"
    );
    return (
      <div className={classes.form}>
        <Grid container>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={
                this.props.order_side == 0
                  ? classes.greenBtn
                  : classes.defaultBtn
              }
              onClick={this.changeSide("order_side", 0)}
            >
              {this.props.intl.formatMessage({
                id: this.props.order_choose == 0 ? "开多" : "平空"
              })}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              className={
                this.props.order_side == 1 ? classes.redBtn : classes.defaultBtn
              }
              onClick={this.changeSide("order_side", 1)}
            >
              {this.props.intl.formatMessage({
                id: this.props.order_choose == 0 ? "开空" : "平多"
              })}
            </Button>
          </Grid>
        </Grid>
        <div
          style={{
            height: 226,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <Grid
            container
            justify="space-between"
            style={{ margin: "10px 0 0" }}
          >
            <Grid item>
              <Select
                native
                value={
                  this.props.order_side == 0
                    ? this.props.buy_type
                    : this.props.sale_type
                }
                onChange={this.changeProps(
                  this.props.order_side == 0 ? "buy" : "sale"
                )}
              >
                <option value={0}>
                  {this.props.intl.formatMessage({ id: "普通委托" })}
                </option>
                <option value={1}>
                  {this.props.intl.formatMessage({ id: "计划委托" })}
                </option>
              </Select>
            </Grid>
            <Grid item>
              {this.props.order_choose == 0 ? (
                <Select
                  native
                  onChange={this.leverageChange(
                    this.props.order_side == 0
                      ? "buy_leverage"
                      : "sale_leverage"
                  )}
                  value={
                    this.props.order_side == 0
                      ? this.props.buy_leverage
                      : this.props.sale_leverage
                  }
                >
                  {this.leversList(
                    this.props.order_side == 0 ? "BUY_OPEN" : "SELL_OPEN"
                  ).map(item => {
                    return (
                      <option key={item} value={item}>
                        {item}X
                      </option>
                    );
                  })}
                </Select>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
          {this.props.buy_type == 1 && this.props.order_side == 0 ? (
            <TextField
              autoComplete="off"
              error={Boolean(this.state.buy_trigger_price.msg)}
              className={classes.input}
              name="buy_trigger_price"
              value={this.props.buy_trigger_price}
              placeholder={
                this.props.intl.formatMessage({
                  id: "触发价格"
                }) + `(${displayTokenId})`
              }
              onChange={this.handleChange}
              InputProps={{
                classes: { root: classes.filed }
              }}
              fullWidth
              //helperText={this.state.buy_trigger_price.msg}
              style={{ margin: "10px 0 0" }}
            />
          ) : (
            ""
          )}
          {this.props.sale_type == 1 && this.props.order_side == 1 ? (
            <TextField
              autoComplete="off"
              error={Boolean(this.state.sale_trigger_price.msg)}
              className={classes.input}
              name="sale_trigger_price"
              value={this.props.sale_trigger_price}
              onChange={this.handleChange}
              placeholder={
                this.props.intl.formatMessage({
                  id: "触发价格"
                }) + `(${displayTokenId})`
              }
              //helperText={this.state.sale_trigger_price.msg}
              InputProps={{
                classes: { root: classes.filed }
              }}
              fullWidth
              style={{ margin: "10px 0 0" }}
            />
          ) : (
            ""
          )}

          {this.props.order_side == 0 ? (
            <Grid
              container
              style={{ margin: "10px 0 0" }}
              alignItems="flex-end"
            >
              <Grid item style={{ flex: 1 }}>
                <TextField
                  error={this.state.buy_price.msg ? true : false}
                  className={classes.input}
                  name="buy_price"
                  value={this.props.buy_price}
                  onChange={this.handleChange}
                  disabled={Boolean(Number(this.props.buy_price_type))}
                  placeholder={this.props.intl.formatMessage({
                    id: this.props.price_types_desc[this.props.buy_price_type]
                  })}
                  autoComplete="off"
                  InputProps={{
                    classes: {
                      root: classes.filed,
                      disabled: classes.filed_diabled
                    }
                  }}
                  fullWidth
                  //helperText={this.state.buy_price.msg}
                />
              </Grid>
              {this.props.buy_type == 0 ? (
                <Grid item>
                  <Select
                    name="buy_price_type"
                    value={this.props.buy_price_type}
                    onChange={this.changePriceType}
                    className={classes.filed}
                  >
                    {this.props.price_types.map((item, i) => {
                      return (
                        <MenuItem value={i} key={i}>
                          {this.props.intl.formatMessage({
                            id: this.props.price_types_desc[i]
                          })}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          ) : (
            <Grid
              container
              style={{ margin: "10px 0 0" }}
              alignItems="flex-end"
            >
              <Grid item style={{ flex: 1 }}>
                <TextField
                  error={this.state.sale_price.msg ? true : false}
                  className={classes.input}
                  name="sale_price"
                  value={this.props.sale_price}
                  disabled={Boolean(Number(this.props.sale_price_type))}
                  onChange={this.handleChange}
                  placeholder={this.props.intl.formatMessage({
                    id: this.props.price_types_desc[this.props.sale_price_type]
                  })}
                  autoComplete="off"
                  InputProps={{
                    classes: {
                      root: classes.filed,
                      disabled: classes.filed_diabled
                    }
                  }}
                  //helperText={this.state.sale_price.msg}
                  fullWidth
                />
              </Grid>
              {this.props.sale_type == 0 ? (
                <Select
                  name="sale_price_type"
                  value={this.props.sale_price_type}
                  onChange={this.changePriceType}
                  className={classes.filed}
                >
                  {this.props.price_types.map((item, i) => {
                    return (
                      <MenuItem value={i} key={i}>
                        {this.props.intl.formatMessage({
                          id: this.props.price_types_desc[i]
                        })}
                      </MenuItem>
                    );
                  })}
                </Select>
              ) : (
                ""
              )}
            </Grid>
          )}
          {this.props.order_side == 0 ? (
            <TextField
              autoComplete="off"
              error={this.state.buy_quantity.msg ? true : false}
              className={classes.input}
              name="buy_quantity"
              value={this.props.buy_quantity}
              onChange={this.handleChange}
              InputProps={{
                classes: { root: classes.filed },
                endAdornment: (
                  <InputAdornment position="end">
                    <span>{token1_name}</span>
                  </InputAdornment>
                )
              }}
              //helperText={this.state.buy_quantity.msg}
              placeholder={this.props.intl.formatMessage({ id: "数量" })}
              style={{ margin: "10px 0 0" }}
            />
          ) : (
            <TextField
              error={this.state.sale_quantity.msg ? true : false}
              className={classes.input}
              autoComplete="off"
              name="sale_quantity"
              value={this.props.sale_quantity}
              onChange={this.handleChange}
              InputProps={{
                classes: { root: classes.filed },
                endAdornment: (
                  <InputAdornment position="end">
                    <span>{token1_name}</span>
                  </InputAdornment>
                )
              }}
              //helperText={this.state.sale_quantity.msg}
              placeholder={this.props.intl.formatMessage({ id: "数量" })}
              style={{ margin: "10px 0 0" }}
            />
          )}
          <Slider
            marks={[
              {
                value: 0
              },
              {
                value: 25
              },
              {
                value: 50
              },
              {
                value: 75
              },
              {
                value: 100
              }
            ]}
            min={0}
            max={100}
            step={1}
            value={
              this.props.order_side == 0
                ? this.props.buy_progress
                : this.props.sale_progress
            }
            onChange={this.sliderChange}
            classes={{
              rail: classes.rail,
              mark: classes.mark,
              markActive: classes.markActive,
              root: classes.slider
            }}
          />
        </div>
        <div className={classes.tradeable}>
          {this.props.order_choose == 0 ? (
            <Grid
              container
              wrap="nowrap"
              style={{ height: 20, overflow: "hidden" }}
              justify="space-between"
            >
              <Grid item style={{ wordBreak: "keep-all" }}>
                {this.props.intl.formatMessage({ id: "可用" })}
              </Grid>
              <Grid item style={{ wordBreak: "keep-all" }}>
                {profitLoss.coinAvailable && marginPrecision
                  ? helper.digits(profitLoss.coinAvailable, marginPrecision)
                  : profitLoss.coinAvailable}{" "}
                {token2_name}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {this.props.order_choose == 0 ? (
            <Grid
              container
              justify="space-between"
              wrap="nowrap"
              style={{ height: 20, overflow: "hidden" }}
            >
              <Grid item>
                {this.props.intl.formatMessage({ id: "保证金" })}
              </Grid>
              <Grid item>
                {this.props.order_side == 0 ? buy_cost[0] : sale_cost[0]}{" "}
                {token2_name}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {this.props.order_choose == 1 ? (
            <Grid container justify="space-between">
              <Grid item>
                {this.props.intl.formatMessage({ id: "可平量" })}
              </Grid>
              <Grid item>
                {this.props.order_side == 0
                  ? tradeable.shortAvailable && symbol_info.basePrecision
                    ? helper.digits(
                        tradeable.shortAvailable,
                        CONST["depth"][symbol_info.basePrecision]
                      )
                    : tradeable.shortAvailable || "--"
                  : tradeable.longAvailable && symbol_info.basePrecision
                  ? helper.digits(
                      tradeable.longAvailable,
                      CONST["depth"][symbol_info.basePrecision]
                    )
                  : tradeable.longAvailable || "--"}{" "}
                {token1_name}
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </div>
        <div className={classes.transform}>
          {this.props.userinfo.userId ? (
            <span onClick={this.change(true)}>
              {this.props.intl.formatMessage({ id: "划转" })}
            </span>
          ) : (
            ""
          )}
        </div>
        {this.props.userinfo.userId ? (
          Boolean(this.props.loading.effects["future/createOrder"]) ? (
            <Button fullWidth disabled>
              <CircularProgress size={24} color="primary" />
            </Button>
          ) : (
            <Button
              fullWidth
              disabled={Boolean(
                this.props.loading.effects["future/createOrder"]
              )}
              className={
                this.props.order_side == 0 ? classes.greenBtn2 : classes.redBtn2
              }
              onClick={this.orderCreate.bind(
                this,
                this.props.order_sides[this.props.order_side],
                true
              )}
            >
              {this.props.intl.formatMessage({
                id: [
                  ["开多", "开空"],
                  ["平空", "平多"]
                ][this.props.order_choose][this.props.order_side]
              })}{" "}
            </Button>
          )
        ) : (
          <Button
            fullWidth
            color="primary"
            variant="contained"
            href={
              route_map.login +
              "?redirect=" +
              encodeURIComponent(window.location.href)
            }
          >
            {this.props.intl.formatMessage({ id: "登录" })}
          </Button>
        )}
        <TransferModal
          open={this.state.open}
          source_type={this.props.account_coin_index}
          target_type={this.props.account_future_index}
          onCancel={this.change(false)}
          token_id={token2_name}
          {...otherProps}
        />
        <ModalOrder
          open={this.props.modal_order}
          {...otherProps}
          orderCreate={this.orderCreate}
          isConfirm={isConfirm}
          cost={this.props.order_side == 0 ? buy_cost[3] : sale_cost[3]}
          handleClose={() => {
            this.props.dispatch({
              type: "future/save",
              payload: {
                modal_order: false
              }
            });
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(injectIntl(TradeRC));
