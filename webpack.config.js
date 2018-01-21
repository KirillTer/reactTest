const webpack = require('webpack');
const colors = require('colors');
const defaultEnv = require('dotenv').config('.env');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
const JavaScriptObfuscator = require('webpack-obfuscator');
const del = require('del');

const defaultEnvLoaded = !!defaultEnv;
const env = (process.env.NODE_ENV).replace(/[ ]/g, '');
const envProduction = env === 'production';
const envDevelopment = env === 'development';

let stringedEnv = '';
const stringedEnvKeys = Object.keys(defaultEnv.parsed);
for (let i = 0; i < stringedEnvKeys.length; i += 1) {
  const key = stringedEnvKeys[i];
  stringedEnv += `${key}: ${defaultEnv.parsed[key].yellow};
`;
}

const hr = `Match for "development" mode: *${envDevelopment}`.replace(/[a-z": ]/gi, '*');
console.log(`
${colors.black.underline('! WEBPACK BUILDING PROCESS! ').bgWhite}

Default ENV Variables Imported: ${defaultEnvLoaded ? 'true'.green : 'false'.red};
Current Default ENV Variables:
${stringedEnv}
${hr}
Current NODE_ENV mode: ${env.yellow};
${hr}
Check for regex issues:
Match for "production" mode: ${envProduction ? 'true'.green : 'false'.red};
Match for "development" mode: ${envDevelopment ? 'true'.green : 'false'.red};
${hr}
`);

const namespace = {
  jsBundle: 'bundle.js',
  cssBundle: 'styles.css',
};

// remove all files from "dist" folder
del('./dist/**');
del('./npm-debug.log');

// webpack config object
const config = {
  output: {
    path: `${__dirname}/dist`,
    filename: namespace.jsBundle,
  },
  entry: './src/main.js',
  module: {
    loaders: [
      // Controller Scripts
      { test: /\.js$/, use: [{ loader: 'babel-loader', options: { presets: ['es2015'] } }] },
      { test: /test\.js$/, loader: 'mocha-loader' },
      { test: /\.jsx$/, use: [{ loader: 'babel-loader', options: { presets: ['es2015', 'react', 'stage-2'] } }] },
      { test: /\.ts$/, loader: 'awesome-typescript-loader', query: { tsconfig: './tsconfig.json' } },
      { test: /\.coffee$/, loader: 'coffeescript-loader' },

      // Model Data
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.yaml$/, use: [ { loader: 'json-loader' }, { loader: 'yaml-loader' }] },

      // View Template Engines
      { test: /\.html$/, use: { loader: 'html-loader', options: { attrs: [':data-src'] } } },
      { test: /\.ejs$/, loader: 'ejs-loader' },
      { test: /\.jade$/, loader: 'jade-loader' },

      // View CSS Engines
      { test: /\.css$/, use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: [{ loader: 'css-loader' }, { loader: 'sass-loader' }],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: [{ loader: 'css-loader' }, { loader: 'stylus-loader' }],
          fallback: 'style-loader',
        }),
      },

      // View Image Engines
      { test: /\.(jpe?g|png|gif|svg)$/i, use: ['file-loader?name=img/[name].[ext]', 'img-loader'] },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.jade',
    }),
    new CheckerPlugin(),
    new ExtractTextPlugin(namespace.cssBundle),
    new webpack.EnvironmentPlugin(stringedEnvKeys),
  ],
  devtool: (envDevelopment ? 'source-map' : false),
  devServer: {
    compress: false,
    port: process.env.PORT,
    historyApiFallback: true,
  },
};
if (envProduction) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.plugins.push(new JavaScriptObfuscator());
  // config.plugins.push(new PrepackWebpackPlugin({}));
}

module.exports = config;
