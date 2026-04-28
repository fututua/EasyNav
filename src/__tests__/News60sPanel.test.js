import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import News60sPanel from '../components/News60sPanel.vue'

describe('News60sPanel', () => {
  it('shows a loading state before the news content arrives', () => {
    const wrapper = mount(News60sPanel, {
      props: {
        status: 'loading',
        newsData: null,
        errorMessage: '',
      },
    })

    expect(wrapper.text()).toContain('正在获取今日 60s 看世界')
  })

  it('renders only the image area after a successful load', () => {
    const wrapper = mount(News60sPanel, {
      props: {
        status: 'success',
        errorMessage: '',
        newsData: {
          date: '2026-04-10',
          image: 'https://example.com/60s.jpg',
          news: ['第一条', '第二条'],
        },
      },
    })

    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/60s.jpg')
    expect(wrapper.text()).not.toContain('IT 新闻')
    expect(wrapper.text()).not.toContain('OPPO K15 Pro 系列手机参数曝光')
  })

  it('shows an error state with a retry button when the request fails', () => {
    const wrapper = mount(News60sPanel, {
      props: {
        status: 'error',
        newsData: null,
        errorMessage: '加载失败',
      },
    })

    expect(wrapper.text()).toContain('加载失败')
    expect(wrapper.text()).toContain('重试')
  })
})
