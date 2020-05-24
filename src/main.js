import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import permission from './components/permission'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './utils/rem'
import consts from './utils/consts'
import commonAjax from '@/api/common'

// 表格高度自适应指令
import adaptive from './directive/el-table/index.js'
// 容器高度自适应
import adaptiveHeight from './directive/adaptive-height/index.js'

import * as filters from './filters' // global filters

Vue.use(Element, {
  // size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(adaptive)
Vue.use(adaptiveHeight)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$commonAjax = commonAjax
Vue.prototype.constant = consts
Vue.config.productionTip = false
Vue.use(permission)

/*eslint-disable*/
const vueInstance = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
