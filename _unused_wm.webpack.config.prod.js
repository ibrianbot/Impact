const webpack = require('webpack')


module.exports = {
  entry: './weltmeister/index.js',
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
  externals: {
    impact: {
      commonjs: 'impact',
      commonjs2: 'impact',
      amd: 'impact',
    },
  },
}