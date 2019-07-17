const path = require('path');

module.exports = {
  entry: {
    app: './src_frontend/index_standalone.tsx'
  },
  devtool : 'source-map',
  mode: 'development',
  output: {
    filename: 'main_standalone.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        include: path.resolve(__dirname, 'src_frontend'),
        use: {
          loader: 'babel-loader',
        },
      },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  plugins: [
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
  }
};
