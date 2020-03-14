const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/entries/frontend',
  target: "web",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      msgpack$: path.resolve(__dirname, 'node_modules/msgpack-js/msgpack.js'),
    }
  },
  output: {
    filename: 'frontend.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
