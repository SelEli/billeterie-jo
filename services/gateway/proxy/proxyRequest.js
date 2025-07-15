// proxy/proxyRequest.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (target) => {
  if (!target) {
    console.warn('Proxy target is missing. Skipping proxy creation.');
    return (req, res) => res.status(502).json({ message: 'Proxy target missing.' });
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^/`]: '/' },
  });
};
