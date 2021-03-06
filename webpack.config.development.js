const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const embedFileSize = 50000;

const srcPath = path.join(__dirname, 'src');

module.exports = {
  context: srcPath,
  entry: {
    hotMiddleware: 'webpack-hot-middleware/client',
    client: path.join(srcPath, 'js', 'client.jsx'),
    serviceWorker: path.join(srcPath, 'serviceWorker', 'index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'css-loader' },
      {
        test: /\.svg/,
        loader: `url?limit=${embedFileSize}&mimetype=image/svg+xml`,
      },
      {
        test: /\.png$/,
        loader: `url?limit=${embedFileSize}&mimetype=image/png`,
      },
      {
        test: /\.jpg/,
        loader: `url?limit=${embedFileSize}&mimetype=image/jpeg`,
      },
      {
        test: /\.gif/,
        loader: `url?limit=${embedFileSize}&mimetype=image/gif`,
      },
      {
        test: /\.(otf|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: `url?limit=${embedFileSize}`,
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(process.env.NODE_ENV),
      __webpack_hash__: null,
    }),
    new CopyWebpackPlugin([
      { from: 'manifest.json' },
      { from: 'img' },
    ]),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      inject: true,
      filename: 'index.html',
      hash: false,
      excludeChunks: ['serviceWorker', 'hotMiddleware'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
};
