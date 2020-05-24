import Vue from 'vue'
import Constants from '@/config'

// v-dialogDrag: 弹窗拖拽属性
Vue.directive('closeDialog', {
  bind(el, binding, vnode, oldVnode) {
    el.onmousedown = (e) => {
      Constants.clickDialog = true
    }
    el.onmouseup = (e) => {
      Constants.clickDialog = false
    }
    el.onmouseleave = (e) => {
      if (Constants.clickDialog) {
        Constants.clickDialog = false
        Constants.closeDialog = false
      } else {
        Constants.closeDialog = true
      }
    }
  }
})

export function handleCommonCloseDialog(done) {
  if (Constants.closeDialog) {
    done()
  } else {
    Constants.closeDialog = true
  }
}
