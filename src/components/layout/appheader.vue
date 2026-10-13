<template>
  <nav class="w-full border-b border-[#D1C9B8] bg-[#FAF8F5]">
    <div
      class="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-20 lg:py-6">
      <RouterLink :to="{ name: 'home' }" class="flex shrink-0 items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-md bg-[#121214]">
          <span class="font-['Crimson_Pro'] text-[22px] font-bold text-[#FAF8F5]">
            A
          </span>
        </div>

        <div class="flex flex-col gap-0.5">
          <span class="font-['Geist'] text-base font-bold text-[#121214] sm:text-lg">
            AksaraNusa
          </span>

          <span class="font-['Geist_Mono'] text-[9px] font-semibold uppercase text-[#8F897F] sm:text-[10px]">
            Type Foundry Indonesia
          </span>
        </div>
      </RouterLink>

      <div class="hidden items-center gap-6 lg:flex xl:gap-10">
        <RouterLink :to="{ name: 'home' }"
          class="font-['Geist'] text-[15px] font-medium text-[#524E48] transition-colors hover:text-[#121214]">
          Explorasi
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="font-['Geist'] text-[15px] font-medium text-[#524E48] transition-colors hover:text-[#121214]">
          Hasil Pencarian
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="font-['Geist'] text-[15px] font-medium text-[#524E48] transition-colors hover:text-[#121214]">
          Detail Font
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="font-['Geist'] text-[15px] font-medium text-[#524E48] transition-colors hover:text-[#121214]">
          Profil Desainer
        </RouterLink>
      </div>

      <div class="hidden shrink-0 items-center gap-4 lg:flex">
        <RouterLink :to="{ name: 'home' }"
          class="font-['Geist'] text-sm font-semibold text-[#121214] transition-opacity hover:opacity-70">
          Koleksi saya
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="flex items-center gap-2 rounded-md bg-[#121214] px-5 py-3 font-['Geist'] text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#383735]">
          Submit Karya

          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 3h7v7" />
            <path d="M10 14 21 3" />
            <path d="M21 14v7H3V3h7" />
          </svg>
        </RouterLink>
      </div>

      <button type="button"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#121214] transition-colors hover:bg-[#EDE8DF] lg:hidden"
        aria-label="Buka menu navigasi" :aria-expanded="isMenuOpen" @click="isMenuOpen = !isMenuOpen">
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="m18 6-12 12" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isMenuOpen" class="border-t border-[#D1C9B8] bg-[#FAF8F5] px-4 py-4 sm:px-6 lg:hidden">
      <div class="flex flex-col gap-1">
        <RouterLink :to="{ name: 'home' }"
          class="rounded-md px-4 py-3 font-['Geist'] text-sm font-medium text-[#524E48] transition-colors hover:bg-[#EDE8DF]"
          @click="isMenuOpen = false">
          Explorasi
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="rounded-md px-4 py-3 font-['Geist'] text-sm font-medium text-[#524E48] transition-colors hover:bg-[#EDE8DF]"
          @click="isMenuOpen = false">
          Hasil Pencarian
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="rounded-md px-4 py-3 font-['Geist'] text-sm font-medium text-[#524E48] transition-colors hover:bg-[#EDE8DF]"
          @click="isMenuOpen = false">
          Detail Font
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="rounded-md px-4 py-3 font-['Geist'] text-sm font-medium text-[#524E48] transition-colors hover:bg-[#EDE8DF]"
          @click="isMenuOpen = false">
          Profil Desainer
        </RouterLink>

        <div class="my-2 border-t border-[#D1C9B8]"></div>


        <RouterLink :to="{ name: 'home' }"
        class="rounded-md px-4 py-3 font-['Geist'] text-sm font-semibold text-[#121214] transition-colors hover:bg-[#EDE8DF]"
          @click="isMenuOpen = false">
          Koleksi Saya
        </RouterLink>

        <RouterLink :to="{ name: 'home' }"
          class="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#121214] px-5 py-3 font-['Geist'] text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#383735]"
          @click="isMenuOpen = false">
          Submit Karya

          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 3h7v7" />
            <path d="M10 14 21 3" />
            <path d="M21 14v7H3V3h7" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>