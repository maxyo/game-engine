const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/entries/server',
  target: "node",
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
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      msgpack$: path.resolve(__dirname, 'node_modules/msgpack-lite/index.js'),
    }
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
