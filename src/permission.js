import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/permission'
import indexRouter from '@/router/indexRouter.js'
import { deepClone } from '@/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('user/getInfo').then(res => {
          // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch(() => {
          store.dispatch('user/logout').then(() => {
            // 为了重新实例化vue-router对象 避免bug
            location.reload()
          })
        })
        // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('user/updateLoadMenus').then(res => {
        })
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      let url = `/login?redirect=${to.path}`
      //  判断是否带code参数
      if (to.query.code) {
        url += to.fullPath ? to.fullPath.replace('/?', '&') : ''
      }
      // other pages that do not have permission to access are redirected to the login page.
      next(url)
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  buildMenus().then(async res => {
    let localRouter = deepClone(indexRouter)
    localRouter = await asyncSettingRouter()
    let asyncRouter = filterAsyncRouter(res)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    asyncRouter = localRouter.concat(asyncRouter)
    store.dispatch('permission/generateRoutes', asyncRouter).then(() => {
      // 存储路由，动态添加可访问路由表
      router.addRoutes(asyncRouter)
      // hack方法 确保addRoutes已完成
      next({ ...to, replace: true })
    })
  })
}

/**
 * 设置首页
 */
export function asyncSettingRouter() {
  return new Promise((resolve) => {
    const indexRouterCopy = deepClone(indexRouter)
    indexRouterCopy[0].redirect = 'dashboard'
    indexRouterCopy[0].children[0].meta.icon = ''
    indexRouterCopy[0].children[0].hidden = false
    resolve(indexRouterCopy)
  })
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
