const webpack = require('webpack');
const path = require('path');

const src = path.join(__dirname, '../..', 'src');

module.exports = {
  devtool: 'source-map',

  entry: {
    'main': [
      'babel-polyfill',
      path.join(__dirname, 'src/main.js'),
    ],
    'ghpage': [
      'babel-polyfill',
      path.join(__dirname, 'src/gh.js'),
    ],
  },

  output: {
    path: path.join(__dirname, 'js'),
    publicPath: '/js/',
    filename: '[name].js',
  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],

  module: {
    loaders: [{
      test: /\.js(x)?$/,
      include: [src, path.join(__dirname, './src'),
        path.join(__dirname, '../src'), path.join(__dirname, '../lib')],
      loaders: ['babel'],
    },
    { test: /\.css$/, loader: 'style-loader!css-loader' },
    { test: /\.less$/, loader: 'style-loader!css-loader!less' },
    { test: /\.json$/, loaders: ['json'] },
    ],
  },

  resolve: {
    alias: {
      'redux-collector$': path.join(src, 'redux-collector')
    },
  },

  devServer: {
    publicPath: '/js/',
    historyApiFallback: true,
    quiet: true,
  },
  node: {
    console: true
  }
};
