const path = require(`path`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require(`webpack-bundle-analyzer`);
const webpack = require(`webpack`);

const isDevelopment = process.env.NODE_ENV !== "production";

const config = {
  resolve: { extensions: [`.js`, `.jsx`] },
  mode: isDevelopment ? `development` : `production`,
  devtool: isDevelopment ? `eval` : `hidden-source-map`,
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor",
          enforce: true,
        },
      },
    },
  },
  entry: { main: `./src/index` },
  module: {
    rules: [
      {
        test: /\.(c|sc|sa)ss$/,
        use: [
          !isDevelopment ? MiniCssExtractPlugin.loader : `style-loader`,
          `css-loader`,
          `sass-loader`,
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
          options: {
            presets: [`@babel/preset-env`, `@babel/preset-react`],
            env: {
              development: {
                plugins: [
                  `@babel/plugin-proposal-class-properties`,
                  `react-refresh/babel`,
                ],
              },
              production: {
                plugins: [`@babel/plugin-proposal-class-properties`],
              },
            },
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
  // dev, prod 공통 플러그인
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: isDevelopment ? `development` : `production`,
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: `./public/index.html`,
    }),
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

// dev모드 플러그인 추가
if (isDevelopment && config.plugins) {
  config.plugins.push(new ReactRefreshWebpackPlugin());
}

// prod모드 플러그인 추가
if (!isDevelopment && config.plugins) {
  /* config.plugins.push(
    new BundleAnalyzerPlugin({ analyzerMode: `server`, openAnalyzer: true })
  ); */
  config.plugins.push(new MiniCssExtractPlugin({ filename: `css/styles.css` }));
}

module.exports = config;
