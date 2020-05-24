// import parseTime, formatTime and set to filter
import { parseTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function getHours(time, type = 1) {
  if (time) {
    return parseTime(time, type === 1 ? '{h}:{i}:{s}' : '{y}-{m}-{d}')
  }
  return ''
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
/**
  * 计算时间差
  * @param {开始时间} startTime
  * @param {结束时间} endTime
  */
export function calCostTime(startTime, endTime) {
  if (startTime === undefined || startTime === null || endTime === undefined || endTime === null) return '计算中'
  const s = new Date(startTime).getTime()
  const e = new Date(endTime).getTime()
  const r = (e - s) / 1000
  return r + '秒'
}
/**
 * 对账汇总 判断是否显示全部
 * @param {String} string
 */
export function isAll(string) {
  if (string) {
    if (string.indexOf(',') >= 0) {
      return '全部'
    }
    return string.split('|')[1]
  }
  return string
}
export function isChilderAll(string) {
  if (string) {
    if (string.indexOf(',') >= 0) {
      return ''
    }
    return string.split('|')[1]
  }
  return string
}

/**
 * 分转元
 */
export function formatFee(fee) {
  return parseFloat((fee / 100).toFixed(2))
}

/**
 * 分转万元
 */
export function formatWanFee(fee) {
  return parseFloat((fee / 1000000))
}

export function formatMoneyWithUnit(fee) {
  if (!fee) return 0
  if (fee > 1000000) {
    return formatWanFee(fee)
  } else {
    return formatFee(fee)
  }
}

/**
 * 分转元带千分位
 * @param {金额} money
 * @param {金额类型(true: 分，false: 元)} isFen
 */
export function formatMoney(money, isFen = false) {
  /* eslint-disable */
  if (money || money == 0) {
    const m = isFen ? (Number(money) / 100).toFixed(2) + '' : Number(money).toFixed(2) + ''
    const reg = /\d{1,3}(?=(\d{3})+$)/g
    if (m.indexOf('.') >= 0) {
      const arr = m.split('.')
      return (arr[0] + '').replace(reg, '$&,') + '.' + arr[1]
    }
    return m.replace(reg, '$&,')
  }
  return money
}

export function dealBeforeFormatMoney(value, count, isFen = false) {
  if (count === 0) {
    return ''
  } else {
    return formatMoney(value, isFen)
  }
}

export function conversionNumber(value) {
  if(!value) return 0
  const reg = /\%|\‱/
  let num = +value.replace(reg,'')
  if(value.indexOf('‱') >= 0){
    return num / 100
  }
  return num
}
