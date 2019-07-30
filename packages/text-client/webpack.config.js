const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const APP_ID = process.env.TEXT_TEST_APP_ID;

if (!APP_ID) {
  throw new Error("App ID must be provided via TEXT_TEST_APP_ID env var");
}

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
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Text, By Huckleberry Demo",
      app_id: APP_ID,
      template: "index.html",
    }),
  ],
};
