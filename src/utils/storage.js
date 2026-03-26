// 安全的 localStorage 操作工具
// 处理隐私模式、禁用存储等异常情况

export function getItem(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? value : defaultValue
  } catch (error) {
    console.warn(`[Storage] Failed to get "${key}":`, error)
    return defaultValue
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn(`[Storage] Failed to set "${key}":`, error)
    return false
  }
}

export function getJSON(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : defaultValue
  } catch (error) {
    console.warn(`[Storage] Failed to parse JSON for "${key}":`, error)
    return defaultValue
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[Storage] Failed to stringify JSON for "${key}":`, error)
    return false
  }
}
