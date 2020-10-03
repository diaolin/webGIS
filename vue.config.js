module.exports = {
    configureWebpack: {
      externals: {
        "BMap": "BMap"
      }
    },
    devServer: {
      port: 8081
    },
    // proxyTable: {
    //   '/': {
    //       target: 'http://192.168.100.115:8080',//后端接口地址
    //       changeOrigin: true,//是否允许跨越
    //       pathRewrite: {
    //           '^/': '/',//重写,
    //       }
    //   }
    // }
  }