const { createProxyMiddleware } = require('http-proxy-middleware');

// Used in local development server only
module.exports = function (app) {
  const target = 'http://localhost:8080'
  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
  app.use(
    '/login',
    createProxyMiddleware({ target })
  )
};
