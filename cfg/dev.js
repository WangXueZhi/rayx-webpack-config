let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
// let HtmlWebpackEventPlugin = require('html-webpack-event-plugin');
let settings = require('./settings.js');

// 项目页面路径
let publicPagePath = '/';
// 项目资源路径
let publicAssetPath = null;
// 后端接口路径
let publicRpcPath = null;
// 页面列表
let pageListArray = null;

let devServerProxy = {
  '/proxy/': {
    target: 'https://www.wdai.com/',
    pathRewrite: {
      '^/proxy/': '/'
    },
    logLevel: 'debug', // 修改 webpack-dev-server 的日志等级
    secure: false, // 忽略检查代理目标的 SSL 证书
    changeOrigin: true, // 修改代理目标请求头中的 host 为目标源
    onProxyReq: (proxyReq, req /*, res*/) => { // 代理目标请求发出前触发
      /**
       * 当代理 POST 请求时 http-proxy-middleware 与 body-parser 有冲突。
       * [Modify Post Parameters](https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md)
       * [Edit proxy request/response POST parameters](https://github.com/chimurai/http-proxy-middleware/issues/61)
       * [socket hang up error with nodejs](http://stackoverflow.com/questions/25207333/socket-hang-up-error-with-nodejs)
       */
      let body = req.body;
      let method = req.method.toLowerCase();

      if (body && method == 'post') {
        let contentType = req.get('Content-Type');
        contentType = contentType ? contentType.toLowerCase() : '';

        if (contentType.includes('application/json')) {
          // 使用 application/json 类型提交表单
          let bodyData = JSON.stringify(body);

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          // 使用 application/x-www-form-urlencoded 类型提交表单
          let bodyData = Object.keys(body).map((key) => {
            let val = body[key];
            val = val ? val : '';
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
          }).join('&');

          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        } else if (contentType.includes('multipart/form-data')) {
          // 使用 multipart/form-data 类型提交表单
        }
      }
    },
    onProxyRes: ( /*proxyRes, req, res*/) => { // 代理目标响应接收后触发
    },
    onError: ( /*err, req, res*/) => { // 代理目标出现错误后触发
    }
  }
};

// 基本参数
let baseOption = {}

// 初始化
let init = function (options, pageList) {
  baseOption = options;
  pageListArray = pageList;
  publicRpcPath = baseOption.rpcPath;
  publicAssetPath = baseOption.assetsPath;
}

let getConfig = () => {
  return {
    mode: "development",
    output: {
      path: baseOption.distPath,
      publicPath: `/`,
      filename: '[name].js',
      chunkFilename: '[name]-[id].[chunkhash:8].bundle.js'
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendors: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    devServer: Object.assign({
      hot: true,
      noInfo: false,
      contentBase: baseOption.distPath,
      disableHostCheck: true,
      port: 8000,
      host: "0.0.0.0",
      proxy: devServerProxy
    }, baseOption.dev.devServer || {}),
    performance: {
      hints: false
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new webpack.DefinePlugin(settings.getDefinePluginParam({
        defineEnv: 'dev',
        defineDebug: true,
        publicPagePath,
        publicPageFullname: settings.getPublicPageFullname(publicPagePath, baseOption.pageSuffix, pageListArray),
        publicAssetPath,
        publicRpcPath
      })),
      new webpack.HotModuleReplacementPlugin()
    ]
  }
}

module.exports = {
  getConfig,
  init
};