import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from '../components/Sidebar.vue'

describe('Sidebar', () => {
  it('renders the 60s and IT news entries alongside existing navigation items', () => {
    const wrapper = mount(Sidebar, {
      props: {
        active: 'all',
      },
    })

    expect(wrapper.text()).toContain('60s')
    expect(wrapper.text()).toContain('IT')
  })

  it('uses a dedicated tech icon for the IT news entry', () => {
    const wrapper = mount(Sidebar, {
      props: {
        active: 'all',
      },
    })

    const buttons = wrapper.findAll('button')
    const sixtyNewsButton = buttons.find(button => button.text().includes('60s'))
    const itNewsButton = buttons.find(button => button.text().includes('IT'))

    expect(sixtyNewsButton).toBeTruthy()
    expect(itNewsButton).toBeTruthy()
    expect(sixtyNewsButton.find('svg').html()).not.toBe(itNewsButton.find('svg').html())
    expect(itNewsButton.find('svg').html()).toContain('M15 2v2')
  })
})
