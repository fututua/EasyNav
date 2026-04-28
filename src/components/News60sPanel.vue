<template>
  <section id="section-sixty-news" class="mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-7">
    <div
      v-if="status === 'loading'"
      class="rounded-[2rem] border border-dashed border-indigo-200 bg-white/75 p-6 text-gray-600 shadow-[0_18px_40px_-30px_rgba(79,70,229,0.28)] backdrop-blur-xl dark:border-indigo-400/20 dark:bg-gray-900/60 dark:text-gray-300 dark:shadow-none md:p-8"
    >
      <p class="text-lg font-semibold text-gray-900 dark:text-gray-50">正在获取今日 60s 看世界</p>
      <p class="mt-2 text-sm">稍等片刻，最新图片和新闻摘要会显示在这里。</p>
    </div>

    <div
      v-else-if="status === 'error'"
      class="rounded-[2rem] border border-red-200 bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(248,113,113,0.28)] backdrop-blur-xl dark:border-red-400/20 dark:bg-gray-900/60 dark:shadow-none md:p-8"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-50">新闻加载失败</h2>
      <p class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {{ errorMessage || '当前无法获取 60s 看世界内容，请稍后重试。' }}
      </p>
      <button
        class="mt-5 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600"
        @click="$emit('retry')"
      >
        重试
      </button>
    </div>

    <div
      v-else-if="status === 'success' && newsData"
      class="mx-auto flex w-full max-w-4xl flex-col gap-6"
    >
      <article class="overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-[0_24px_60px_-32px_rgba(79,70,229,0.28)] backdrop-blur-2xl dark:border-white/10 dark:bg-gray-900/60 dark:shadow-none">
        <div
          v-if="newsData.image"
          class="border-b border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-slate-950/70"
        >
          <img
            :src="newsData.image"
            alt="今日 60s 看世界图片"
            class="block h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
        <div v-else class="flex min-h-56 items-center justify-center bg-slate-100 text-sm text-gray-500 dark:bg-slate-950/70 dark:text-gray-400">
          今日图片暂不可用
        </div>
      </article>
    </div>

    <div
      v-else
      class="rounded-[2rem] border border-dashed border-slate-300 bg-white/75 p-6 text-sm text-gray-600 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-400 dark:shadow-none md:p-8"
    >
      暂无可展示的新闻内容。
    </div>
  </section>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'idle',
  },
  newsData: {
    type: Object,
    default: null,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

defineEmits(['retry'])
</script>
