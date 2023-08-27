const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-source-map'
    //...其它的一些配置
});
