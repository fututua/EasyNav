<template>
  <a
    :href="resource.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative flex h-full flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_30px_-18px_rgba(79,70,229,0.18),0_2px_10px_-6px_rgba(15,23,42,0.08)] transition-transform duration-200 dark:border-white/10 dark:bg-gray-900/75 dark:shadow-none hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_18px_40px_-22px_rgba(79,70,229,0.24),0_6px_18px_-12px_rgba(15,23,42,0.1)] dark:hover:border-indigo-500/20 md:hover:scale-[1.02]"
    @click="recordClick(String(resource.id))"
  >
    <!-- Fav button -->
    <button
      @click.stop.prevent="$emit('toggleFav')"
      :class="[
        'absolute top-3 right-3 z-10 rounded-xl border border-slate-200/85 bg-white/96 p-1.5 shadow-sm backdrop-blur-sm sm:p-1 dark:border-transparent dark:bg-gray-900/80',
        isFav
          ? 'border-yellow-200 text-yellow-500 dark:border-yellow-400/20 dark:text-yellow-300'
          : 'text-gray-400 dark:text-gray-500 hover:border-yellow-200 hover:text-yellow-400 md:opacity-0 md:group-hover:opacity-100 dark:hover:border-yellow-400/20'
      ]"
      :aria-label="isFav ? '取消收藏' : '收藏'"
    >
      <Star :size="14" :fill="isFav ? 'currentColor' : 'none'" />
    </button>

    <!-- Icon + name -->
    <div class="flex items-center gap-3 pr-7">
      <div
        class="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-sm font-bold text-white shadow-inner ring-1 ring-black/5 dark:ring-white/10"
        :style="{ backgroundColor: iconStatus === 'color' ? resource.color : '#f3f4f6' }"
      >
        <!-- 空闲后才激活图标加载，淡入显示 -->
        <img
          v-if="iconReady && iconStatus !== 'color'"
          :src="faviconSrc"
          :alt="resource.name"
          class="absolute inset-0 m-auto w-6 h-6 object-contain transition-opacity duration-300"
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
      <div class="min-w-0">
        <span class="block truncate text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
          {{ resource.name }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm leading-6 text-gray-600 dark:text-gray-400 line-clamp-2">{{ resource.desc }}</p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      <span
        v-for="tag in resource.tags"
        :key="tag"
        class="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
      >{{ tag }}</span>
    </div>

    <!-- URL hint + click count -->
    <div class="mt-auto flex items-center gap-2 border-t border-slate-200/80 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-300">
      <ExternalLink :size="11" />
      <span class="min-w-0 truncate">{{ displayUrl }}</span>
      <span
        v-if="clickCount > 0"
        class="ml-auto flex shrink-0 items-center gap-1 text-[10px] font-semibold text-orange-600 dark:text-orange-400"
      >
        <TrendingUp :size="11" />
        {{ clickCount }}
      </span>
    </div>
  </a>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ExternalLink, Star, TrendingUp } from 'lucide-vue-next'
import { iconCache, saveIconCache } from '../iconCache.js'
import { clickCounts, recordClick } from '../clickStats.js'

const props = defineProps({
  resource: { type: Object, required: true },
  isFav: { type: Boolean, default: false },
})
defineEmits(['toggleFav'])

const hostname = computed(() => {
  try {
    return new URL(props.resource.url).hostname
  } catch (error) {
    console.warn('无效的 URL:', props.resource.url, error)
    return ''
  }
})

// 'origin' -> 'api' -> 'color'
const iconStatus = ref('color') // 首屏默认色块占位
const iconReady  = ref(false)   // 空闲后才激活 img 加载
const iconLoaded = ref(false)   // 图标加载完成后淡入

onMounted(() => {
  try {
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
  } catch (error) {
    console.error('图标加载初始化失败:', error)
    iconStatus.value = 'color'
  }
})

const faviconSrc = computed(() => {
  if (iconStatus.value === 'origin') return `https://${hostname.value}/favicon.ico`
  if (iconStatus.value === 'api')    return `https://favicon.splitbee.io/?url=${hostname.value}`
  return ''
})

function onIconError() {
  try {
    iconLoaded.value = false
    if (iconStatus.value === 'origin') {
      iconStatus.value = 'api'
    } else {
      iconStatus.value = 'color'
      if (hostname.value) saveIconCache(hostname.value, 'color')
    }
  } catch (error) {
    console.error('图标错误处理失败:', error)
    iconStatus.value = 'color'
  }
}

function onIconLoad() {
  try {
    iconLoaded.value = true
    if (hostname.value) saveIconCache(hostname.value, iconStatus.value)
  } catch (error) {
    console.error('图标加载成功处理失败:', error)
  }
}

const displayUrl = computed(() => hostname.value || props.resource.url)
const clickCount = computed(() => clickCounts[String(props.resource.id)] ?? 0)
</script>
