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
    extensions: [ '.ts', '.tsx', '.js' ],
    alias: {
      // Currently it is not possible to import echarts from the "lib" folder
      // and set the language: https://github.com/apache/incubator-echarts/issues/7451
      // As a temporary work-around we import it from the "dist" folder instead,
      // which has pre-bundled English versions.
      echarts$: path.resolve(__dirname, 'node_modules/echarts/dist/echarts-en.min.js'),
    },
  },
  plugins: [
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
  }
};
