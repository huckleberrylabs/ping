const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");

const WIDGET_ID = process.env.DEMO_WIDGET_ID;

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
    new HtmlWebpackPlugin({
      title: "Text, By Huckleberry Demo",
      widget_id: WIDGET_ID,
      template: "index.html",
    }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
    }),
  ],
};
