/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
//  const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  // mode: 'development',
  entry: {},
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: [".webpack.js", ".web.js", ".tsx", ".ts", ".js"]
  },

  externals: [{
    'jquery': '$',
    'echarts': 'echarts',
    'toastr' : 'toastr',
  },
    "bootstrap",
  ],
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   loaders: ExtractTextPlugin.extract("style-loader", "css-loader"),
      // },
      // { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   query: {
      //     presets: [
      //       "es2015"
      //     ]
      //   }
      // },
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
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ toastr: 'toastr' }),
    // new CheckerPlugin()
  ],
};