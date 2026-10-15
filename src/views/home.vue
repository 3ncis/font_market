<template>
  <MainLayout>
    <div class="flex flex-col gap-10">
      <section class="w-full bg-[#FAF8F5] px-4 py-16 sm:px-6 sm:py-20 lg:px-20 lg:py-24">
        <div class="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 sm:gap-10">
          <div class="flex w-full max-w-[800px] flex-col items-center gap-4">
            <div class="inline-flex items-center gap-2">
              <div class="h-px w-6 bg-[#121214]"></div>
              <span class="font-mono text-xs font-bold tracking-[0.24px] text-[#121214]">
                ARSIP TIPOGRAFI NUSANTARA
              </span>
            </div>
            <h1
              class="w-full text-center font-serif text-4xl font-extrabold leading-tight tracking-tight text-[#121214] sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.1]">
              Temukan Rupa Huruf Berkarakter Lokal Indonesia
            </h1>
            <p class="w-full text-center text-base leading-relaxed text-[#8F897F] sm:text-lg sm:leading-[1.6]">
              AksaraNusa mengurasi rupa huruf premium dan gratis karya anak bangsa.
              Dari aksara adaptasi ragam hias hingga display modern untuk kebutuhan
              komersial Anda.
            </p>
          </div>
          <form
            class="flex w-full max-w-[720px] flex-col gap-3 rounded-xl border border-[#D1C9B8] bg-white p-3 sm:flex-row sm:items-center sm:gap-4 sm:py-2 sm:pl-5"
            @submit.prevent="handleSearch">
            <div class="flex min-w-0 flex-1 items-center gap-3 px-1 sm:px-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                class="h-5 w-5 shrink-0 text-[#8F897F] sm:h-6 sm:w-6" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
              <input v-model="searchQuery" type="search" placeholder="Cari nama font, desainer, atau gaya rupa..."
                aria-label="Cari font"
                class="w-full min-w-0 border-0 bg-transparent py-2 text-sm text-[#121214] outline-none placeholder:text-[#8F897F] focus:ring-0 sm:text-base" />
            </div>
            <button type="submit"
              class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#121214] px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121214] sm:py-3">
              Temukan
            </button>
          </form>
          <div class="flex w-full max-w-[720px] flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span class="mr-1 font-mono text-xs font-normal tracking-wide text-[#8F897F]">
              POPULER:
            </span>
            <button v-for="tag in popularTags" :key="tag" type="button"
              class="rounded-full border border-[#D1C9B8] bg-white px-3 py-1.5 text-xs text-[#121214] transition-colors duration-200 hover:border-[#121214] hover:bg-[#121214] hover:text-white sm:text-sm"
              @click="selectTag(tag)">
              {{ tag }}
            </button>
          </div>
        </div>
      </section>
      <section class="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
        <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="flex flex-col items-start gap-2">
              <div class="inline-flex items-center gap-2">
                <div class="h-px w-6 bg-[#121214]"></div>
                <span class="font-mono text-xs font-bold tracking-[0.24px] text-[#121214]">
                  KATEGORI KLASIFIKASI
                </span>
              </div>
              <h2 class="font-serif text-3xl font-bold text-[#121214] sm:text-4xl">
                Telusuri Ragam Rupa Huruf
              </h2>
            </div>
            <RouterLink :to="{ name: 'home' }"
              class="w-fit text-sm font-semibold text-[#121214] transition-colors hover:text-[#8F897F]">
              Lihat Semua Gaya →
            </RouterLink>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <RouterLink :to="{ name: 'home' }"
              class="group flex items-center gap-4 rounded-lg border border-[#D1C9B8] bg-white p-5 transition-colors duration-200 hover:border-[#121214] sm:p-6">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#D1C9B8] bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                  class="h-6 w-6 text-[#121214]" aria-hidden="true">
                  <path d="M4 7V4h16v3" />
                  <path d="M9 20h6" />
                  <path d="M12 4v16" />
                </svg>
              </div>

              <div class="flex min-w-0 flex-col gap-1">
                <h3 class="text-sm font-bold text-[#121214] sm:text-base">
                  Serif Tradisional
                </h3>
                <p class="font-mono text-xs text-[#8F897F]">
                  34 Font
                </p>
              </div>
            </RouterLink>
            <RouterLink :to="{ name: 'home' }"
              class="group flex items-center gap-4 rounded-lg border border-[#D1C9B8] bg-white p-5 transition-colors duration-200 hover:border-[#121214] sm:p-6">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#D1C9B8] bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                  class="h-6 w-6 text-[#121214]" aria-hidden="true">
                  <path d="M5 20 12 4l7 16" />
                  <path d="M8 14h8" />
                </svg>
              </div>

              <div class="flex min-w-0 flex-col gap-1">
                <h3 class="text-sm font-bold text-[#121214] sm:text-base">
                  Sans Serif Modern
                </h3>
                <p class="font-mono text-xs text-[#8F897F]">
                  48 Font
                </p>
              </div>
            </RouterLink>
            <RouterLink :to="{ name: 'home' }"
              class="group flex items-center gap-4 rounded-lg border border-[#D1C9B8] bg-white p-5 transition-colors duration-200 hover:border-[#121214] sm:p-6">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#D1C9B8] bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                  class="h-6 w-6 text-[#121214]" aria-hidden="true">
                  <path d="M4 7h16" />
                  <path d="M7 7v10a3 3 0 0 0 6 0V7" />
                  <path d="M13 12h4a3 3 0 0 1 0 6h-4" />
                </svg>
              </div>

              <div class="flex min-w-0 flex-col gap-1">
                <h3 class="text-sm font-bold text-[#121214] sm:text-base">
                  Sanskerta &amp; Aksara
                </h3>
                <p class="font-mono text-xs text-[#8F897F]">
                  12 Font
                </p>
              </div>
            </RouterLink>
            <RouterLink :to="{ name: 'home' }"
              class="group flex items-center gap-4 rounded-lg border border-[#D1C9B8] bg-white p-5 transition-colors duration-200 hover:border-[#121214] sm:p-6">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#D1C9B8] bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                  class="h-6 w-6 text-[#121214]" aria-hidden="true">
                  <path d="M4 5h16" />
                  <path d="M12 5v14" />
                  <path d="M8 19h8" />
                  <path d="M7 9h10" />
                </svg>
              </div>

              <div class="flex min-w-0 flex-col gap-1">
                <h3 class="text-sm font-bold text-[#121214] sm:text-base">
                  Display Ekspresif
                </h3>
                <p class="font-mono text-xs text-[#8F897F]">
                  29 Font
                </p>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>
      <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-6">
            <label class="block text-xs font-medium text-gray-500 mb-1">Tes Ketik Teks Anda</label>
            <BaseInput :type="text" :modelValue="customText" placeholder="Ketik teks di sini.."
              @update:modelValue="customText = $event" />
            <!-- <input
            v-model="customText"
            type="text"
            placeholder="Ketik teks di sini..."
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          /> -->
          </div>
          <div class="md:col-span-3">
            <div class="flex justify-between items-center mb-1">
              <label class="text-xs font-medium text-gray-500">Ukuran Text</label>
              <span class="text-xs font-bold text-gray-700">{{ fontSize }}px</span>
            </div>
            <input v-model="fontSize" type="range" min="16" max="64" class="w-full accent-violet-600 cursor-pointer" />
          </div>
          <div class="md:col-span-3">
            <label class="block text-xs font-medium text-gray-500 mb-1">Cari Font</label>
            <input v-model="searchQuery" type="text" placeholder="Cari nama font / designer..."
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
          </div>
        </div>
        <div class="flex items-center gap-2 pt-2 overflow-x-auto border-t border-gray-100">
          <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat" :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap',
            selectedCategory === cat
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]">
            {{ cat }}
          </button>
        </div>
      </section>
      <section>
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="n in 4" :key="n" class="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>
        <div v-else-if="filteredFonts.length === 0"
          class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <p class="text-gray-500 text-sm">Tidak ada font yang cocok dengan pencarianmu.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="font in filteredFonts" :key="font.id"
            class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h2 class="text-xl font-bold text-gray-900 group-hover:text-violet-600 transition">
                    {{ font.name }}
                  </h2>
                  <p class="text-xs text-gray-400">by {{ font.designer }}</p>
                </div>
                <span class="text-xs font-semibold px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg">
                  {{ font.category }}
                </span>
              </div>

              <div class="my-6 min-h-[100px] flex items-center border-y border-gray-50 py-4 overflow-hidden">
                <p class="text-gray-900 font-normal leading-tight transition-all duration-150 w-full truncate"
                  :style="{ fontSize: fontSize + 'px' }">
                  {{ customText || font.previewText }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <div>
                <span class="text-xs text-gray-400 block">Mulai dari</span>
                <span class="text-lg font-bold text-gray-900">
                  {{ font.price === 0 ? 'Gratis' : '$' + font.price }}
                </span>
              </div>
              <!-- :to="{ name: 'font-detail', params: { id: font.id } }" -->
              <div class="flex gap-3">
                <BaseButton type="click" variant="danger" size="md">
                  Cancel
                </BaseButton>
                <BaseButton type="click" variant="secondary" size="md">
                  Submit
                </BaseButton>
              </div>
              <!-- <RouterLink
              class="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-violet-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Lihat Detail
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </RouterLink> -->
            </div>
          </div>
        </div>
      </section>
      <section class="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
        <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-8 sm:gap-10">
          <div class="flex flex-col items-start gap-2">
            <div class="inline-flex items-center gap-2">
              <div class="h-px w-6 bg-[#121214]"></div>
              <span class="font-mono text-xs font-bold tracking-[0.24px] text-[#121214]">
                TALENTA LOKAL NUSANTARA
              </span>
            </div>
            <h2 class="font-serif text-3xl font-bold text-[#121214] sm:text-4xl">
              Kenali Para Perupa Huruf
            </h2>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <RouterLink :to=" { name : 'home' } ">
              <div
                class="flex flex-col items-center gap-5 rounded-xl border border-[#D1C9B8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <img :src="profile1 " alt="Foto profil Alifia Zahra" loading="lazy"
                  class="h-[120px] w-[120px] rounded-full border border-[#D1C9B8] object-cover" />

                <div class="flex w-full flex-col items-center gap-1 text-center">
                  <h3 class="font-serif text-xl font-bold text-[#121214]">
                    Alifia Zahra
                  </h3>

                  <p class="text-[13px] text-[#524E48]">
                    Studio Jagat · Yogyakarta
                  </p>
                </div>

                <div class="h-px w-10 bg-[#D1C9B8]"></div>

                <span class="text-center font-mono text-xs font-semibold tracking-wide text-[#8F897F]">
                  6 RUPA HURUF PUBLISHED
                </span>
              </div>
            </RouterLink>
            <RouterLink :to=" { name : 'home' } ">
              <div
              class="flex flex-col items-center gap-5 rounded-xl border border-[#D1C9B8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <img :src="profile2" alt="Foto profil Fardan Pangestu" loading="lazy"
                class="h-[120px] w-[120px] rounded-full border border-[#D1C9B8] object-cover" />

              <div class="flex w-full flex-col items-center gap-1 text-center">
                <h3 class="font-serif text-xl font-bold text-[#121214]">
                  Fardan Pangestu
                </h3>

                <p class="text-[13px] text-[#524E48]">
                  Kriya Aksara · Bandung
                </p>
              </div>

              <div class="h-px w-10 bg-[#D1C9B8]"></div>

              <span class="text-center font-mono text-xs font-semibold tracking-wide text-[#8F897F]">
                11 RUPA HURUF PUBLISHED
              </span>
              </div>
            </RouterLink>
            <RouterLink :to=" { name : 'home' } ">
              <div
              class="flex flex-col items-center gap-5 rounded-xl border border-[#D1C9B8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
              <img :src="profile3" alt="Foto profil Sakti Dewantara" loading="lazy"
                class="h-[120px] w-[120px] rounded-full border border-[#D1C9B8] object-cover" />

              <div class="flex w-full flex-col items-center gap-1 text-center">
                <h3 class="font-serif text-xl font-bold text-[#121214]">
                  Sakti Dewantara
                </h3>

                <p class="text-[13px] text-[#524E48]">
                  Aksara Dewa · Denpasar
                </p>
              </div>

              <div class="h-px w-10 bg-[#D1C9B8]"></div>

              <span class="text-center font-mono text-xs font-semibold tracking-wide text-[#8F897F]">
                8 RUPA HURUF PUBLISHED
              </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </section>
      <section class="w-full bg-[#121214] px-4 py-12 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
        <div class="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10 lg:flex-row lg:gap-16 xl:gap-20">
          <div class="flex w-full flex-1 flex-col items-start gap-6">

            <div class="inline-flex items-center gap-2">
              <div class="h-px w-6 bg-white"></div>
              <span class="font-mono text-xs font-bold tracking-[0.24px] text-white">
                AKSARANUSA PREMIUM
              </span>
            </div>
            <h2
              class="w-full font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl sm:leading-[1.2] lg:text-[44px] lg:leading-[1.2]">
              Dukung Perupa Huruf Lokal, Tingkatkan Estetika Proyek Anda
            </h2>
            <p class="w-full text-base leading-[1.6] text-[#8F897F]">
              Dengan mengunduh lisensi premium atau melakukan donasi mikro, Anda
              berkontribusi langsung pada kelestarian kreativitas digital para
              desainer andal Indonesia.
            </p>
            <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <RouterLink :to="{ name: 'home' }"
                class="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-sm font-bold text-[#121214] transition-colors duration-200 hover:bg-[#D1C9B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Mulai Menelusuri
              </RouterLink>
              <RouterLink :to="{ name: 'home' }"
                class="inline-flex items-center justify-center rounded-md border border-white px-8 py-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-white hover:text-[#121214] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Pelajari Lisensi
              </RouterLink>
            </div>
          </div>
          <div
            class="flex min-h-[260px] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-[#D1C9B8] bg-white p-6 sm:min-h-[320px] sm:p-10 lg:w-[45%] lg:flex-none">
            <span
              class="font-serif text-[100px] font-black leading-none tracking-[-7.2px] text-[#121214] sm:text-[120px]"
              aria-label="Aksara Jawa">
              ꦄ
            </span>
            <span class="text-center font-mono text-xs tracking-[0.26px] text-[#8F897F] sm:text-[13px]">
              BATIK GEOMETRIC SPECIMEN
            </span>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/layout/MainLayout.vue';
import BaseButton from '@/components/common/button/base_button.vue';
import BaseInput from '@/components/common/input/base_input.vue';
import ApiFont from "@/core/api/font/font.api"
import { defineComponent } from 'vue';
import profile1 from '@/assets/image/profile1.png';
import profile2 from '@/assets/image/profile2.png';
import profile3 from '@/assets/image/profile3.png';

export default defineComponent({
  name: 'HomeView',
  components: {
    MainLayout,
    BaseButton,
    BaseInput
  },
  data() {
    return {
      // Dummy Database Font
      // fonts: [
      //   {
      //     id: 'plus-jakarta-sans',
      //     name: 'Plus Jakarta Sans',
      //     designer: 'Tokotype',
      //     category: 'Sans Serif',
      //     price: 25,
      //     previewText: 'The quick brown fox jumps over the lazy dog'
      //   },
      //   {
      //     id: 'playfair-display',
      //     name: 'Playfair Display',
      //     designer: 'Claus Eggers Sørensen',
      //     category: 'Serif',
      //     price: 30,
      //     previewText: 'Elegance is the only beauty that never fades'
      //   },
      //   {
      //     id: 'fira-code',
      //     name: 'Fira Code',
      //     designer: 'Nikita Prokopov',
      //     category: 'Monospace',
      //     price: 0,
      //     previewText: 'const font = () => { return "Awesome"; }'
      //   },
      //   {
      //     id: 'syne-extra',
      //     name: 'Syne Display',
      //     designer: 'Bonjour Monde',
      //     category: 'Display',
      //     price: 15,
      //     previewText: 'CREATIVE TYPEFACE FOR HEADLINES'
      //   }
      // ],
      fonts: [],
      categories: ['All', 'Sans Serif', 'Serif', 'Monospace', 'Display'],
      selectedCategory: 'All',
      searchQuery: '',
      customText: 'The quick brown fox jumps over the lazy dog',
      fontSize: 32,
      isLoading: false,
      profile1,
      profile2,
      profile3,
      popularTags: [
        'Tradisional',
        'Lontara',
        'Kaligrafi Bali',
        'Sans-Serif',
        'Komersial Gratis',
        'Batik',
        'Aksara Jawa',
        'Display'
      ]
    }
  },
  mounted() {
    this.getAll();
  },
  computed: {
    filteredFonts() {
      return this.fonts.filter((font) => {
        const matchCategory =
          this.selectedCategory === 'All' ||
          font.category.toLowerCase() === this.selectedCategory.toLowerCase()

        const matchSearch =
          font.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          font.designer.toLowerCase().includes(this.searchQuery.toLowerCase())

        return matchCategory && matchSearch
      })
    }
  },
  methods: {
    getAll() {
      this.isLoading = true;
      ApiFont.getAll()
        .then((response) => {
          console.log(response);
          // this.dummyFonts = response.data;
        })
    }
  }
})
</script>