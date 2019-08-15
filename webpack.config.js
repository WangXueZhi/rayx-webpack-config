let webpackCfg = require("./index.js");
let pkg = require('./package.json');

let __URL_HOST__ = process.env.GULP_ENV === "prod" ? "生产环境域名" : "测试环境域名";
let config = webpackCfg.getConfig({
    // 版本号
    version: pkg.version,

    // 环境变量：dev,test,prod。默认test
    env: process.env.NODE_ENV === 'development' ? "dev" : process.env.GULP_ENV,

    // 后端接口路径
    rpcPath: {},

    // 测试和生产环境配置
    prod: {
        // 静态资源目录，如有cdn，建议采用cdn目录，防止资源回流对服务器造成压力
        assetPath: `//${__URL_HOST__}/assets/`
    }
});
module.exports = config;