<template>
  <a
    :href="resource.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex flex-col gap-3"
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
        class="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
        :style="{ backgroundColor: resource.color }"
      >
        {{ resource.name.charAt(0) }}
      </div>
      <span class="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {{ resource.name }}
      </span>
    </div>

    <!-- Description -->
    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{{ resource.desc }}</p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1">
      <span
        v-for="tag in resource.tags"
        :key="tag"
        class="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
      >{{ tag }}</span>
    </div>

    <!-- URL hint -->
    <div class="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-auto group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
      <ExternalLink :size="11" />
      <span class="truncate">{{ displayUrl }}</span>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { ExternalLink, Star } from 'lucide-vue-next'

const props = defineProps({
  resource: { type: Object, required: true },
  isFav: { type: Boolean, default: false },
})
defineEmits(['toggleFav'])

const displayUrl = computed(() => {
  try {
    return new URL(props.resource.url).hostname
  } catch {
    return props.resource.url
  }
})
</script>
