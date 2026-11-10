<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section>
    <p class="font-mono text-xs tracking-[0.16em] text-[#68686C]">ADMIN MANAGEMENT</p>
    <h1 class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
      {{ route.meta.title }}
    </h1>
    <p class="mt-2 max-w-2xl text-sm leading-6 text-[#68686C]">
      {{ route.meta.description }}
    </p>
    <div class="mt-7 rounded-lg border border-[#E2E2E4] bg-white p-5 sm:p-7">
      <p class="text-sm text-[#68686C]">Konten halaman ini akan ditambahkan pada tahap fitur berikutnya.</p>
    </div>
  </section>
</template>
