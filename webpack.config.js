const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  resolve: { extensions: [`.js`, `.jsx`] },
  mode: isDevelopment ? `development` : `production`,
  devtool: isDevelopment ? `eval` : `hidden-source-map`,
  entry: { main: `./src/index` },
  module: {
    rules: [
      {
        test: /\.(c|sc|sa)ss$/,
        use: [MiniCssExtractPlugin.loader, `css-loader`, `sass-loader`],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
          options: {
            presets: [`@babel/preset-env`, `@babel/preset-react`],
            plugins: [
              `@babel/plugin-proposal-class-properties`,
              `react-refresh/babel`,
            ],
          },
        },
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            name: "assets/[name].[ext]?[hash]",
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `./public/index.html`,
    }),
    new MiniCssExtractPlugin({ filename: `css/styles.css` }),
  ],
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `js/[name].js`,
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, `public`),
    },
    hot: true,
    port: 3000,
  },
};
