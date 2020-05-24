import request from '@/utils/request'

export function getUsers() {
  return request({
    url: 'admin/users',
    method: 'post'
  })
}
/**
 * 创建用户
 */
export function add(data) {
  return request({
    url: 'admin/createUser',
    method: 'post',
    data
  })
}
/**
 * 更新用户信息
 */
export function updateUser(data) {
  return request({
    url: 'admin/updateUser',
    method: 'post',
    data
  })
}
/**
 * 重置密码
 */
export function resetUserPassword(data) {
  return request({
    url: 'admin/user/resetPassword',
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: 'admin/users',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'admin/users',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'admin/deleteUser',
    method: 'post',
    data
  })
}
export function getUserInfo() {
  return request({
    url: 'admin/getUserInfo',
    method: 'post'
  })
}

export function validPass(oldPass) {
  return request({
    url: 'admin/getOldPass',
    method: 'post',
    data: { password: oldPass }
  })
}

export function updatePass(confirmPass) {
  return request({
    url: 'admin/updatePass',
    method: 'post',
    data: { password: confirmPass }
  })
}
