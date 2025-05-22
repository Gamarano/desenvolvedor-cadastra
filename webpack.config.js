const path = require("path");
const webpack = require("webpack");

module.exports = (paths) => ({
  entry: {
    main: path.resolve(__dirname, paths.scripts.src),
  },
  output: {
    path: path.resolve(__dirname, paths.dest),
    filename: "bundle.js",
  },
  mode: "development",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/ts'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, 
          }
        },
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
});