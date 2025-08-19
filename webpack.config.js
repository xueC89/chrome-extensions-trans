const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      popup: './src/popup/index.tsx',
      content: './src/content/index.tsx',
      background: './src/background/index.ts',
      // options: './src/options/index.tsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        // SCSS Modules: *.module.scss / *.module.sass
        {
          test: /\.module\.(scss|sass)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProduction ? '[hash:base64:6]' : '[path][name]__[local]--[hash:base64:5]'
                },
                importLoaders: 1
              }
            },
            'sass-loader'
          ]
        },
        // Global SCSS
        {
          test: /\.(scss|sass)$/,
          exclude: /\.module\.(scss|sass)$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss', '.sass'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/popup/popup.html',
        filename: 'popup.html',
        chunks: ['popup']
      }),
      // new HtmlWebpackPlugin({
      //   template: './src/options/options.html',
      //   filename: 'options.html',
      //   chunks: ['options']
      // }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './public', to: './' }
        ]
      }),
    ],
    devtool: isProduction ? false : 'cheap-module-source-map',
    optimization: {
      minimize: isProduction ? undefined : true,
      splitChunks: {
        chunks: (chunk) => {
          // content script 不参与代码分割，保持独立
          if (chunk.name === 'content') {
            return false;
          }
          return 'all';
        },
        cacheGroups: {
          // 其他代码可以分割
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: (chunk) => {
              // vendor 不包含 content
              return chunk.name !== 'content';
            }
          }
        }
      }
    }
  };
}; 