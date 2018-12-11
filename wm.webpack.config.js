const express = require('express')

module.exports = {
  entry: './wm.index.js',
  mode: 'development',
  devServer: {
    contentBase: __dirname + '/weltmeister',
    before: (app) => {
      app.use('/media', express.static('./media'))
    },
  },
  output: {
    path: __dirname + '/wm/dist',
    filename: 'bundle.js',
    publicPath: '/wm/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
}