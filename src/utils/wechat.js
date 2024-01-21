import map from "../config/api";
import request from "./request";
import report from "./report";

const wx = window.wx;
const api = map.wechat;
const jsApiList = [
  "checkJsApi",
  "onMenuShareTimeline",
  "onMenuShareAppMessage",
  "onMenuShareQQ",
  "onMenuShareWeibo",
  "updateAppMessageShareData",
  "updateTimelineShareData",
  "showMenuItems",
  "hideMenuItems",
  "hideOptionMenu",
  "chooseImage",
  "previewImage",
  "uploadImage",
  "showAllNonBaseMenuItem",
  "hideAllNonBaseMenuItem"
];

/**
 * wechat js sdk
 * @param {Object} opts
 * @param {Array} opts.jsApiList
 * @param {Function} opts.ready
 * @param {Function} opts.error
 */
const getConfig = async (opts = {}) => {
  const result = await request(api, {
    body: {
      url: encodeURIComponent(window.location.href.split("#")[0])
    }
  });
  if (result.code != "OK") return;
  const d = result.data.data;
  wx.config({
    debug: false,
    appId: d ? d.appId : "",
    timestamp: d ? d.timestamp : "",
    nonceStr: d ? d.nonceStr : "",
    signature: d ? d.signature : "",
    jsApiList: jsApiList
  });
  wx.ready(function() {
    wx.checkJsApi({
      jsApiList: jsApiList,
      success: function(res) {
        if (!/android/.test(navigator.userAgent.toLowerCase())) {
          wx.hideOptionMenu();
        }
        // for android jssdk 失败
        if (/android/.test(navigator.userAgent.toLowerCase())) {
          //wx.showAllNonBaseMenuItem();
          wx.hideAllNonBaseMenuItem();
        }
        // 默认关闭分享
        wx.hideMenuItems({
          menuList: [
            "menuItem:share:appMessage",
            "menuItem:share:timeline",
            "menuItem:share:qq",
            "menuItem:share:weiboApp"
          ]
        });
        opts.ready && opts.ready();
      },
      fail: function(res) {
        let msg =
          Object.prototype.toString.call(res) == "[object String]"
            ? res
            : JSON.stringify(res);
        //report(msg);
      }
    });
  });
  wx.error(function(res) {
    opts.error && opts.error(res);
    let msg =
      Object.prototype.toString.call(res) == "[object String]"
        ? res
        : JSON.stringify(res);
    //report(msg);
  });
};

/**
 * wechat分享
 * @param {Object} opts
 * @param {String} title 标题
 * @param {String} desc 描述
 * @param {String} link 分享的链接
 * @param {String} imgUrl 图片地址
 * @param {Function} success 成功回调
 * @param {Function} cancel 取消回调
 */
const share = opts => {
  const opt = opts || {};
  const args = {
    title: opt.title,
    desc: opt.desc,
    link: opt.link,
    imgUrl: opt.imgUrl,
    success: function() {
      opt.success && opt.success();
    },
    cancel: function() {
      opt.cancel && opt.cancel();
    }
  };
  wx.ready(function() {
    wx.showMenuItems({
      menuList: [
        "menuItem:share:appMessage",
        "menuItem:share:timeline",
        "menuItem:share:qq",
        "menuItem:share:weiboApp"
      ]
    });

    wx.onMenuShareTimeline(args);
    wx.onMenuShareAppMessage(args);
    wx.onMenuShareQQ(args);
    wx.onMenuShareWeibo(args);
    wx.updateAppMessageShareData(args);
    wx.updateTimelineShareData(args);
  });
};

export default {
  getConfig,
  share
};
