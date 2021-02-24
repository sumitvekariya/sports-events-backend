const webpack = require('webpack');
const StartServerWebpackPlugin = require("start-server-webpack-plugin");
const webpackNodeExternals = require("webpack-node-externals");


module.exports = function(options) {
    return {
      ...options,
      entry: ['webpack/hot/poll?100', options.entry],
      watch: true,
      externals: [
        webpackNodeExternals({
          allowlist: ['webpack/hot/poll?100'],
        }),
      ],
      plugins: [
        ...options.plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
        new StartServerWebpackPlugin({ name: options.output.filename }),
      ],
    };
};