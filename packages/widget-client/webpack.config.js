const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "text.min.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
    }),
    new HtmlWebpackPlugin({
      title: "Ping (Staging)",
      widget_id: process.env.WIDGET_ID,
      node_env: process.env.NODE_ENV,
      template: "index.html",
    }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
    }),
  ],
};
