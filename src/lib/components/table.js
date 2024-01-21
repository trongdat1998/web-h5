import React from "react";
import classnames from "classnames";
import "../css/table.less";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, injectIntl } from "react-intl";

/**
 * table component
 * @param {Array} titles 表头 [{key,value}]
 * @param {Array} data 数据 [{titles[0][key]:value}, {titles[1][key]:value}]
 * @param {String} className
 * @param {String} Url
 *
 */
class TableRC extends React.Component {
  constructor() {
    super();
    this.state = {
      h: 0,
    };
    this.renderTitle = this.renderTitle.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.getMore = this.getMore.bind(this);
    this.itemClick = this.itemClick.bind(this);
    this.dataItemClick = this.dataItemClick.bind(this);
  }
  componentDidMount() {
    this.setState({
      h: this.table.offsetHeight,
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.isLast != nextProps.isLast ||
      this.props.widthStyle != nextProps.widthStyle ||
      this.props.getMore != nextProps.getMore ||
      this.props.className != nextProps.className ||
      this.props.data.length != nextProps.data.length ||
      this.props.hasMore != nextProps.hasMore
    ) {
      return true;
    }
    let r = false;
    nextProps.data.map((item, i) => {
      for (let k in item) {
        if (item[k] != this.props.data[i][k]) {
          r = true;
        }
      }
    });
    return r;
  }
  getMore() {}
  renderTitle(titles = []) {
    return (
      <div className={classnames("theader", this.props.widthStyle)}>
        {titles.map((item, i) => {
          return <div key={item.key + "title"}>{item.title}</div>;
        })}
      </div>
    );
  }
  itemClick(record) {
    this.props.itemClick && this.props.itemClick(record);
  }
  dataItemClick(reocrd, click) {
    if (click) {
      click(reocrd);
    }
  }
  renderBody(data = []) {
    if (!data.length) {
      return (
        <div className="list" ref={(ref) => (this.list = ref)}>
          <p className={"noresult"}>
            <FormattedMessage id="暂无记录" />
          </p>
        </div>
      );
    }
    const titles = this.props.titles;

    if (this.props.children) {
      return this.props.children;
    }

    return (
      <div className={"list"} ref={(ref) => (this.list = ref)}>
        {data.map((item, i) => {
          return (
            <div
              key={i}
              className={classnames("item", this.props.widthStyle)}
              onClick={this.itemClick.bind(this, item)}
            >
              {titles.map((it, n) => {
                return (
                  <div
                    key={it.key + "item"}
                    onClick={this.dataItemClick.bind(this, item, it.onClick)}
                  >
                    {it.render
                      ? it.render(item[it.key], item, i)
                      : item[it.key]}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    return (
      <div className={classnames("g-table", this.props.className)}>
        {this.props.notitle ? "" : this.renderTitle(this.props.titles)}
        <div className={"tbody"} ref={(ref) => (this.table = ref)}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.props.getMore || this.getMore}
            initialLoad={false}
            hasMore={this.props.hasMore}
            useWindow={this.props.useWindow || false}
            threshold={40}
          >
            {this.renderBody(this.props.data)}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default injectIntl(TableRC);
