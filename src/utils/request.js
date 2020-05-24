import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Config from '@/config'
import router from '@/router'
import { getItem, setItem } from '@/utils/store'
import { createRandomString } from '@/utils'
import { RESULT_CODE } from '@/config/errCode.js'

axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: Config.timeout // request timeout
  // transformRequest: [function(data) {
  //   // 对 data 进行任意转换处理
  //   const formatRequestData = Qs.stringify(data, { arrayFormat: 'indices' })
  //   console.log('formatRequestData = ' + formatRequestData)
  //   return formatRequestData
  // }]
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // 差错分析->导出明细,此处处理是因为Notification组件的应用都在此文件。
    // TODO: 1.导出汇总->无导出数据时在前端处理. 2.其他模块(对账汇总,对账记录)无数据时集中提示.
    const noExportData = config.url.split('/')[1] === 'billExceptionAnalysis' && config.data.length === 0
    if (noExportData) {
      Notification.error({
        title: '没有数据,不能导出'
      })
      return Promise.reject('error')
    }

    if (getToken()) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer:' + getToken()
    }
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json'
    if (getItem('deviceId')) {
      config.headers['deviceId'] = getItem('deviceId')
    } else {
      const deviceId = createRandomString()
      setItem('deviceId', deviceId)
      config.headers['deviceId'] = deviceId
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      })
      return Promise.reject('error')
    } else {
      if (response.headers.authorization) {
        store.dispatch('user/changeToken', response.headers.authorization)
      }
      const data = response.data
      // 判断是否是下载类型
      if (data.byteLength === 0) {
        Notification.error({
          title: '没有数据,不能导出'
        })
        return Promise.reject('error')
      }
      if (response.headers['content-type'].indexOf('excel') !== -1) {
        const excelResponse = {
          type: 'xlsx',
          data: data
        }
        return excelResponse
      }
      if (response.headers['content-type'].indexOf('octet-stream') !== -1) {
        const zipResponse = {
          type: 'zip',
          data: data
        }
        return zipResponse
      }
      if (RESULT_CODE[data.resultCode]) {
        if (data.data != null) {
          return data.data
        } else {
          return data
        }
      } else {
        if (data.resultMsg && data.resultMsg === 'Token已过期,请重新登录!') {
          store.dispatch('user/logout').then(() => {
            // 为了重新实例化vue-router对象 避免bug
            location.reload()
          })
          return
        }
        Notification.error({
          title: data.resultMsg ? data.resultMsg : '请求出错'
        })
        if (data.resultCode === '00000001') {
          return Promise.reject(data)
        }
        return Promise.reject('error')
      }
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 2500
        })
        return Promise.reject('error')
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        Notification.error({
          title: '网络请求错误',
          duration: 2500
        })
        return Promise.reject('error')
      }
    }
    if (code === 401) {
      MessageBox.confirm(
        error.response.data.message,
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('user/logout').then(() => {
          // 为了重新实例化vue-router对象 避免bug
          location.reload()
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject('error')
  }
)

export default service
