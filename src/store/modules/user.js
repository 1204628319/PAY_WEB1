import { login } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getUserInfo } from '@/api/user'
import md5 from 'js-md5'

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res)
}
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: {},
  loadMenus: false,
  message: 0
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_LOAD_MENUS: (state, loadMenus) => {
    state.loadMenus = loadMenus
  },
  SET_MESSAGE_NUMBER: (state, value) => {
    state.message = value
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const params = { ...userInfo }
    delete params.rememberMe
    return new Promise((resolve, reject) => {
      login(params).then(response => {
        commit('SET_TOKEN', response.token)
        setUserInfo(response.user, commit)
        setToken(response.token, userInfo.rememberMe)
        // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
        commit('SET_LOAD_MENUS', true)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        setUserInfo(res, commit)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },
  updateLoadMenus({ commit }) {
    return new Promise(() => {
      commit('SET_LOAD_MENUS', false)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  changeToken({ commit }, token) {
    return new Promise(resolve => {
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    })
  },
  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
  setMessageNumber({ commit }, value) {
    commit('SET_MESSAGE_NUMBER', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
