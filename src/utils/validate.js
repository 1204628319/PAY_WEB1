/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 校验
 */
import VALIDE_ROLES from './validatorFn'

export default class Validator {
  constructor() {
    this.cache = []
  }

  add(value, rules, errorMsg) {
    const ary = rules.split(':')
    this.cache.push(() => {
      const ruleName = ary.shift()
      ary.unshift(value)
      ary.push(errorMsg)
      return VALIDE_ROLES[ruleName].apply(value, ary)
    })
  }

  start() {
    for (let i = 0; i < this.cache.length; i++) {
      const validatorFunc = this.cache[i]
      // 开始校验，并取得校验后的返回信息
      const msg = validatorFunc()
      //  如果有值,则证明校验没有通过
      if (msg) return msg
    }
  }
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 验证是否是手机号码
 * @param {手机号码} str
 */
export function isPhone(str) {
  return /^1[34578]\d{9}$/.test(str)
}

/**
 * 验证是否是固定电话
 * @param {固定电话} str
 */
export function isFixedPhone(str) {
  return /^(\d3,4\d3,4|\d{3,4}-)?\d{7,8}$/.test(str)
}

/**
 * 验证是否是身份证号码
 * @param {身份证号码} str
 */
export function isIdCard(str) {
  return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(str.toUpperCase())
}
