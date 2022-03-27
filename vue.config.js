/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'api': '@/api',
        'assets': '@/assets',
        'img': 'assets/img',
        'components': '@/components',
        'views': '@/views',
      }
    }
  }
}
