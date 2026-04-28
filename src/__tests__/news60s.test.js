import { describe, expect, it, vi } from 'vitest'
import {
  fetchItNews,
  fetchSixtyNews,
  normalizeItNewsPayload,
  normalizeSixtyNewsPayload,
} from '../news60s.js'

describe('normalizeSixtyNewsPayload', () => {
  it('maps the remote payload into the fixed shape used by the UI', () => {
    const payload = {
      data: {
        date: '2026-04-10',
        image: 'https://example.com/60s.jpg',
        news: ['第一条', '第二条'],
      },
    }

    expect(normalizeSixtyNewsPayload(payload)).toEqual({
      date: '2026-04-10',
      image: 'https://example.com/60s.jpg',
      news: ['第一条', '第二条'],
    })
  })
})

describe('fetchSixtyNews', () => {
  it('requests the configured 60s endpoint and returns normalized data', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          date: '2026-04-10',
          image: 'https://example.com/60s.jpg',
          news: ['第一条'],
        },
      }),
    })

    await expect(fetchSixtyNews(fetchMock)).resolves.toEqual({
      date: '2026-04-10',
      image: 'https://example.com/60s.jpg',
      news: ['第一条'],
    })

    expect(fetchMock).toHaveBeenCalledWith('https://easyjk.qzz.io/v2/60s', {
      cache: 'no-store',
    })
  })
})

describe('normalizeItNewsPayload', () => {
  it('maps the IT news payload into the fixed shape used by the UI', () => {
    const payload = {
      data: [
        {
          title: '标题',
          description: '摘要',
          link: 'https://example.com/story',
          created: '2026-04-10 09:00:00',
          created_at: 1775782800000,
        },
      ],
    }

    expect(normalizeItNewsPayload(payload)).toEqual([
      {
        title: '标题',
        description: '摘要',
        link: 'https://example.com/story',
        created: '2026-04-10 09:00:00',
        createdAt: 1775782800000,
      },
    ])
  })
})

describe('fetchItNews', () => {
  it('requests the configured it-news endpoint and returns normalized items', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            title: '标题',
            description: '摘要',
            link: 'https://example.com/story',
            created: '2026-04-10 09:00:00',
            created_at: 1775782800000,
          },
        ],
      }),
    })

    await expect(fetchItNews(fetchMock)).resolves.toEqual([
      {
        title: '标题',
        description: '摘要',
        link: 'https://example.com/story',
        created: '2026-04-10 09:00:00',
        createdAt: 1775782800000,
      },
    ])

    expect(fetchMock).toHaveBeenCalledWith('https://easyjk.qzz.io/v2/it-news', {
      cache: 'no-store',
    })
  })
})
