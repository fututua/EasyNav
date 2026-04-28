<template>
  <section id="section-it-news" class="mx-auto flex w-full max-w-4xl flex-col gap-6">
    <div
      v-if="status === 'loading'"
      class="rounded-[2rem] border border-dashed border-indigo-200 bg-white/75 p-6 text-gray-600 shadow-[0_18px_40px_-30px_rgba(79,70,229,0.28)] backdrop-blur-xl dark:border-indigo-400/20 dark:bg-gray-900/60 dark:text-gray-300 dark:shadow-none md:p-8"
    >
      <p class="text-lg font-semibold text-gray-900 dark:text-gray-50">正在获取 IT 新闻</p>
      <p class="mt-2 text-sm">稍等片刻，最新 IT 新闻会显示在这里。</p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="rounded-[2rem] border border-red-200 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(248,113,113,0.28)] backdrop-blur-xl dark:border-red-400/20 dark:bg-gray-900/60 dark:shadow-none md:p-8"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-50">IT 新闻加载失败</h2>
      <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {{ errorMessage || '当前无法获取 IT 新闻，请稍后重试。' }}
      </p>
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        @click="$emit('retry')"
      >
        重试
      </button>
    </div>

    <section
      v-else-if="status === 'success'"
      class="rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-[0_24px_60px_-32px_rgba(79,70,229,0.2)] backdrop-blur-2xl dark:border-white/10 dark:bg-gray-900/60 dark:shadow-none md:p-6"
    >
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-50">IT 新闻</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">点击展开可查看完整摘要，原文会在新标签页打开。</p>
        </div>
        <span
          v-if="items.length"
          class="shrink-0 rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-gray-300"
        >
          {{ items.length }} 条
        </span>
      </div>

      <div
        v-if="items.length"
        class="mt-5 flex flex-col gap-4"
      >
        <article
          v-for="(item, index) in items"
          :key="`${index}-${item.link || item.title}`"
          class="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/45"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-base font-semibold leading-7 text-gray-900 transition-colors hover:text-indigo-600 dark:text-gray-50 dark:hover:text-indigo-300"
              >
                {{ item.title }}
              </a>
              <p class="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                {{ item.created || '未知时间' }}
              </p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-200 hover:text-indigo-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-gray-200 dark:hover:border-indigo-400/20 dark:hover:text-indigo-300"
              @click="toggleExpanded(index)"
            >
              {{ isExpanded(index) ? '收起' : '展开' }}
            </button>
          </div>

          <p
            data-testid="it-news-description"
            :class="[
              'mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300',
              isExpanded(index) ? 'whitespace-pre-line' : 'line-clamp-2'
            ]"
          >
            {{ item.description }}
          </p>

          <a
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            阅读原文
          </a>
        </article>
      </div>

      <div
        v-else
        class="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-sm text-gray-500 dark:border-white/10 dark:bg-slate-950/35 dark:text-gray-400"
      >
        暂无 IT 新闻。
      </div>
    </section>

    <div
      v-else
      class="rounded-[2rem] border border-dashed border-slate-300 bg-white/75 p-6 text-sm text-gray-600 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-400 dark:shadow-none md:p-8"
    >
      暂无可展示的 IT 新闻。
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'idle',
  },
  items: {
    type: Array,
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

defineEmits(['retry'])

const expandedIndexes = ref(new Set())

watch(
  () => props.items,
  () => {
    expandedIndexes.value = new Set()
  },
  { deep: true },
)

function isExpanded(index) {
  return expandedIndexes.value.has(index)
}

function toggleExpanded(index) {
  const next = new Set(expandedIndexes.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  expandedIndexes.value = next
}
</script>
