module.exports = {
  entry: "index.js",
  output: {
    filename: "./build/bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  loaders: [{ test: /\.tsx?$/, loader: "awesome-typescript-loader" }],
  preLoaders: [{ test: /\.js$/, loader: "source-map-loader" }],
};
