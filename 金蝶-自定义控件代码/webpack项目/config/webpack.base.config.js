const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  //帮助我们引入打包文件中带有 hash的js文件，总不能让我们每次都人工去修改 html
const { CleanWebpackPlugin } = require('clean-webpack-plugin');  // 每次打包前，先清空一下dist 目录
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 作用就是将单个文件或整个目录复制到构建目录。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');  //编译时，将CSS文件单独打包成文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");  //将抽离出来的css文件进行压缩

const data = require('../data.json');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    // 在配置文件中，需要手动指定 入口 和 出口   在任何模块文件内部，可以使用__dirname变量获取当前模块文件所在目录的完整绝对路径。
    // entry 的值可以是一个字符串，一个数组或是一个对象。为数组时，表示有“多个主入口”，想要多个依赖文件一起注入时，会这样配置。
    entry: path.join(__dirname, '../src/main.js'), // 入口，表示，要使用 webpack 打包哪个文件

    output: { // 输出文件相关的配置
        path: path.join(__dirname, '../dist'), // 指定 打包好的文件，输出到哪个目录中去
        filename: 'js/[name].[hash].js', // 这是指定 输出的文件的名称
        assetModuleFilename: 'images/[name].[hash][ext][query]',  //指定静态资源（图片，文件）的输出目录
        publicPath: '' //路由路径，通常是CDN地址（例如，你最终编译出来的代码部署在 CDN 上，资源的地址为: 'https://AAA/BBB/YourProject/XXX'，那么可以将生产的 publicPath 配置为: //AAA/BBB/。）
    },

    resolve: {
        // 如果配置了 resolve.enforceExtension 为 true，那么导入语句不能缺省文件后缀
        enforceExtension: false
    },

    devServer: {
        port: '3000', //默认是8080
        compress: false, //是否启用 gzip 压缩
        static: path.join(__dirname, '../src'), // boolean | string | array | object, static file location
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // 启用热更新。每当修改一下代码，则会立即全新生一个bundle.js，这样的话就会比较耗时；那么添加hot热更新参数，则可以以打补丁的方式来更新
        https: false, // true for self-signed, object for cert authority
        open: false, //如果希望自动打开浏览器，那么则可以设置参数--open为true
    },

    module: {
        //一些第三方模块没有AMD/CommonJS规范版本，可以使用 noParse 来标识这个模块，这样 Webpack 会引入这些模块，但是不进行转化和解析，从而提升 Webpack 的构建性能
        noParse: /jquery|lodash/,

        // rules是个数组，内部是所有loader配置（loader：模块转换器，用于把模块原内容按照需求转换成新内容）
        rules: [
            // 处理 html 中的本地图片路径问题：
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },

            //  配置处理 .css/.sass/.less 文件的第三方loader 规则
            {
                test: /\.(sa|le|c)ss$/,

                // style-loader 动态创建 style 标签，将 css 插入到 head 中.
                // css-loader 负责处理 @import 等语句。
                // postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀 —— 2020了，应该没人去自己徒手去写浏览器前缀了吧
                // less-loader 负责处理编译 .less 文件,将其转为 css
                // 上面 loader 的执行顺序为: less-loader ---> postcss-loader ---> css-loader ---> style-loader
                use: [
                    // style-loader 用 MiniCssExtractPlugin.loader 替换（因为css需要单独编译成文件）
                    // todo 这个loader必须放第一个，先执行，否则编译不通过：
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [require('autoprefixer')()]
                                ]
                            }
                        }
                    }
                ]
            },

            // webpack5 新增 Asset Modules 资源模块。资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。
            // 用于处理css中引入的图片路径问题
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,  // 将图片大小小于10kb的，转为base64格式，就不会再生成图片在dist目录下
                    }
                },
            },

            //功能：使用babel-loader进行编译（es6编译成es5）
            {
                test: /\.jsx?$/,  // 目标文件（已 .js 或者 .jsx 结尾的文件）

                // loader的配置：（1）为字符串；（2）数组；（3）对象
                use: 'babel-loader',  // 字符串，就是简单的loader名称

                exclude: /node_modules/ //排除 node_modules 目录
            }
        ],
    },

    //数组 放着所有的webpack插件
    plugins: [
        // 创建一个 在内存中 生成 HTML  页面的插件
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../index.html'), // 指定 模板页面，将来会根据指定的页面路径，去生成内存中的 页面
            filename: 'index.html', //打包后的文件名 todo 这里有个坑！文件名必须用index.html，否则跑 npx webpack-dev-server ，不会看到效果（即不会去加载bundle.js）
            minify: {
                removeAttributeQuotes: !isDev, //是否删除属性的双引号
                collapseWhitespace: !isDev, //是否折叠空白
            },
            hash: true, //是否加上hash，默认是 false
        }),

        // 每次打包前，先清空一下dist 目录
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**']  //不删除dll目录下的文件
        }),

        // 作用就是将单个文件或整个目录复制到构建目录。
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/',  // 路径从根路径开始
                    to: path.resolve(__dirname, '../dist/public'),
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["config.js"], // todo 没生效？
                    },
                },
                //还可以继续配置其它要拷贝的文件
            ]
        }),

        //编译时，将CSS文件单独打包成文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
        })
    ],

    //优化
    optimization: {
        //1.压缩
        minimizer: [
            `...`,  //将js文件进行压缩（在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`））
            new CssMinimizerPlugin(), //将抽离出来的css文件进行压缩
        ],

        // minimize: true  //如果还想在开发环境下启用 CSS 压缩，请将 optimization.minimize 设置为 true

        // 将开发依赖文件剥离出来成单独文件：
        splitChunks: {
            // chunks: "all",
            cacheGroups: {
                vendor: {
                    //第三方依赖
                    priority: 1, //设置优先级，首先抽离第三方模块
                    name: 'vendor',
                    // filename: 'js/[name].[hash].js',
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 1 //最少引入了1次
                },
                //缓存组
                common: {
                    //公共模块
                    chunks: 'initial',
                    name: 'common',
                    minSize: 100, //大小超过100个字节
                    minChunks: 3  //最少引入了3次
                }
            },
        },

        // 会为每个入口添加一个只含有 runtime 的额外 chunk
        // 作用是将包含 chunk 映射关系的列表从 main.js 中抽离出来，在配置了 splitChunk 时，记得配置 runtimeChunk
        runtimeChunk: {
            name: 'manifest'
        }
    },
};
