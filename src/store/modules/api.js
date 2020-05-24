const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // Sql 监控
    sqlApi: baseUrl + 'druid',
    // swagger
    swaggerApi: baseUrl + 'swagger-ui.html',
    // 配置中心
    configCenter: 'http://127.0.0.1:8848/nacos'
  }
}

export default api
