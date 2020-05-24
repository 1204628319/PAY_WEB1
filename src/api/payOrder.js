import request from '@/utils/request'

export function serverSelectPage(data) {
  return request({
    url: '/alipayCreditPay/selectPayResult',
    method: 'post',
    data
  })
}

export function pay(data) {
  return request({
    url: '/alipayCreditPay/pay',
    method: 'post',
    data
  })
}

export function sync(data) {
  return request({
    url: '/alipayCreditPay/sync',
    method: 'post',
    data
  })
}

export function uploadImage(data) {
  return request({
    url: '/alipayCreditPay/uploadImage',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function selectUploadImage(data) {
  return request({
    url: '/alipayCreditPay/selectPayResult',
    method: 'post',
    data
  })
}

export function scMember(data) {
  return request({
    url: '/alipayCreditPay/scMember',
    method: 'post',
    data
  })
}

export function selectScMember(data) {
  return request({
    url: '/alipayCreditPay/selectScMember',
    method: 'post',
    data
  })
}
