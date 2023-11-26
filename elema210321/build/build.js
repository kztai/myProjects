'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')   // 给长时间运行的异步任务的一个提示（run build 时，终端打印的信息是的加载动效）
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')  //在终端打印信息显示颜色的插件
const webpack = require('webpack')

const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

// 会将src下的static文件夹下的文件，原封不动的拷贝到dist下的static文件夹下：
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()  //打包结束后关闭spinner
    if (err) throw err
    // 输入打包结果信息：
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: 打包后的文件需要通过HTTP server 来启动，不能直接通过打开index.html来启动。'
    ))
  })
})
