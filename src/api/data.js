import request from '@/utils/request'

export function initData(url, data, method) {
  // 默认使用post请求
  return request({
    url: url,
    method: method || 'post',
    data
  })
}
