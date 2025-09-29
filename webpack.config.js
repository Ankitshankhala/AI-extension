const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src/background/index.ts'),
    content: path.resolve(__dirname, 'src/content/index.ts'),
    popup: path.resolve(__dirname, 'src/ui/popup/index.tsx'),
    sidepanel: path.resolve(__dirname, 'src/ui/sidepanel/index.tsx'),
    options: path.resolve(__dirname, 'src/ui/options/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].[contenthash].js',
    publicPath: ''
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@styles': path.resolve(__dirname, 'src/styles')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [/node_modules/, /tests/]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: [require('tailwindcss'), require('autoprefixer')] } }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.', globOptions: { ignore: ['**/*.html'] } },
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
      scriptLoading: 'defer'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/sidepanel.html'),
      filename: 'sidepanel.html',
      chunks: ['sidepanel'],
      scriptLoading: 'defer'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/options.html'),
      filename: 'options.html',
      chunks: ['options'],
      scriptLoading: 'defer'
    })
  ],
  optimization: {
    splitChunks: { chunks: 'all' }
  },
  devtool: 'inline-source-map',
  performance: { hints: false },
  stats: 'minimal',
  experiments: {
    topLevelAwait: true
  }
};

