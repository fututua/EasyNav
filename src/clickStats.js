import { reactive } from 'vue'
import { supabase } from './supabase.js'

// key: site_id (string), value: count (number)
export const clickCounts = reactive({})

export async function loadStats() {
  if (!supabase) return
  const { data, error } = await supabase.from('click_stats').select('site_id, count')
  if (error) {
    console.warn('[ClickStats] Failed to load stats:', error)
    return
  }
  if (!data) return
  for (const row of data) clickCounts[row.site_id] = row.count
}

// Anti-spam: same site_id blocked for 5s per browser session
const lastClick = {}

export async function recordClick(siteId) {
  if (!supabase) return
  const now = Date.now()
  if (lastClick[siteId] && now - lastClick[siteId] < 5_000) return
  lastClick[siteId] = now
  const { data, error } = await supabase.rpc('increment_click', { p_site_id: siteId })
  if (error) {
    console.warn('[ClickStats] Failed to record click:', error)
    return
  }
  if (data != null) clickCounts[siteId] = data
}
