const webpack = require('webpack')


module.exports = {
  entry: './wm.index.js',
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist/weltmeister',
    filename: 'weltmeister.bundle.js',
    library: 'weltmeister',
    libraryTarget: 'umd',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
}