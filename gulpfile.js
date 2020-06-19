/* eslint-disable */
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const argv = require('yargs').argv;
const {Source} = require('./config.js');
var webpackConfig =  require('./webpack.config.js');
var path = require('path');
const argusJsFolder = '../src/main/webapp/';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const CheckerPlugin = require('awesome-typescript-loader');
/**
 * 引用yargs，自定义命令
 * 编译test文件 = gulp --i test
 * gulp --i test -p 编译且开启压缩代码模式（建议线上开启代码压缩，显著提高速度）
 * 
 * @file gulp配置文件
 */

/**
 * gulp 任务
 */
gulp.task('default', () => {
  let dt = Source[argv.i];
  let ds = argv.p;
  if (dt) {
    build(dt, ds);
  } else {
    console.error('invalid command.');
  }
});

/**
 * 串行编译所有文件
 */
gulp.task('all', () => {
  let ds = argv.s;
  // Source.
  for (let Ob in Source) {
    build(Source[Ob], ds);
  }
});

gulp.task('applyList', () => {
  let entryJs = `./src/entry/applyList.tsx`;
  let outputJs = `js/applyList.js`;
  let srcHtml = path.resolve(__dirname, `html/applyList.template.html`);
  let destHtml = `page/applyList.html`;
  runWebpack(entryJs, outputJs, srcHtml, destHtml);
});

gulp.task('test', () => {
  let entryJs = `./src/entry/test.tsx`;
  let outputJs = `js/test.min.js`;
  let srcHtml = path.resolve(__dirname, `html/test.template.html`);
  let destHtml = `page/test.html`;
  runWebpack(entryJs, outputJs, srcHtml, destHtml);
});
/**
 * build method
 * @param {Object} conf 编译配置
 * @param {string} pro 编译方式（是否代码压缩）
 * @param {string} conf.src 源文件名称
 * @param {string} conf.out 生成文件名称
 */
function build(conf, pro) {
  let entryJs = `./src/entry/${conf.src}.tsx`;
  let outputJs = `js/${conf.jsout}.min.js`;
  let srcHtml = path.resolve(__dirname, `html/${conf.src}.template.html`);
  let destHtml = `./${conf.htmlout}.html`;
  if (pro) {
    runWebpackPro(entryJs, outputJs, srcHtml, destHtml);
  } else {
    runWebpack(entryJs, outputJs, srcHtml, destHtml);
  }
}

/**
 * 引用webpack,打包js和html（压缩代码）
 *
 * @param {string} entry 源js路径
 * @param {string} output 输出js路径
 * @param {string} src 源HTML路径
 * @param {string} dest 输出HTML路径
 */
function runWebpackPro(entry, output, src, dest) {
  let myConfig = Object.assign({}, webpackConfig, {
    entry: entry,
    output: {
      // path: argusJsFolder,
      path: path.resolve(__dirname, argusJsFolder),
      filename: output
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          loaders: ['ts-loader'],
          exclude: /(node_modules|bower_components)/
        },
          {
              test: /\.css$/,
              loaders: [
                  'style-loader',
                  'css-loader'
              ]
          }
      //   {    
      //   test: /\.(js|jsx)$/,
      //   loader: 'babel-loader',
      //   exclude: /(node_modules|bower_components)/,
      //   options: {
      //     presets: [
      //       "es2015"
      //     ]
      //   }
      // },
      ],
    },
    plugins: [
      new UglifyJSPlugin(),
      new webpack.ProvidePlugin({
        toastr: 'toastr'
      }),
      // new CheckerPlugin(),
      new HtmlWebpackPlugin({
        filename: dest,
        template: src,
        hash: true
      }),

      // 代码压缩
      // new webpack.optimize.UglifyJsPlugin({
      //   output: {
      //     beautify: false,//最紧凑的输出
      //     comments: false,  // 移除注释
      //   },
      //   // beautify: false,//最紧凑的输出
      //   // comments: false,  // 移除注释
      //   compress: {
      //     warnings: false,//在UglifyJs删除没有用到的代码时不输出警告
      //     drop_console: true,//删除所有console语句
      //     // collapse_vars: true,//内嵌定义了但是只用到一次的变量
      //     // reduce_vars: true,// 提取出出现多次但是没有定义成变量去引用的静态值
      //   }
      // })
    ],
  });
  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack:build", err);
    } else {
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
    }
  });
}

/**
 * 引用webpack,打包js和html
 *
 * @param {string} entry 源js路径
 * @param {string} output 输出js路径
 * @param {string} src 源HTML路径
 * @param {string} dest 输出HTML路径
 */
function runWebpack(entry, output, src, dest) {
  let myConfig = Object.assign({}, webpackConfig, {
    entry: entry,
    output: {
      // path: argusJsFolder,
      path: path.resolve(__dirname, argusJsFolder),
      filename: output
    },
    plugins: [
      new webpack.ProvidePlugin({
        toastr: 'toastr'
      }),
      // new CheckerPlugin(),
      new HtmlWebpackPlugin({
        filename: dest,
        template: src,
        hash: true
      })
    ]
  });
  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack:build", err);
    } else {
      gutil.log("[webpack:build]", stats.toString({
        colors: true
      }));
    }
  });
}
