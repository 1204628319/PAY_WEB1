import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'post'
  })
}

export function getRoles() {
  return request({
    url: '/admin/roles/getMap',
    method: 'post'
  })
}

export function addRole(data) {
  return request({
    url: '/admin/roles/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/admin/roles/update`,
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `/admin/roles/delete`,
    method: 'post',
    data
  })
}

export function editPermission(data) {
  return request({
    url: 'admin/roles/permission',
    method: 'post',
    data
  })
}

export function editMenu(data) {
  return request({
    url: 'admin/roles/menu',
    method: 'post',
    data
  })
}
/**
 * 获取权限数
 */
export function rolesTree(data) {
  return request({
    url: 'admin/roles/tree',
    method: 'post',
    data
  })
}
/**
 * 获取当前角色所有父级
 * @param {角色id} data
 */
export function getAllParent(data) {
  return request({
    url: '/admin/roles/getAllParent',
    method: 'post',
    data
  })
}
