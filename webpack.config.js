"use strict";
const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");

module.exports = {
  watch: true,
  mode: "production",
  entry: ["./js/index.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./js/")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
};
