const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/' // 设置publicPath为根路径以确保正确的资源加载
})
