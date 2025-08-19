const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackZipPlugin = require('./scripts/webpack-zip-plugin');

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
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
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
      // 仅在生产模式下启用ZIP打包
      // ...(isProduction ? [
      //   new WebpackZipPlugin({
      //     filename: 'react-chrome-extension',
      //     outputPath: 'packages',
      //     password: 'ChromeExt2024!', // 固定密码
      //     includeChecksums: true,
      //     compressionLevel: 9
      //   })
      // ] : [])
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