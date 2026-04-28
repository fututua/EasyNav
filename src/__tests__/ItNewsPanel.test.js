import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ItNewsPanel from '../components/ItNewsPanel.vue'

describe('ItNewsPanel', () => {
  it('shows a loading state before IT news arrives', () => {
    const wrapper = mount(ItNewsPanel, {
      props: {
        status: 'loading',
        items: [],
        errorMessage: '',
      },
    })

    expect(wrapper.text()).toContain('正在获取 IT 新闻')
  })

  it('renders IT news cards with collapsed descriptions by default', () => {
    const wrapper = mount(ItNewsPanel, {
      props: {
        status: 'success',
        errorMessage: '',
        items: [
          {
            title: 'OPPO K15 Pro 系列手机参数曝光',
            description: '默认收起时只显示两行以内摘要，展开后显示完整内容。',
            link: 'https://example.com/story',
            created: '2026-04-10 09:00:00',
            createdAt: 1775782800000,
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('IT 新闻')
    expect(wrapper.text()).toContain('OPPO K15 Pro 系列手机参数曝光')
    expect(wrapper.text()).toContain('2026-04-10 09:00:00')
    expect(wrapper.text()).toContain('展开')
    expect(wrapper.find('[data-testid="it-news-description"]').classes()).toContain('line-clamp-2')
  })

  it('expands and collapses the full description', async () => {
    const wrapper = mount(ItNewsPanel, {
      props: {
        status: 'success',
        errorMessage: '',
        items: [
          {
            title: '标题',
            description: '这是一段完整摘要内容',
            link: 'https://example.com/story',
            created: '2026-04-10 09:00:00',
            createdAt: 1775782800000,
          },
        ],
      },
    })

    await wrapper.get('button[type="button"]').trigger('click')
    expect(wrapper.get('[data-testid="it-news-description"]').classes()).not.toContain('line-clamp-2')
    expect(wrapper.text()).toContain('收起')

    await wrapper.get('button[type="button"]').trigger('click')
    expect(wrapper.get('[data-testid="it-news-description"]').classes()).toContain('line-clamp-2')
    expect(wrapper.text()).toContain('展开')
  })

  it('shows a retry action when loading IT news fails', () => {
    const wrapper = mount(ItNewsPanel, {
      props: {
        status: 'error',
        items: [],
        errorMessage: 'IT 新闻加载失败',
      },
    })

    expect(wrapper.text()).toContain('IT 新闻加载失败')
    expect(wrapper.text()).toContain('重试')
  })
})
