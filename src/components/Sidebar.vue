<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden border-r border-white/35 bg-white/40 shadow-[0_18px_45px_-32px_rgba(79,70,229,0.35)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-gray-900/30 dark:shadow-none">
    <div class="px-5 pb-5 pt-6">
      <div class="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-500 to-violet-500 px-3.5 py-3 text-white shadow-lg shadow-indigo-500/20">
        <div class="flex h-9 w-9 items-center justify-center rounded-[1.35rem] bg-white/15 backdrop-blur">
          <Compass class="text-white" :size="20" />
        </div>
        <div class="min-w-0">
          <div class="text-[1.02rem] font-bold tracking-[0.01em]">EasyNav</div>
          <div class="text-[11px] text-indigo-100/90">精选资源一站直达</div>
        </div>
      </div>
    </div>

    <nav ref="navRef" class="flex-1 overflow-y-auto px-3 pb-5 pt-4 md:overflow-y-hidden">
      <div class="mb-5 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400 dark:text-gray-600">
        分类导航
      </div>
      <div class="relative">
        <span
          class="pointer-events-none absolute left-0 right-0 z-0 rounded-xl border border-indigo-300/85 bg-gradient-to-r from-indigo-100 via-white to-indigo-50/90 shadow-[0_18px_34px_-18px_rgba(79,70,229,0.42)] ring-1 ring-indigo-200/70 backdrop-blur-md transition-all duration-300 ease-out dark:border-indigo-400/22 dark:bg-gradient-to-r dark:from-slate-700/95 dark:via-slate-800/92 dark:to-slate-950/96 dark:ring-1 dark:ring-white/10 dark:shadow-[0_18px_34px_-20px_rgba(15,23,42,0.8)]"
          :style="activeHighlightStyle"
        />
        <button
          v-for="cat in allCategories"
          :key="cat.id"
          :ref="el => setCategoryRef(cat.id, el)"
          :class="[
            'group relative z-10 mb-2 flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out',
            active === cat.id
              ? 'border-transparent bg-transparent font-semibold text-indigo-950 dark:text-white'
              : 'border-transparent text-gray-600 hover:border-white/35 hover:bg-white/30 hover:text-gray-900 dark:text-gray-500 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-gray-100',
          ]"
          @click="$emit('select', cat.id)"
        >
          <span
            :class="[
              'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.95rem] transition-all duration-300 ease-out',
              active === cat.id
                ? 'bg-white text-indigo-700 shadow-[0_12px_24px_-14px_rgba(79,70,229,0.4)] ring-1 ring-indigo-300/80 backdrop-blur-md dark:bg-slate-100 dark:text-indigo-500 dark:ring-indigo-300/35'
                : 'bg-white/35 text-gray-500 backdrop-blur-sm dark:bg-white/5 dark:text-gray-500',
            ]"
          >
            <component :is="icons[cat.icon]" :size="17" />
          </span>
          <span
            class="relative z-10 flex-1 text-left text-[0.95rem] transition-colors duration-300"
            :class="active === cat.id ? 'tracking-[0.01em]' : ''"
          >
            {{ cat.name }}
          </span>
        </button>
      </div>
    </nav>

    <div class="border-t border-white/20 px-5 py-3.5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-600">
      © 2025 EasyNav
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Bot, Code2, Compass, Cpu, Film, Gift, LayoutGrid, Newspaper, Palette, Star, Wrench } from 'lucide-vue-next'
import { categories } from '../data/resources.js'
import { IT_NEWS_CATEGORY_ID, SIXTY_NEWS_CATEGORY_ID } from '../news60s.js'

const props = defineProps({
  active: { type: String, default: 'all' },
})

defineEmits(['select'])

const icons = { LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper, Cpu, Star, Gift }

const allCategories = computed(() => [
  ...categories,
  { id: SIXTY_NEWS_CATEGORY_ID, name: '60s看世界', icon: 'Newspaper' },
  { id: IT_NEWS_CATEGORY_ID, name: 'IT新闻', icon: 'Cpu' },
  { id: 'favs', name: '我的收藏', icon: 'Star' },
])

const navRef = ref(null)
const categoryRefs = new Map()
const activeHighlightStyle = ref({ opacity: 0, transform: 'translateY(0px)' })

function setCategoryRef(id, el) {
  if (el) categoryRefs.set(id, el)
  else categoryRefs.delete(id)
}

async function updateHighlight() {
  try {
    await nextTick()
    const navEl = navRef.value
    const activeEl = categoryRefs.get(props.active)
    if (!navEl || !activeEl) {
      activeHighlightStyle.value = { opacity: 0, transform: 'translateY(0px)' }
      return
    }

    const top = activeEl.offsetTop
    const height = activeEl.offsetHeight
    activeHighlightStyle.value = {
      opacity: 1,
      transform: `translateY(${top}px)`,
      height: `${height}px`,
    }
  } catch (error) {
    console.error('更新高亮失败:', error)
  }
}

watch(() => props.active, updateHighlight, { immediate: true })

onMounted(() => {
  updateHighlight()
  window.addEventListener('resize', updateHighlight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHighlight)
})
</script>
