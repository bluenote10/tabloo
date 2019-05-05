const path = require('path');

module.exports = {
  entry: './src_frontend/main.ts',
  devtool : 'source-map',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      //{test: /\.ts$/, use: 'ts-loader'},
      {test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
	optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
};