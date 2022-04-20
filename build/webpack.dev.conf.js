'use strict'
const utils = require('./utils')
const { multipleScopeVars } = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')


const UnpluginVueComponentsWebpack = require("unplugin-vue-components/webpack");
const { ElementUiResolver } = require("unplugin-vue-components/resolvers");
const ThemeCssExtractWebpackPlugin = require("@zougt/theme-css-extract-webpack-plugin");

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {

    rules: [...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true }), {
      test: /setCustomTheme.js$/,
      enforce: 'pre',
      use: [
        {
          loader: '@zougt/theme-css-extract-webpack-plugin/dist/hot-loader/index.js'
        }
      ]
    }]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // 添加vue组件库按需
    UnpluginVueComponentsWebpack({
      resolvers: [ElementUiResolver({ importStyle: "sass" })],
    }),
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new ThemeCssExtractWebpackPlugin({
      // 以下是任意主题模式的参数 arbitraryMode:true 有效
      arbitraryMode: true,
      // 默认主题色，与"src/theme/mauve-vars.scss"的@--color-primary主题色相同
      defaultPrimaryColor: "#512da7",
      hueDiffControls: {
        low: 0,
        high: 0,
      },
      multipleScopeVars,
      // 【注意】includeStyleWithColors作用： css中不是由主题色变量生成的颜色，也让它抽取到主题css内，可以提高权重
      includeStyleWithColors: [
        {
          color: "#ffffff",
          // 排除掉样式属性，这里将非背景的白色提升权重
          excludeCssProps: ["background", "background-color"],
          // 此类颜色的是否跟随主题色梯度变化，默认false
          // inGradient: true,
        },
        {
          // element-ui 的非primary颜色，受到了primary的权重问题，这里可以让他们提升权重
          color: [
            // success background-color
            "#67C23A",
            // info background-color
            "#909399",
            // warning background-color
            "#E6A23C",
            // danger background-color
            "#F56C6C",
            // success hover  background-color
            "#85ce61",
            // info hover  background-color
            "#a6a9ad",
            // warning hover  background-color
            "#ebb563",
            // danger hover  background-color
            "#f78989",
          ],
        },
      ],
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
