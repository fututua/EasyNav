<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-full z-40 transition-all duration-300 flex flex-col',
      'w-56 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2 px-5 py-5 border-b border-gray-200 dark:border-gray-700">
      <Compass class="text-indigo-500 dark:text-indigo-400" :size="22" />
      <span class="text-lg font-bold tracking-wide">EasyNav</span>
    </div>

    <!-- Category list -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <button
        v-for="cat in allCategories"
        :key="cat.id"
        @click="$emit('select', cat.id)"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1',
          active === cat.id
            ? 'bg-indigo-600 text-white'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <component :is="icons[cat.icon]" :size="17" />
        {{ cat.name }}
      </button>
    </nav>

    <!-- Dark mode toggle -->
    <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="$emit('toggleDark')"
        class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Sun v-if="isDark" :size="16" />
        <Moon v-else :size="16" />
        <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
      </button>
    </div>

    <div class="px-5 py-3 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-700">
      © 2025 EasyNav
    </div>
  </aside>

  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black/50 md:hidden"
    @click="$emit('close')"
  />
</template>

<script setup>
import { computed } from 'vue'
import { Compass, LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper, Star, Sun, Moon } from 'lucide-vue-next'
import { categories } from '../data/resources.js'

defineProps({
  active: { type: String, default: 'all' },
  isOpen: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
})
defineEmits(['select', 'close', 'toggleDark'])

const icons = { LayoutGrid, Film, Wrench, Code2, Palette, Bot, Newspaper, Star }

const allCategories = computed(() => [
  ...categories,
  { id: 'favs', name: '我的收藏', icon: 'Star' },
])
</script>
