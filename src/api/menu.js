import request from '@/utils/request'

// 获取所有的菜单树
export function getMenusTree() {
  return request({
    url: 'admin/menus/tree',
    method: 'post'
  })
}

export function buildMenus() {
  return request({
    url: 'admin/menus/build',
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: 'admin/menus',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'admin/deleteMenus',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/editMenus',
    method: 'post',
    data
  })
}
