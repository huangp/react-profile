var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  resolve: {
    extensions: ['', '.js', '.json']
  },
  node: {
    __dirname: true
  }
};
