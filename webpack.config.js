const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";
const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'client', 'index'),
  watch: true,
  output: {
    path: path.join(__dirname, 'src', 'dist'),
    publicPath: './src/dist/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'babel-loader',
      options: {
        presets: [
          ["@babel/env", {
            "targets": {
              "browsers": "last 2 chrome versions"
            }
          }]
        ]
      }
    },
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        devMode ? "style-loader" : MiniCssExtractPlugin.loader,
        // Translates CSS into CommonJS
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader",
      ],
    }]
  },
  resolve: {
    extensions: ['.json', '.ts', '.tsxw', '.css', '.sass', '.scss', '.js', '.jsx']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'src', '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
  },
  plugins: [].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
};