var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
    './index.js',
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    pathinfo: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  node: {
    __dirname: true
  }
};
