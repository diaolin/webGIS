const path = require('path')
module.exports = {
    publicPath: '.',
    configureWebpack: {
      externals: {
        "BMap": "BMap"
      }
    },
    devServer: {
      port: 8081,
      proxy: {
        '/api': {
              // target: 'http://127.0.0.1:8080',
             target: 'http://192.168.100.115:8080',
             changeOrigin: true,
             pathRewrite: {
               '^/api': '' 
             }
           }
          }
    },
    
  }