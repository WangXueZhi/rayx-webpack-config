let path = require('path');
let webpack = require('webpack');
let settings = require('./settings.js');

// 项目页面路径
let publicPagePath = './';
// 项目资源路径
let publicAssetPath = "./";
// 后端接口路径
let publicRpcPath = null;
// 页面列表
let pageListArray = null;

// 基本参数
let baseOption = {}

// 初始化
let init = function (options, pageList) {
    baseOption = options;
    pageListArray = pageList;
    publicRpcPath = baseOption.rpcPath;
    publicAssetPath = baseOption.prod.assetPath;
}

let getConfig = () => {
    return {
        mode: process.env.GULP_ENV == "prod" ? "production" : "development",
        output: {
            path: baseOption.assetsPath,
            publicPath: publicAssetPath,
            filename: 'js/[name].js?t=[hash]'
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
        performance: {
            hints: false
        },
        devtool: process.env.GULP_ENV == "prod" ? 'source-map' : 'cheap-module-eval-source-map',
        plugins: [
            new webpack.DefinePlugin(settings.getDefinePluginParam({
                defineEnv: process.env.GULP_ENV,
                defineDebug: true,
                publicPagePath,
                publicPageFullname: settings.getPublicPageFullname(publicPagePath, baseOption.pageSuffix, pageListArray),
                publicAssetPath,
                publicRpcPath,
                'process.env.NODE_ENV': JSON.stringify('production')
            })),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        ]
    }
}

module.exports = {
    getConfig,
    init
};