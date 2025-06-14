import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import { RsdoctorWebpackPlugin } from "@rsdoctor/webpack-plugin";
import { EsbuildPlugin } from "esbuild-loader";
import WebpackBar from "webpackbar";

const devMode = process.env.NODE_ENV !== "production";
const __dirname = import.meta.dirname;

export default {
  stats: {
    assets: false,
    modules: false,
    warnings: false,
    errors: true,
  },
  mode: devMode ? "development" : "production",
  entry: {
    index: path.join(__dirname, "src", "client", "index.ts"),
    // "blog-edit": path.join(__dirname, "src", "client", "blog-edit.ts"),
    // noise: path.join(__dirname, "src", "client", "noise.tsx"),
  },
  watch: true,
  watchOptions: {
    ignored: /(node_modules|src\/dist)/,
  },
  output: {
    path: path.join(__dirname, "src", "dist"),
    publicPath: "auto",
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: "esbuild-loader",
        options: {
          // transpileOnly: true
          // minify:true,
          // minifyWhitespace: true,
          // minifyIdentifiers: true,
          // minifySyntax: true,

          sourcemap: devMode,
          treeShaking: !devMode,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.[s]?[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              sourceMap: devMode,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: devMode,
            },
          },
          // Compiles Sass to CSS
          // {
          //   loader: "sass-loader",
          //   options: {
          //     sourceMap: devMode
          //   }
          // },
        ],
      },
    ],
  },
  optimization: {
    minimize: !devMode,
    minimizer: [
      new EsbuildPlugin({
        minify: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,
      }),
    ],
  },
  resolve: {
    extensions: [
      ".json",
      ".ts",
      ".tsx",
      ".css",
      ".sass",
      ".scss",
      ".js",
      ".jsx",
    ],
  },
  devtool: devMode ? "eval" : false,
  devServer: {
    contentBase: path.join(__dirname, "src", "/dist/"),
    inline: true,
    host: "localhost",
    port: 8080,
  },
  plugins: [
    new WebpackBar(),
    ...(devMode ? [] : [new MiniCssExtractPlugin()]),
    ...(devMode ? [new RsdoctorWebpackPlugin({})] : []),
  ],
  externals: {},
  cache: {
    type: devMode ? "memory" : "filesystem",
    ...(devMode ? {} : {}),
  },
};
