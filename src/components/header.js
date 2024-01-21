import React from "react";
import { injectIntl } from "react-intl";
import style from "./layout.style";
import { withStyles } from "@material-ui/core/styles";
import { Iconfont } from "../lib";
import { Grid, Drawer, List, ListItem, Divider } from "@material-ui/core";
import route_map from "../config/route_map";

class HeaderRC extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }
  componentDidMount() {}
  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  };
  gotoPC = () => {
    window.localStorage.keepWeb = 1;
    window.location.href = "/";
  };
  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.header}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          style={{ height: "100%" }}
        >
          <Grid xs={3} item style={{ padding: "0 0 0 12px" }}>
            {window.location.pathname == route_map.index ? (
              <span onClick={this.gotoPC} className={classes.gotoPC}>
                {this.props.intl.formatMessage({ id: "网页版" })}
              </span>
            ) : (
              ""
            )}
          </Grid>
          <Grid xs={6} item>
            {this.props.index_config && this.props.index_config.logo ? (
              <a href={route_map.index}>
                <img src={this.props.index_config.logo} />
              </a>
            ) : (
              ""
            )}
          </Grid>
          <Grid
            xs={3}
            item
            style={{ padding: "0 12px 0 0", textAlign: "right" }}
          >
            <a href={route_map.user_setting}>
              <Iconfont type="user" size="24" />
            </a>
          </Grid>
        </Grid>
        <Drawer open={this.state.open} onClose={this.toggleDrawer}>
          <List>
            {["menu1", "menu2", "menu3", "menu4", "menu5"].map(item => {
              return <ListItem key={item}>{item}</ListItem>;
            })}
          </List>
          <Divider />
          <List>
            {["menu6", "menu7"].map(item => {
              return <ListItem key={item}>{item}</ListItem>;
            })}
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(style)(injectIntl(HeaderRC));
