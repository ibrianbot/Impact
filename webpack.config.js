module.exports = {
  entry: "./index.js",
  mode: "development",
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