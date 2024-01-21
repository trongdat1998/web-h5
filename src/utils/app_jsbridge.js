/**
 *  js 调用用app的 方法
 */

/**
 * WebViewJavascriptBridge
 * opt.name :
 * 1、appSubmitPhoto 上传图片
 */

// android 未注入之前调用队列
window.WVJBCallbacks = window.WVJBCallbacks || [];

function cb(res, opt) {
  if (Object.prototype.toString.call(res) == "[object String]") {
    res = eval("(" + res + ")");
  }
  if (res && res.code == "OK") {
    opt.success && opt.success(res);
  } else if (res && res.code == "CANCEL") {
    opt.cancel && opt.cancel(res);
  } else {
    opt.error && opt.error(res);
  }
}

export function callHandler(opt) {
  if (window.WebViewJavascriptBridge) {
    if (opt.data) {
      window.WebViewJavascriptBridge.callHandler(opt.name, opt.data, function(
        res
      ) {
        cb(res, opt);
      });
    } else {
      window.WebViewJavascriptBridge.callHandler(opt.name, function(res) {
        cb(res, opt);
      });
    }
  } else {
    window.WVJBCallbacks.push(opt);
  }
}
