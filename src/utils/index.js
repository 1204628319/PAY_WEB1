/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
  * 计算时间差
  * @param {开始时间} startTime
  * @param {结束时间} endTime
  */
export function calCostTime(startTime, endTime) {
  return new Promise((resolve, reject) => {
    if (startTime === undefined || startTime === null || endTime === undefined || endTime === null) reject('参数错误')
    const s = new Date(startTime).getTime()
    const e = new Date(endTime).getTime()
    const r = (e - s) / 1000 / 60
    resolve(r)
  })
}

/**
  * 获取本月第一天的时间到待计算的时间
  * @param {待计算的初始时间,默认当前时间} curDate
  */
export function getMonthDate(curDate = new Date(), type = '{y}-{m}-{d} {h}:{i}') {
  const date = {
    startDate: '',
    endDate: ''
  }
  date.endDate = parseTime(curDate, type)
  date.startDate = parseTime(curDate, '{y}-{m}') + '-01'
  return date
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function throttle(func, wait, mustRun) {
  var timeout
  var startTime = new Date()
  return function() {
    var context = this
    var args = arguments
    var curTime = new Date()
    clearTimeout(timeout)
    if (curTime - startTime >= mustRun) {
      func.apply(context, args)
      startTime = curTime
    } else {
      timeout = setTimeout(func, wait)
    }
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
/**
 * 生成随机字符串
 * @param {生成随机字符串的长度} len
 */
export function createRandomString(len) {
  len = len || 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
  const maxlen = chars.length
  let rs = ''
  for (let i = 0; i < len; i++) {
    rs += chars.charAt(Math.floor(Math.random() * maxlen))
  }
  return rs
}
/**
 * 日期选择
 */
export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

/**
 * 不选择当天及以后的时间
 */
export const pickerOptionsNoToday = [
  {
    text: '昨天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date((new Date().getTime() - 3600 * 1000 * 24)).toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date((new Date().getTime() - 3600 * 1000 * 24)).toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date((new Date().getTime() - 3600 * 1000 * 24)).toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }]

/**
 * 可选择当天及以后的一个月
 */
export const pickerOptionsToday = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date((new Date().getTime() - 3600 * 1000 * 24)).toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date((new Date().getTime() - 3600 * 1000 * 24)).toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }]

/**
   * 验证密码(字母数字二者取一不可,长度在6~32位之间)
   * @param {密码} password
   */
export function CheckPassWord(password, callback) {
  var str = password
  if (str == null || str.length < 6 || str.length > 32) {
    callback(new Error('密码长度在6~32位之间且必须包含字母跟数字'))
    return false
  }
  var reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
  if (reg.test(str)) {
    callback()
    return true
  } else {
    callback(new Error('密码长度在6~32位之间且必须包含字母跟数字'))
    return false
  }
}

/**
 * 分转元
 */
export function Fen2Yuan(fee) {
  return (fee / 100).toFixed(2)
}

/**
 * @description 浮点精确运算加法
 * @param arg1 浮点数1
 * @param arg2 浮点数2
 */
export function floatAdd(arg1, arg2) {
  const r1 = arg1.toString().split('.')[1] ? arg1.toString().split('.')[1].length : 0
  const r2 = arg2.toString().split('.')[1] ? arg2.toString().split('.')[1].length : 0
  const m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
/**
 * @description 浮点精确运算减法
 * @param arg1 浮点数1
 * @param arg2 浮点数2
 */
export function floatSub(arg1, arg2) {
  const r1 = arg1.toString().split('.')[1] ? arg1.toString().split('.')[1].length : 0
  const r2 = arg2.toString().split('.')[1] ? arg2.toString().split('.')[1].length : 0
  const m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  const n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
/**
 * @description 浮点精确运算除法
 * @param arg1 浮点数1
 * @param arg2 浮点数2
 */
export function floatDiv(arg1, arg2) {
  const r1 = arg1.toString().split('.')[1] ? arg1.toString().split('.')[1].length : 0
  const r2 = arg2.toString().split('.')[1] ? arg2.toString().split('.')[1].length : 0
  return (Number(arg1.toString().replace('.', '')) / Number(arg2.toString().replace('.', ''))) * Math.pow(10, r2 - r1)
}
/**
 * @description 浮点精确运算乘法
 * @param arg1 浮点数1
 * @param arg2 浮点数2
 */
export function floatMul(arg1, arg2) {
  const r1 = arg1.toString().split('.')[1] ? arg1.toString().split('.')[1].length : 0
  const r2 = arg2.toString().split('.')[1] ? arg2.toString().split('.')[1].length : 0
  return Number(arg1.toString().replace('.', '')) * Number(arg2.toString().replace('.', '')) / Math.pow(10, r1 + r2)
}
export function setScrollBar(el, value) {
  const element = document.getElementsByClassName(el)
  element[0].scrollTop = 0
  element[0].style.overflow = value
}
/**
 * @description 获取处理之后的图表数据
 * @param seriesData 原始图表数据
 * @param maxCount 图表允许显示的最大数据条数
 */
export function getSeriesDataByMaxCount(seriesData, maxCount) {
  function arrayItemSum(array) {
    return array.reduce((totalValue, currentValue) => {
      const value = Number(currentValue)
      return isNaN(value) ? totalValue : floatAdd(totalValue, value)
    }, 0)
  }
  function arraySum(array1, array2) {
    function isBlank(val) {
      if (val == null || val === '' || isNaN(Number(val))) {
        return true
      }
    }
    const json = { array1, array2 }
    const result = []
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        json[key].forEach((value, index) => {
          if (isBlank(result[index])) {
            result[index] = 0
          }
          result[index] = floatAdd(result[index], Number(value))
        })
      }
    }
    return result
  }
  if (!seriesData || seriesData.length === 0) {
    return []
  }
  if (seriesData.length <= maxCount) {
    return seriesData
  }
  let isPieData = true
  // 按从大到小排序
  seriesData.sort((a, b) => {
    // 饼图数据是单纯的数字，折线图和柱状图为数组，当发现是数组时，需要把数组中所有数字累加来比较大小
    if (a.value instanceof Array) {
      isPieData = false
      return arrayItemSum(b.value) - arrayItemSum(a.value)
    }
    return b.value - a.value
  })
  const list = seriesData.slice(0, maxCount - 1)
  // 将排序之后的数据中的第N之后的数据归纳到'其它'
  const otherList = seriesData.slice(maxCount - 1)
  let otherTotalValue = isPieData ? 0 : []
  otherList.forEach((item, index) => {
    otherTotalValue = isPieData ? floatAdd(otherTotalValue, item.value) : arraySum(item.value, otherTotalValue)
  })
  const other = {
    name: '其它',
    value: otherTotalValue
  }
  list.push(other)
  return list
}

/**
 * 下载excel文件
 * @param {文件流} data
 * @param {文件名称} filename
 */
export function downLoadXls(data, filename, type = 'xlsx') {
  let downType = type === 'xlsx' ? 'application/vnd.ms-excel' : 'application/.zip'
  var blob = new Blob([data], { type: downType })
  filename += '.' + type
  if (typeof window.chrome !== 'undefined') {
    // Chrome 浏览器
    var link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
  } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE 浏览器
    downType = type === 'xlsx' ? 'application/force-download' : 'application/.zip'
    blob = new Blob([data], { type: downType })
    window.navigator.msSaveBlob(blob, filename)
  } else {
    // Firefox 浏览器
    downType = type === 'xlsx' ? 'application/force-download' : 'application/.zip'
    var file = new File([data], filename, { type: downType })
    window.open(URL.createObjectURL(file))
  }
}

export function downLoadImage(url, saveName) {
  function base64ToBlob(base64) {
    const arr = base64.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const imgData = atob(arr[1])
    let n = imgData.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = imgData.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  if (window.navigator.msSaveBlob) {
    // IE浏览器兼容处理
    const image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function() {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      // 得到图片的base64编码数据
      const imgBase64 = canvas.toDataURL()
      // base64转blob
      const blob = base64ToBlob(imgBase64)
      window.navigator.msSaveBlob(blob, saveName)
    }
    image.src = url
  } else {
    // 谷歌浏览器 创建a标签 添加download属性下载
    const aLink = document.createElement('a')
    aLink.href = url
    aLink.download = saveName
    aLink.click()
  }
}
export function downLoadBillFile(url) {
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.download = ''
  aLink.click()
}
/**
 * 验证金额输入
 * @param {传入的值} value
 */
export function validMoneyFormat(value) {
  if (!value) return ''
  const parseMoney = value.replace(/[^-\.\d]/g, '')
  //  判断首位是否是0，为0第二位只能为小数点
  //  parseMoney.indexOf('-0') === 0
  if (parseMoney.indexOf('0') === 0 && parseMoney.substring(1, 2) !== '.') {
    return parseMoney.substring(0, 1)
  }
  if (parseMoney.indexOf('-0') === 0 && parseMoney.substring(2, 3) !== '.') {
    return parseMoney.substring(0, 2)
  }
  //  -号只能放在最前面
  if (parseMoney.indexOf('-') > 0) {
    return parseMoney.replace('-', '')
  }
  //  过滤多余的小数点
  if (parseMoney.split('.').length > 2) {
    return parseMoney.split('.').slice(0, 2).join('.')
  }
  //  过滤掉-号
  if (parseMoney.split('-').length > 2) {
    return parseMoney.split('-').slice(0, 2).join('-')
  }
  return parseMoney
}

/**
 * 获取前一天日期
 */
export function getBeforeDay() {
  return parseTime(new Date(new Date((new Date().getTime() - 3600 * 1000 * 24)).toDateString()), '{y}-{m}-{d}')
}

/**
 * 处理筛选条件中开始结束时间(格式化之后接口传参使用)
 * @param time
 * @param shortFormat 是否为不需要时分秒的短格式
 * @returns {string|*|string}
 */
export function buildSearchStartDate(time, shortFormat) {
  if (!time || time.length < 2) {
    return ''
  }
  return shortFormat ? (time[0] || '') : (time[0] ? time[0] + ' 00:00:00' : '')
}

/**
 * 处理筛选条件中开始结束时间(格式化之后接口传参使用)
 * @param time
 * @param shortFormat 是否为不需要时分秒的短格式
 * @returns {string|*|string}
 */
export function buildSearchEndDate(time, shortFormat) {
  if (!time || time.length < 2) {
    return ''
  }
  return shortFormat ? (time[1] || '') : (time[1] ? time[1] + ' 23:59:59' : '')
}
