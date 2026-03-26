import { reactive } from 'vue'
import { getJSON, setJSON } from './utils/storage.js'

// key: domain, value: resolved iconStatus ('origin' | 'api' | 'color')
// 从 localStorage 恢复缓存，提升性能
const cached = getJSON('easynav-icon-cache', {})
export const iconCache = reactive(cached)

// 持久化缓存到 localStorage
export function saveIconCache(domain, status) {
  iconCache[domain] = status
  setJSON('easynav-icon-cache', iconCache)
}
