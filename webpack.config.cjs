const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'offer.js',
    clean: true,
    iife: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false,
  },
  devtool: false,
  devServer: {
    host: '0.0.0.0',
    port: 3002,
    hot: false,
    liveReload: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  performance: {
    hints: false,
  },
}
