let path = require('path');

var settings = {
    version: "1.0.0",
    // 环境变量：dev,test,prod。默认test
    env: "test",
    // src路径，默认从当前执行node命令时候的文件夹地址里找
    srcPath: path.join(process.cwd(), './src'),
    // 页面文件后缀
    pageSuffix: ".html",
    // 页面路径，默认从srcPath目录里找
    pagePath: path.join(process.cwd(), './src/pages'),
    // 入口路径，默认从srcPath目录里找
    entryPath: path.join(process.cwd(), './src/entrys'),
    // 构建路径，默认从项目根目录里找
    distPath: path.join(process.cwd(), './dist'),
    // 构建资源路径，默认从distPath目录里找
    assetsPath: path.join(process.cwd(), `./dist/1.0.0/assets`),
    // 后端接口路径
    rpcPath: {},
    // 需要提取的公共依赖
    extractBundle: {},
    // 模块索引规则
    resolve: {
        extensions: ['.js'],
        alias: {
            api: path.join(path.join(process.cwd(), './src'), 'api'),
            commons: path.join(path.join(process.cwd(), './src'), 'commons'),
            components: path.join(path.join(process.cwd(), './src'), 'components'),
            images: path.join(path.join(process.cwd(), './src'), 'images'),
            sources: path.join(path.join(process.cwd(), './src'), 'sources'),
            styles: path.join(path.join(process.cwd(), './src'), 'styles'),
            views: path.join(path.join(process.cwd(), './src'), 'views')
        }
    },
    // 忽略索引模块
    externals: {},
    // 开发环境配置
    dev: {
        // 开发服务器配置
        devServer: {},
    },
    // 测试生产环境配置
    prod: {
        // 替换资源路径
        assetPath: ""
    },
    // loaders
    loaders: []
}


// 获取 DefinePlugin 插件参数
const getDefinePluginParam = (param) => {
    return {
        '__wpdf_define_env__': JSON.stringify(param.defineEnv),
        '__wpdf_define_debug__': JSON.stringify(param.defineDebug),
        '__wpdf_public_page_path__': JSON.stringify(param.publicPagePath),
        '__wpdf_public_page_fullname__': JSON.stringify(param.publicPageFullname),
        '__wpdf_public_asset_path__': JSON.stringify(param.publicAssetPath),
        '__wpdf_public_rpc_path__': JSON.stringify(param.publicRpcPath)
    };
};

// 获取入口页面对象
const getPublicPageFullname = (publicPagePath, pageSuffix, entryPages) => { // 项目页面全名
    let pageObj = {};
    entryPages.forEach(function (entryPage) {
        let separators = entryPage.split('.');
        let temp = pageObj;
        separators.forEach(function (separator, index, array) {
            if (index == array.length - 1) {
                temp[separator] = publicPagePath + entryPage + pageSuffix;
            }
            else {
                if (separator in temp) {
                    temp = temp[separator];
                }
                else {
                    temp = temp[separator] = {};
                }
            }
        });
    });
    return pageObj;
};

const get = () => {
    return settings;
}

const set = (options) => {
    if(!options.assetsPath){
        settings["assetsPath"] = path.join(process.cwd(), `./dist/${options.version}/assets`)
    }
    for (let key in options) {
        if (options[key] instanceof Object && !(options[key] instanceof Array)) {
            settings[key] = Object.assign(settings[key], options[key] || {})
        } else {
            settings[key] = options[key];
        }
    }
}

module.exports = {
    get,
    set,
    getDefinePluginParam,
    getPublicPageFullname
};