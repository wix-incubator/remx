const path = require('path');

module.exports = {
  entry: './src',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'remx',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
  },
};
