const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
require("@babel/register");

module.exports = (env, options) => {
  //Generalmente, cuando lo llamamos desde Gulp, definimos modo production.
  if(!options) options = [];
  if(typeof options.mode === 'undefined') options.mode = 'production';

  let webpack_config = {
    entry: './js/main.js',
    resolve: {
      extensions: ['.js', '.es6']
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
    },

    module: {
      rules: [
        {
          test: /\.es6$/,
          use: ['babel-loader'],
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
        {
          test: /\.(sass|css)/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        _WPCONST_ENV_: JSON.stringify(options.mode === 'development' ? 'DEVELOPMENT' : 'PRODUCTION')
      }),
      new htmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        hash: true
      }),
      new copyWebpackPlugin([
        {
          from: './img',
          to: 'img'
        },
        {
          from: './favicon.ico',
          to: 'favicon.ico'
        }
      ])
    ],

    devtool: 'source-map',

    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000
    },
    // watch: true
  };

  if(options.mode === 'development'){
    console.log('development');
    webpack_config['watch'] = true;
  }
  // Include additional files based on environment
  // if(options.mode === 'development'){
  //   webpack_config.entry = ['./js_es6/custom_env/dev.es6', webpack_config.entry];
  // }


  return webpack_config;
};
