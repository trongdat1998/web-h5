module.exports = {
  "/s_api": {
    target: "https://www.wisebitcoin.pro",
    changeOrigin: true,
    https: true,
    headers: {
      Referer: "https://www.wisebitcoin.pro",
    },
    cookieDomainRewrite: "localhost",
  },
  "/api/ws/": {
    target: "wss://ws.wisebitcoin.pro",
    ws: true,
    changeOrigin: true,
    secure: false,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
  },
  "/api": {
    target: "https://www.wisebitcoin.pro",
    changeOrigin: true,
    https: true,
    headers: {
      Referer: "https://www.wisebitcoin.pro",
    },
    cookieDomainRewrite: "localhost",
  },
  "/ws/quote/": {
    target: "wss://ws.wisebitcoin.pro",
    ws: true,
    changeOrigin: true,
    secure: false,
    logLevel: "debug",
    cookieDomainRewrite: "localhost",
  },
};
