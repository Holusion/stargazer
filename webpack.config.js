const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    watch: true,
    entry: "./src/index.js",
    target: "electron-renderer",
    mode: "development",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader"
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name]-[hash:8].[ext]",
                publicPath: "../dist"
              }
            }
          ]
        }
      ]
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    output: {
      path: path.resolve(__dirname, "dist/"),
      publicPath: "/dist/",
      filename: "bundle.js"
    },
    plugins: [new CleanWebpackPlugin(), new webpack.HotModuleReplacementPlugin()]
  };