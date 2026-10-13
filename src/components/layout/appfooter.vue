<template>
  <footer class="w-full bg-[#121214]">
    <div
      class="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 pb-8 pt-12 sm:gap-14 sm:px-6 sm:pb-10 sm:pt-16 lg:gap-[60px] lg:px-20 lg:pb-10 lg:pt-20">
      <!-- Main Footer Content -->
      <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <!-- Brand Information -->
        <div class="flex w-full flex-col gap-5 lg:max-w-[405px] lg:shrink-0">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-md bg-[#121214]">
              <span class="font-['Crimson_Pro'] text-[22px] font-bold text-[#FAF8F5]">
                A
              </span>
            </div>

            <span class="font-['Geist'] text-xl font-bold text-[#FAF8F5]">
              AksaraNusa
            </span>
          </div>

          <!-- Description -->
          <p class="font-['Geist'] text-[14px] font-normal leading-6 text-[#8F897F] sm:text-[15px]">
            Arsip digital inklusif yang mendokumentasikan, merayakan, dan
            mendistribusikan berkas rupa huruf (typeface) karya perupa huruf
            andal dari berbagai penjuru Nusantara.
          </p>
        </div>

        <!-- Footer Navigation Columns -->
        <div
          class="grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 sm:gap-10 lg:flex lg:items-start lg:justify-start lg:gap-10 xl:gap-20">
          <!-- Direktori -->
          <div class="flex flex-col gap-4 lg:w-40 lg:shrink-0">
            <h3 class="font-['Geist_Mono'] text-xs font-bold uppercase text-[#8F897F]">
              Direktori
            </h3>

            <ul class="flex flex-col gap-3">
              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Daftar Rupa Huruf
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Desainer Lokal
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Lisensi Aksara
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Kategori Budaya
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Sumber Daya -->
          <div class="flex flex-col gap-4 lg:w-40 lg:shrink-0">
            <h3 class="font-['Geist_Mono'] text-xs font-bold uppercase text-[#8F897F]">
              Sumber Daya
            </h3>

            <ul class="flex flex-col gap-3">
              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Pedoman Kontribusi
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Buku Panduan Tipografi
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Artikel Jurnal
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Wawancara Ekslusif
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Kerjasama -->
          <div class="flex flex-col gap-4 lg:w-40 lg:shrink-0">
            <h3 class="font-['Geist_Mono'] text-xs font-bold uppercase text-[#8F897F]">
              Kerjasama
            </h3>

            <ul class="flex flex-col gap-3">
              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Tentang Kami
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Kemitraan Studio
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Kontrak Redaksi
                </RouterLink>
              </li>

              <li>
                <RouterLink :to="{ name: 'home' }"
                  class="font-['Geist'] text-sm font-normal text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
                  Kebijakan Privasi
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div
        class="flex flex-col gap-6 border-t border-[#524E48] pt-6 sm:pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <!-- Copyright -->
        <p class="font-['Geist_Mono'] text-[10px] font-normal leading-5 text-[#8F897F] sm:text-xs">
          © 2026 AKSARANUSA ARCHIVE. DIKEMBANGKAN OLEH MAHASISWA INDONESIA.
        </p>

        <!-- Social Media -->
        <div class="flex items-center gap-5">
          <!-- Instagram -->
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            class="text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <path d="M17.5 6.5h.01" />
            </svg>
          </a>

          <!-- Twitter / X -->
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"
            class="text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M22 5.9c-.7.3-1.4.5-2.1.6a3.7 3.7 0 0 0 1.6-2 7.3 7.3 0 0 1-2.3.9 3.6 3.6 0 0 0-6.2 3.3A10.3 10.3 0 0 1 5.5 4.9a3.6 3.6 0 0 0 1.1 4.8 3.6 3.6 0 0 1-1.6-.4v.1a3.6 3.6 0 0 0 2.9 3.5 3.6 3.6 0 0 1-1.6.1 3.6 3.6 0 0 0 3.4 2.5A7.3 7.3 0 0 1 4.3 17a10.3 10.3 0 0 0 15.8-8.7v-.5A7.4 7.4 0 0 0 22 5.9Z" />
            </svg>
          </a>

          <!-- Website / Globe -->
          <a href="#" aria-label="Situs AksaraNusa" class="text-[#8F897F] transition-colors hover:text-[#FAF8F5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>