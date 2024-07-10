const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const apiBaseDomain = 'dxecpn25u4tmv.cloudfront.net';

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/chat-ui'),
  },
  devServer: {
    port: 4200,
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/chat_talk': {
        changeOrigin: true,
        cookieDomainRewrite: apiBaseDomain,
        target: `https://${apiBaseDomain}`,
        onProxyReq: (proxyReq) => {
          if (proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', `https://${apiBaseDomain}`);
          }
        },
      },
    },
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'swc',
      main: './src/main.ts',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
  ],
};
