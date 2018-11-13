const express = require("express")

module.exports = {
  entry: "./wm.index.js",
  mode: "development",
  devServer: {
    contentBase: __dirname + "/weltmeister",
    before: (app, server) => {
      app.use("/media", express.static('./media'));
      app.use("/weltmeister", express.static('./weltmeister'));
      app.use("/game", express.static('./game'));
    }
  },
  output: {
    path: __dirname + "/wm/dist",
    filename: "bundle.js",
    publicPath: "/wm/dist/"
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