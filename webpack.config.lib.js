const webpack = require('webpack')

module.exports = {
  entry: {
    im: './lib/index.js',
  },
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist/impact',
    filename: 'impact.bundle.js',
    library: 'impact',
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