let base = require("./cfg/base.js");
let dev = require("./cfg/dev.js");
let prod = require("./cfg/prod.js");
let settings = require("./cfg/settings.js");

let webpackCfg = (function () {
    let setOption = function (option) {
        settings.set(option);
    };

    let getConfig = function (option) {
        setOption(option);

        let options = settings.get();
        // webpack基础配置
        base.init(options);
        let baseConfig = base.getConfig();
        // webpack环境配置
        let envConfig = null;

        if (options.env == "dev") {
            // webpack开发环境配置
            dev.init(options, base.entryPages());
            envConfig = dev.getConfig();
        } else {
            // webpack测试或生产环境配置
            prod.init(options, base.entryPages());
            envConfig = prod.getConfig();
        }

        // 合并webpack插件
        envConfig.plugins = (envConfig.plugins || []).concat(baseConfig.plugins);

        // 去掉打印信息
        envConfig.stats = {
            entrypoints: false,
            children: false
        }

        // 环境配置覆盖base配置
        return Object.assign(baseConfig, envConfig);
    };

    return {
        setOption,
        getConfig
    }
}())

module.exports = webpackCfg;