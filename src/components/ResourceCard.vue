<template>
  <a
    :href="resource.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:shadow-indigo-200/60 dark:hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-200 flex flex-col gap-3"
    :style="hovered ? 'will-change: transform' : ''"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Fav button -->
    <button
      @click.prevent="$emit('toggleFav')"
      :class="[
        'absolute top-3 right-3 p-1 rounded-md transition-colors',
        isFav
          ? 'text-yellow-400 hover:text-yellow-500'
          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
      ]"
      :aria-label="isFav ? '取消收藏' : '收藏'"
    >
      <Star :size="14" :fill="isFav ? 'currentColor' : 'none'" />
    </button>

    <!-- Icon + name -->
    <div class="flex items-center gap-3 pr-5">
      <div
        class="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden"
        :style="{ backgroundColor: iconStatus === 'color' ? resource.color : '#f3f4f6' }"
      >
        <!-- 空闲后才激活图标加载，淡入显示 -->
        <img
          v-if="iconReady && iconStatus !== 'color'"
          :src="faviconSrc"
          :alt="resource.name"
          class="w-6 h-6 object-contain transition-opacity duration-300"
          :class="iconLoaded ? 'opacity-100' : 'opacity-0'"
          loading="lazy"
          decoding="async"
          @load="onIconLoad"
          @error="onIconError"
        />
        <!-- 占位：色块首字母，图标加载成功后隐藏 -->
        <span
          v-if="!iconReady || iconStatus === 'color' || !iconLoaded"
          :style="{ color: iconStatus === 'color' ? '#fff' : resource.color }"
        >{{ resource.name.charAt(0) }}</span>
      </div>
      <span class="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {{ resource.name }}
      </span>
    </div>

    <!-- Description -->
    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{{ resource.desc }}</p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1">
      <span
        v-for="tag in resource.tags"
        :key="tag"
        class="px-1.5 py-0.5 text-[10px] rounded bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200"
      >{{ tag }}</span>
    </div>

    <!-- URL hint -->
    <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-auto group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
      <ExternalLink :size="11" />
      <span class="truncate">{{ displayUrl }}</span>
    </div>
  </a>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ExternalLink, Star } from 'lucide-vue-next'
import { iconCache } from '../iconCache.js'

const props = defineProps({
  resource: { type: Object, required: true },
  isFav: { type: Boolean, default: false },
})
defineEmits(['toggleFav'])

const hostname = computed(() => {
  try { return new URL(props.resource.url).hostname } catch { return '' }
})

// 'origin' -> 'api' -> 'color'
const iconStatus = ref('color') // 首屏默认色块占位
const iconReady  = ref(false)   // 空闲后才激活 img 加载
const iconLoaded = ref(false)   // 图标加载完成后淡入
const hovered    = ref(false)

onMounted(() => {
  const cached = hostname.value && iconCache[hostname.value]
  if (cached) {
    iconStatus.value = cached
    if (cached !== 'color') {
      iconReady.value  = true
      iconLoaded.value = true  // 缓存命中，直接显示无需淡入
    }
    return
  }
  // 空闲时再激活图标请求
  iconStatus.value = 'origin'
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
  schedule(() => { iconReady.value = true })
})

const faviconSrc = computed(() => {
  if (iconStatus.value === 'origin') return `https://${hostname.value}/favicon.ico`
  if (iconStatus.value === 'api')    return `https://favicon.splitbee.io/?url=${hostname.value}`
  return ''
})

function onIconError() {
  iconLoaded.value = false
  if (iconStatus.value === 'origin') {
    iconStatus.value = 'api'
  } else {
    iconStatus.value = 'color'
    if (hostname.value) iconCache[hostname.value] = 'color'
  }
}

function onIconLoad() {
  iconLoaded.value = true
  if (hostname.value) iconCache[hostname.value] = iconStatus.value
}

const displayUrl = computed(() => hostname.value || props.resource.url)
</script>
