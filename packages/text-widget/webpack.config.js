const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

console.log("HERE HERE LOOK AT ME IM SPECIAL: ", process.env.NODE_ENV);

const WIDGET_ID = process.env.WIDGET_ID;
const BROWSER_ENV = process.env.NODE_ENV;

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
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new HtmlWebpackPlugin({
      title: "Text, By Huckleberry (Staging)",
      widget_id: WIDGET_ID,
      env: BROWSER_ENV,
      template: "index.html",
    }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
    }),
  ],
};
