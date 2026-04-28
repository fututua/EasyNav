import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('../clickStats.js', () => ({
  loadStats: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('../news60s.js', () => ({
  SIXTY_NEWS_CATEGORY_ID: 'sixty-news',
  IT_NEWS_CATEGORY_ID: 'it-news',
  fetchSixtyNews: vi.fn().mockResolvedValue({
    date: '2026-04-10',
    image: 'https://example.com/60s.jpg',
    news: ['item'],
  }),
  fetchItNews: vi.fn().mockResolvedValue([
    {
      title: 'IT title',
      description: 'IT description',
      link: 'https://example.com/story',
      created: '2026-04-10 09:00:00',
      createdAt: 1775782800000,
    },
  ]),
}))

import App from '../App.vue'

async function flushMicrotasks() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('App special view icons', () => {
  it('shows a tech icon in the top header for the IT news view', async () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          ResourceCard: { template: '<div />' },
          News60sPanel: { template: '<div />' },
          ItNewsPanel: { template: '<div />' },
        },
      },
    })

    const itNewsButton = wrapper.findAll('button').find(button => button.text().includes('IT'))
    expect(itNewsButton).toBeTruthy()

    await itNewsButton.trigger('click')
    await flushMicrotasks()

    const headerHtml = wrapper.find('header').html()
    expect(wrapper.find('header').text()).toContain('IT')
    expect(headerHtml).toContain('lucide-cpu-icon')
  })
})
