export const SIXTY_NEWS_CATEGORY_ID = 'sixty-news'
export const IT_NEWS_CATEGORY_ID = 'it-news'
export const SIXTY_NEWS_ENDPOINT = 'https://easyjk.qzz.io/v2/60s'
export const IT_NEWS_ENDPOINT = 'https://easyjk.qzz.io/v2/it-news'

function pickFirstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export function normalizeSixtyNewsPayload(payload) {
  const data = payload?.data ?? payload ?? {}
  const date = pickFirstString(data.date, data.time)
  const image = pickFirstString(
    data.image,
    data.image_url,
    data.imgurl,
    data.img_url,
    data.cover,
  )
  const news = Array.isArray(data.news)
    ? data.news
        .filter(item => typeof item === 'string' && item.trim())
        .map(item => item.trim())
    : []

  if (!date && !image && news.length === 0) {
    throw new Error('60s 接口返回了无法识别的数据格式')
  }

  return { date, image, news }
}

export function normalizeItNewsPayload(payload) {
  const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : []

  return items
    .map(item => ({
      title: pickFirstString(item?.title),
      description: pickFirstString(item?.description),
      link: pickFirstString(item?.link, item?.url),
      created: pickFirstString(item?.created),
      createdAt: Number.isFinite(item?.created_at) ? item.created_at : null,
    }))
    .filter(item => item.title && item.description)
}

export async function fetchSixtyNews(fetchImpl = fetch) {
  const response = await fetchImpl(SIXTY_NEWS_ENDPOINT, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`60s 新闻请求失败（${response.status}）`)
  }

  const payload = await response.json()
  return normalizeSixtyNewsPayload(payload)
}

export async function fetchItNews(fetchImpl = fetch) {
  const response = await fetchImpl(IT_NEWS_ENDPOINT, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`IT 新闻请求失败（${response.status}）`)
  }

  const payload = await response.json()
  return normalizeItNewsPayload(payload)
}
