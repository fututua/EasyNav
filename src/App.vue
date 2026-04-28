<template>
  <div class="flex min-h-screen min-h-dvh overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950 md:h-dvh md:min-h-0">

    <!-- 跳转到内容链接（无障碍访问） -->
    <a href="#main-content" class="skip-to-content">跳转到主内容</a>

    <!-- Sidebar: desktop in-flow, mobile fixed overlay -->
    <aside class="hidden bg-white dark:bg-gray-900 md:flex md:h-dvh md:w-56 md:shrink-0 md:flex-col md:overflow-hidden">
      <Sidebar
        class="h-full w-full overflow-hidden"
        :active="activeCategory"
        @select="selectCategory"
      />
    </aside>

    <!-- Mobile sidebar: fixed overlay -->
    <aside
      v-show="sidebarOpen"
      class="fixed inset-y-0 left-0 z-40 flex h-dvh w-[min(18rem,85vw)] max-w-full flex-col overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 md:hidden"
    >
      <Sidebar
        :active="activeCategory"
        @select="selectCategory"
      />
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Right panel: header + scrollable content -->
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden border-gray-200 dark:border-gray-800 md:h-dvh md:border-l">
      <!-- Header sits physically at the top of the right panel -->
      <header class="z-20 flex shrink-0 items-center gap-2 border-b border-white/45 bg-white/45 px-3 py-3 shadow-[0_14px_40px_-28px_rgba(79,70,229,0.45)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/38 dark:border-white/10 dark:bg-gray-900/35 dark:shadow-none dark:supports-[backdrop-filter]:bg-gray-900/28 sm:gap-3 md:h-16 md:gap-4 md:px-6 md:py-0">
        <!-- Hamburger (mobile only) -->
        <button
          class="md:hidden shrink-0 rounded-xl border border-transparent bg-white/35 p-1.5 text-gray-700 transition-colors hover:bg-white/55 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Toggle menu"
        >
          <Menu v-if="!sidebarOpen" :size="20" />
          <X v-else :size="20" />
        </button>

        <div
          v-if="isSpecialView"
          class="flex min-w-0 flex-1 items-center gap-3 rounded-[1.35rem] border border-white/45 bg-white/38 px-4 py-2.5 text-sm text-gray-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
        >
          <component :is="specialViewIcon" :size="16" class="shrink-0 text-indigo-500 dark:text-indigo-300" />
          <div class="min-w-0">
            <p class="truncate font-medium">{{ specialViewTitle }}</p>
            <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ specialViewDescription }}</p>
          </div>
        </div>

        <!-- Search bar -->
        <div
          v-else
          class="relative max-w-md min-w-0 flex-1 rounded-[1.15rem] dark:border dark:border-slate-600 dark:bg-slate-950 dark:p-[1px] dark:shadow-[0_10px_24px_-18px_rgba(0,0,0,0.7)]"
        >
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-500" :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索资源..."
            class="w-full rounded-2xl border border-white/55 bg-white/55 py-2.5 pl-9 pr-8 text-sm text-gray-700 shadow-[0_10px_30px_-18px_rgba(79,70,229,0.45)] outline-none ring-0 backdrop-blur-xl backdrop-saturate-150 placeholder:text-gray-500 focus:border-white/70 focus:bg-white/62 focus:ring-4 focus:ring-white/25 dark:border-slate-700 dark:bg-black dark:text-gray-100 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] dark:placeholder:text-gray-500 dark:focus:border-slate-500 dark:focus:bg-black dark:focus:ring-slate-500/20"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="清除搜索"
          >
            <XCircle :size="15" />
          </button>
        </div>

        <span
          v-if="!isSpecialView"
          class="hidden shrink-0 rounded-full border border-white/45 bg-white/35 px-2.5 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-indigo-300 sm:block"
        >
          {{ filteredResources.length }} 个资源
        </span>

        <div class="ml-auto flex shrink-0 items-center gap-2">
          <!-- Toggle wall resources button -->
          <div v-if="!isSpecialView" class="group relative">
            <button
              @click="toggleWallResources"
              :aria-label="showWallResources ? '隐藏墙' : '显示墙'"
              :title="showWallResources ? '隐藏墙' : '显示墙'"
              class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/45 bg-white/40 text-gray-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white/55 active:scale-[0.98] focus:outline-none dark:border-white/10 dark:bg-white/7 dark:text-gray-300 dark:hover:bg-white/12 sm:h-10 sm:w-10"
            >
              <Eye v-if="showWallResources" :size="17" />
              <EyeOff v-else :size="17" />
            </button>
            <div class="pointer-events-none absolute right-0 top-[calc(100%+0.55rem)] z-30 hidden whitespace-nowrap rounded-xl border border-white/45 bg-white/88 px-2.5 py-1.5 text-xs font-medium text-gray-700 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-gray-900/88 dark:text-gray-200 md:block">
              {{ showWallResources ? '隐藏墙' : '显示墙' }}
            </div>
          </div>

          <!-- Dark mode toggle -->
          <div class="group relative">
            <button
              @click="toggleDark"
              :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
              :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
              class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/45 bg-white/40 text-gray-700 shadow-sm backdrop-blur-md transition-colors hover:bg-white/55 active:scale-[0.98] focus:outline-none dark:border-white/10 dark:bg-white/7 dark:text-gray-300 dark:hover:bg-white/12 sm:h-10 sm:w-10"
            >
              <Sun v-if="isDark" :size="17" />
              <Moon v-else :size="17" />
            </button>
            <div class="pointer-events-none absolute right-0 top-[calc(100%+0.55rem)] z-30 hidden whitespace-nowrap rounded-xl border border-white/45 bg-white/88 px-2.5 py-1.5 text-xs font-medium text-gray-700 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-gray-900/88 dark:text-gray-200 md:block">
              {{ isDark ? '切换到浅色模式' : '切换到深色模式' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable content -->
      <main id="main-content" class="flex-1 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6 md:px-6 md:py-8" role="main">
        <template v-if="isSixtyNewsView">
          <News60sPanel
            :status="newsStatus"
            :news-data="newsData"
            :error-message="newsErrorMessage"
            @retry="loadSixtyNews"
          />
        </template>
        <template v-else-if="isItNewsView">
          <ItNewsPanel
            :status="itNewsStatus"
            :items="itNews"
            :error-message="itNewsErrorMessage"
            @retry="loadItNews"
          />
        </template>

        <!-- Favorites view -->
        <template v-else-if="activeCategory === 'favs'">
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
            <Star :size="18" class="text-yellow-400" /> 我的收藏
          </h1>
          <div v-if="favResources.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <ResourceCard
              v-for="res in favResources" :key="res.id"
              :resource="res" :isFav="true"
              @toggleFav="toggleFav(res.id)"
            />
          </div>
          <div v-else class="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
            <Star :size="48" class="mb-4 opacity-30" />
            <p class="text-sm">还没有收藏，点击卡片上的 ★ 添加</p>
          </div>
        </template>

        <!-- Search results -->
        <template v-else-if="searchQuery">
          <h1 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5">
            搜索结果
            <span class="text-sm font-normal text-gray-400 ml-2">"{{ searchQuery }}"</span>
          </h1>
          <div v-if="filteredResources.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <ResourceCard
              v-for="res in filteredResources" :key="res.id"
              :resource="res" :isFav="favIds.has(res.id)"
              @toggleFav="toggleFav(res.id)"
            />
          </div>
          <div v-else class="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
            <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
              <SearchX :size="36" class="opacity-60" />
            </div>
            <p class="text-base font-medium text-gray-500 dark:text-gray-400 mb-1">没有找到相关资源</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">试试其他关键词，或
              <button @click="searchQuery = ''" class="text-indigo-500 hover:underline">清除搜索</button>
            </p>
          </div>
        </template>

        <!-- Browse by category -->
        <template v-else>
          <template v-if="activeCategory === 'all'">
            <div class="space-y-8 md:space-y-10">
            <div v-for="cat in categoriesWithItems" :key="cat.id">
              <h2
                :id="`section-${cat.id}`"
                class="mb-4 flex items-center gap-3 text-base font-semibold text-gray-800 dark:text-gray-100"
              >
                <span class="h-5 w-1 rounded-full bg-indigo-500"></span>
                <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-indigo-500 shadow-sm ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
                  <component :is="catIcons[cat.icon]" :size="16" />
                </span>
                <span>{{ cat.name }}</span>
                <span class="ml-auto hidden h-px flex-1 rounded-full bg-gradient-to-r from-indigo-100 to-transparent dark:from-indigo-500/20 dark:to-transparent sm:block"></span>
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                <ResourceCard
                  v-for="res in resourcesByCategory[cat.id]" :key="res.id"
                  :resource="res" :isFav="favIds.has(res.id)"
                  @toggleFav="toggleFav(res.id)"
                />
              </div>
            </div>
            </div>
          </template>
          <template v-else>
            <h1 :id="`section-${activeCategory}`" class="mb-6 flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
              <span class="h-6 w-1 rounded-full bg-indigo-500"></span>
              {{ currentCategoryName }}
            </h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              <ResourceCard
                v-for="res in filteredResources" :key="res.id"
                :resource="res" :isFav="favIds.has(res.id)"
                @toggleFav="toggleFav(res.id)"
              />
            </div>
          </template>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Menu, X, Search, SearchX, XCircle, Star, LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper, Cpu, Sun, Moon, Gift, Eye, EyeOff } from 'lucide-vue-next'
import Sidebar from './components/Sidebar.vue'
import ResourceCard from './components/ResourceCard.vue'
import News60sPanel from './components/News60sPanel.vue'
import ItNewsPanel from './components/ItNewsPanel.vue'
import { categories, resources } from './data/resources.js'
import { loadStats } from './clickStats.js'
import { fetchItNews, fetchSixtyNews, IT_NEWS_CATEGORY_ID, SIXTY_NEWS_CATEGORY_ID } from './news60s.js'
import { getItem, setItem, getJSON, setJSON } from './utils/storage.js'

const activeCategory = ref('all')
const sidebarOpen = ref(false)
const searchQuery = ref('')
const newsStatus = ref('idle')
const newsData = ref(null)
const newsErrorMessage = ref('')
const itNewsStatus = ref('idle')
const itNews = ref([])
const itNewsErrorMessage = ref('')

// 后台静默加载统计数据，不阻塞页面渲染
onMounted(() => {
  loadStats().catch(error => {
    console.error('加载统计数据失败:', error)
  })
})

const savedDark = getItem('easynav-dark') === 'true'
const isDark = ref(savedDark)
if (savedDark) document.documentElement.classList.add('dark')

const showWallResources = ref(getItem('easynav-show-wall') !== 'false')

function loadFavIds() {
  try {
    const saved = getJSON('easynav-favs', [])
    return new Set(Array.isArray(saved) ? saved : [])
  } catch (error) {
    console.error('加载收藏失败:', error)
    return new Set()
  }
}

const favIds = ref(loadFavIds())
const isSixtyNewsView = computed(() => activeCategory.value === SIXTY_NEWS_CATEGORY_ID)
const isItNewsView = computed(() => activeCategory.value === IT_NEWS_CATEGORY_ID)
const isSpecialView = computed(() => isSixtyNewsView.value || isItNewsView.value)
const specialViewIcon = computed(() => (isItNewsView.value ? Cpu : Newspaper))
const specialViewTitle = computed(() => {
  if (isSixtyNewsView.value) return '60s 看世界'
  if (isItNewsView.value) return 'IT新闻'
  return ''
})
const specialViewDescription = computed(() => {
  if (isSixtyNewsView.value) return '点击侧边栏时拉取最新新闻图片'
  if (isItNewsView.value) return '点击侧边栏时拉取最新 IT 新闻列表'
  return ''
})

const catIcons = { LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper, Gift }

const currentCategoryName = computed(() =>
  categories.find(c => c.id === activeCategory.value)?.name ?? '全部'
)

const resourcesByCategory = computed(() => {
  const map = {}
  // 先过滤资源
  let list = resources
  if (!showWallResources.value) {
    list = list.filter(r => !r.tags.includes('墙'))
  }
  // 再按分类分组
  for (const r of list) {
    if (!map[r.category]) map[r.category] = []
    map[r.category].push(r)
  }
  return map
})

const categoriesWithItems = computed(() =>
  categories.filter(c => c.id !== 'all' && resourcesByCategory.value[c.id]?.length)
)

const favResources = computed(() => {
  let list = resources.filter(r => favIds.value.has(r.id))
  // 过滤带"墙"标签的资源
  if (!showWallResources.value) {
    list = list.filter(r => !r.tags.includes('墙'))
  }
  return list
})

const filteredResources = computed(() => {
  let list = activeCategory.value === 'all'
    ? resources
    : resources.filter(r => r.category === activeCategory.value)

  // 过滤带"墙"标签的资源
  if (!showWallResources.value) {
    list = list.filter(r => !r.tags.includes('墙'))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  return list
})

function toggleDark() {
  try {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    setItem('easynav-dark', isDark.value)
  } catch (error) {
    console.error('切换深色模式失败:', error)
  }
}

function toggleWallResources() {
  try {
    showWallResources.value = !showWallResources.value
    setItem('easynav-show-wall', showWallResources.value)
  } catch (error) {
    console.error('切换墙资源显示失败:', error)
  }
}

function toggleFav(id) {
  try {
    const next = new Set(favIds.value)
    next.has(id) ? next.delete(id) : next.add(id)
    favIds.value = next
    setJSON('easynav-favs', [...next])
  } catch (error) {
    console.error('切换收藏失败:', error)
  }
}

async function loadSixtyNews() {
  newsStatus.value = 'loading'
  newsErrorMessage.value = ''
  try {
    newsData.value = await fetchSixtyNews()
    newsStatus.value = 'success'
  } catch (error) {
    console.error('加载 60s 看世界失败:', error)
    newsData.value = null
    newsErrorMessage.value = error instanceof Error ? error.message : '当前无法获取 60s 看世界内容'
    newsStatus.value = 'error'
  }
}

async function loadItNews() {
  itNewsStatus.value = 'loading'
  itNewsErrorMessage.value = ''
  try {
    itNews.value = await fetchItNews()
    itNewsStatus.value = 'success'
  } catch (error) {
    console.error('加载 IT 新闻失败:', error)
    itNews.value = []
    itNewsErrorMessage.value = error instanceof Error ? error.message : '当前无法获取 IT 新闻'
    itNewsStatus.value = 'error'
  }
}

async function selectCategory(id) {
  activeCategory.value = id
  sidebarOpen.value = false
  if (id === SIXTY_NEWS_CATEGORY_ID) {
    await loadSixtyNews()
  }
  if (id === IT_NEWS_CATEGORY_ID) {
    await loadItNews()
  }
  await nextTick()
  const el = document.getElementById(`section-${id}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
