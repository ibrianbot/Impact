const express = require("express")

module.exports = {
  entry: "./index.js",
  mode: "development",
  devServer: {
    contentBase: __dirname + "/game",
    before: (app, server) => {
      app.use("/media", express.static('./media'));
      app.use("/lib", express.static('./lib'));
    }
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
}