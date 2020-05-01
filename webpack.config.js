let webpackCfg = require("./index.js");
let pkg = require('./package.json');

let __URL_HOST__ = process.env.GULP_ENV === "prod" ? "weidai.com.cn" : "wdai.com";
let config = webpackCfg.getConfig({
    // 版本号，默认1.0.0
    version: pkg.version,

    // 环境变量：dev,test,prod。默认test
    env: process.env.NODE_ENV === 'development' ? "dev" : process.env.GULP_ENV,

    // 需要提取的公共依赖
    extractBundle: {
        commonBundle: [
            'commons/base', 'commons/util', 'commons/device', 'commons/config',
            'sources/db.global', 'sources/db.h5'
        ],
        reactBundle: ['react', 'react-dom'],
    },

    // 后端接口路径
    rpcPath: {},

    // 测试和生产环境配置
    prod: {
        // 替换资源路径
        assetPath: `//static1.${__URL_HOST__}/static/${pkg.deploy.cdnDir}/${pkg.version}/assets/`
    }
});
module.exports = config;