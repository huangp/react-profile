var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './index.js',
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'react-hot!jsx-loader?harmony!babel'
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
