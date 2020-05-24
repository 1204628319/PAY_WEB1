import request from '@/utils/request'

// 获取所有的权限树
export function getPermissionTree() {
  return request({
    url: 'admin/permissions/tree',
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: 'admin/createPermissions',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'admin/deletePermissions',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/editPermissions',
    method: 'post',
    data
  })
}
