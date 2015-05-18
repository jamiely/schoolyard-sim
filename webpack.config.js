var webpack = require('webpack');

module.exports = {
  context: __dirname + "/src/scripts/",
  entry: './main.js',
  devtool: 'source-map',
  output: {
    path: __dirname + "/app/js",
    filename: "schoolyard-simulation.js",
    publicPath: 'http://localhost:9090/js/'
  },
  loaders: [
    //{ test: /\.es6$/, exclude: /node_modules/, loader: 'babel-loader'}
  ],
  plugins: [
    //new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
    new webpack.HotModuleReplacementPlugin()
  ]
};


