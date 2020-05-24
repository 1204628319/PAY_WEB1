//  兼容浏览器和微信本地存储

export function setItem(key, value) {
  window.localStorage.setItem(
    key,
    typeof value === 'object' ? JSON.stringify(value) : value
  )
}

export function getItem(key) {
  const value = window.localStorage.getItem(key)
  if (value) {
    return value
  }
}

export function removeItem(key) {
  window.localStorage.removeItem(key)
}
export function clearItem() {
  window.localStorage.clear()
}
