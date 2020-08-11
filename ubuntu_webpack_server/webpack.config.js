const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require('fs');


module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'assets' 
  },
  devServer: {
    https: true,
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('private.crt'), 
    ca: fs.readFileSync('private.pem'),
    compress: true,
    host: "172.30.0.234",
    port: 443,
    proxy: {
        '/uploads': {
            target: 'https://54.175.248.168:443', 
            changeOrigin: true, 
            secure: false, 
            pathRewrite: {
              '/uploads' : '/public'
            }
        },
        '/api': {
            target: 'https://54.175.248.168:443',
            changeOrigin: true, 
            secure: false
        }
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
