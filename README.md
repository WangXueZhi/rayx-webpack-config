# rayx-webpack-config
webpack配置模块，内部对webpack做了大部分配置支持，开发者只需要做基本配置即可，配合rayx工具生成的项目脚手架使用，接起来特别快

### 配置说明
1. 参考webpack.config.js文件即可。
2. env 必须有，用来判断打包的环境。
3. 如果没有配置version，资源默认构建到/dist/assets/目录下，如果有，会构建到/dist/版本号/assets/目录下

#### [rayx](https://github.com/WangXueZhi/rayx)
