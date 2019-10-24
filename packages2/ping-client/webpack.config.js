const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require("webpack-obfuscator");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

function getEnv() {
  if (process.env.NODE_ENV === "development") {
    const dotenv = require("dotenv").config();
    if (dotenv.error) {
      throw new Error(".env file couldn't be parsed");
    }
    process.env = dotenv.parsed;
  }
  return new webpack.EnvironmentPlugin(["NODE_ENV", "API_URL"]);
}

const options = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
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
  plugins: [new ForkTsCheckerWebpackPlugin(), getEnv()],
};

// development, staging, testing
if (process.env.NODE_ENV !== "production") {
  options.plugins.push(
    new HtmlWebpackPlugin({
      title: process.env.NODE_ENV,
      api_url: process.env.API_URL,
      widget_id: process.env.WIDGET_ID,
      template: "index.html",
    })
  );
}

if (process.env.NODE_ENV === "production") {
  options.plugins.push(
    new JavaScriptObfuscator({
      rotateUnicodeArray: true,
    })
  );
}

module.exports = options;
