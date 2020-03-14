const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/entries/player',
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
    filename: 'player.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
