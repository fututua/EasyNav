<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">

    <!-- Sidebar: desktop in-flow, mobile fixed overlay -->
    <aside class="hidden md:flex md:shrink-0 md:w-56 md:flex-col bg-white dark:bg-gray-900 h-full">
      <Sidebar
        :active="activeCategory"
        :isDark="isDark"
        @select="selectCategory"
        @toggleDark="toggleDark"
      />
    </aside>

    <!-- Mobile sidebar: fixed overlay -->
    <aside
      v-if="sidebarOpen"
      class="fixed inset-y-0 left-0 z-40 w-56 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 md:hidden"
    >
      <Sidebar
        :active="activeCategory"
        :isDark="isDark"
        @select="selectCategory"
        @toggleDark="toggleDark"
      />
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Right panel: header + scrollable content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden border-l border-gray-200 dark:border-gray-800">
      <!-- Header sits physically at the top of the right panel -->
      <header class="shrink-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 flex items-center gap-4 transition-colors z-20">
        <!-- Hamburger (mobile only) -->
        <button
          class="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Toggle menu"
        >
          <Menu v-if="!sidebarOpen" :size="20" />
          <X v-else :size="20" />
        </button>

        <!-- Search bar -->
        <div class="flex-1 relative max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索资源..."
            class="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 rounded-lg border border-transparent focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none transition-colors"
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

        <span class="hidden sm:block text-xs text-gray-400 dark:text-gray-500 shrink-0">
          {{ filteredResources.length }} 个资源
        </span>
      </header>

      <!-- Scrollable content -->
      <main class="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <!-- Favorites view -->
        <template v-if="activeCategory === 'favs'">
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
            <div class="space-y-5">
            <div v-for="cat in categoriesWithItems" :key="cat.id">
              <h2
                :id="`section-${cat.id}`"
                class="text-base font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
              >
                <component :is="catIcons[cat.icon]" :size="16" class="text-indigo-500" />
                {{ cat.name }}
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
            <h1 :id="`section-${activeCategory}`" class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5">
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
import { ref, computed } from 'vue'
import { Menu, X, Search, SearchX, XCircle, Star, LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper } from 'lucide-vue-next'
import Sidebar from './components/Sidebar.vue'
import ResourceCard from './components/ResourceCard.vue'
import { categories, resources } from './data/resources.js'

const activeCategory = ref('all')
const sidebarOpen = ref(false)
const searchQuery = ref('')

const savedDark = localStorage.getItem('easynav-dark') === 'true'
const isDark = ref(savedDark)
if (savedDark) document.documentElement.classList.add('dark')

const favIds = ref(new Set(JSON.parse(localStorage.getItem('easynav-favs') || '[]')))

const catIcons = { LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper }

const currentCategoryName = computed(() =>
  categories.find(c => c.id === activeCategory.value)?.name ?? '全部'
)

const resourcesByCategory = computed(() => {
  const map = {}
  for (const r of resources) {
    if (!map[r.category]) map[r.category] = []
    map[r.category].push(r)
  }
  return map
})

const categoriesWithItems = computed(() =>
  categories.filter(c => c.id !== 'all' && resourcesByCategory.value[c.id]?.length)
)

const favResources = computed(() =>
  resources.filter(r => favIds.value.has(r.id))
)

const filteredResources = computed(() => {
  let list = activeCategory.value === 'all'
    ? resources
    : resources.filter(r => r.category === activeCategory.value)
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
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('easynav-dark', isDark.value)
}

function toggleFav(id) {
  const next = new Set(favIds.value)
  next.has(id) ? next.delete(id) : next.add(id)
  favIds.value = next
  localStorage.setItem('easynav-favs', JSON.stringify([...next]))
}

function selectCategory(id) {
  activeCategory.value = id
  sidebarOpen.value = false
  setTimeout(() => {
    const el = document.getElementById(`section-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}
</script>
