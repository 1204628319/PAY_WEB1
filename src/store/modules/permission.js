import { constantRoutes } from '@/router'
import Layout from '../../layout/index'

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // generateRoutes({ commit }, routes) {
  //   return new Promise(resolve => {
  //     // if (roles.includes('admin')) {
  //     //   accessedRoutes = asyncRoutes || []
  //     // } else {
  //     const accessedRoutes = filterAsyncRouter(routes)
  //     // }
  //     // commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // },
  generateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTES', asyncRouter)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
