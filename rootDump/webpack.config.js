const express = require('express')

module.exports = {
  entry: {
    game: './index.js',
    wm: './start.weltmeister.js',
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname + '/game',
    before: (app) => {
      app.use('/media', express.static('./media'))
    },
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name]bundle.js',
    publicPath: '/dist/',
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
  watchOptions: {
    ignored: [
      /game\/levels\/.*/, 
      /node_modules/,
    ],
  },
}