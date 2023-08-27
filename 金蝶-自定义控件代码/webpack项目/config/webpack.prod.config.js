const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;  // 包大小分析插件

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        //...
        new BundleAnalyzerPlugin(),
    ]
});
