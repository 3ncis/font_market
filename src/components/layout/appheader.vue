<template>
  <nav class="w-full border-b border-[#E2E2E4] bg-white">
    <div
      class="mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-[90px] lg:px-20">
      <RouterLink :to=" { name : 'home' } " class="flex shrink-0 items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-[#121214]">
          <span class="font-serif text-[22px] font-bold text-white">
            A
          </span>
        </div>

        <div class="flex flex-col gap-[3px]">
          <span class="text-lg font-bold leading-tight text-[#121214]">
            AksaraNusa
          </span>

          <span class="whitespace-nowrap font-mono text-[9px] font-normal tracking-wide text-[#68686C]">
            PERUPA HURUF INDONESIA
          </span>
        </div>
      </RouterLink>

      <div class="hidden items-center gap-7 lg:flex">
        <RouterLink :to=" { name : 'catalog' } " class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]">
          Eksplorasi
        </RouterLink>

        <RouterLink :to="{ name : 'home' }" class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]">
          Hasil Pencarian
        </RouterLink>

        <RouterLink :to="{ name : 'home' }" class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]">
          Detail Font
        </RouterLink>

        <RouterLink :to="{ name : 'home' }" class="text-sm font-normal text-[#68686C] transition-colors hover:text-[#121214]">
          Profil Desainer
        </RouterLink>
      </div>

      <div class="flex shrink-0 items-center gap-3 sm:gap-[18px]">
        <RouterLink :to="{ name : 'home' }"
          class="hidden text-[13px] font-normal text-[#68686C] transition-colors hover:text-[#121214] sm:block">
          Koleksi Saya
        </RouterLink>

        <RouterLink :to="{ name : 'home' }" aria-label="Keranjang belanja"
          class="relative flex h-9 w-9 items-center justify-center rounded-md text-[#121214] transition-colors hover:bg-[#FAF8F5]">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>

          <span
            class="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#121214] px-1 font-mono text-[10px] text-white">
            2
          </span>
        </RouterLink>

        <RouterLink :to="{ name : 'home' }"
          class="inline-flex items-center justify-center gap-2 rounded bg-[#121214] px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#343438] sm:px-4 sm:text-[13px]">
          <span class="whitespace-nowrap">Submit Karya</span>

          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 15V3" />
            <path d="m7 8 5-5 5 5" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>