<template>
  <MainLayout>
    <div class="space-y-10 p-8">
    <section class="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 shadow-xl">
      <div class="max-w-2xl space-y-4">
        <span class="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Marketplace Font Digital
        </span>
        <h1 class="text-3xl md:text-5xl font-extrabold leading-tight">
          Temukan Typeface Sempurna untuk Projekmu.
        </h1>
        <p class="text-violet-100 text-sm md:text-base">
          Eksplorasi ribuan font berkualitas tinggi dengan lisensi siap pakai untuk kebutuhan web, aplikasi, dan desain cetak.
        </p>
      </div>
    </section>
    <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div class="md:col-span-6">
          <label class="block text-xs font-medium text-gray-500 mb-1">Tes Ketik Teks Anda</label>
          <DefaultInput
            :type="text"
            :modelValue="customText"
            placeholder="Ketik teks di sini.."
            @update:modelValue="customText = $event"
          />
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
          <input
            v-model="fontSize"
            type="range"
            min="16"
            max="64"
            class="w-full accent-violet-600 cursor-pointer"
          />
        </div>
        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-500 mb-1">Cari Font</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama font / designer..."
            class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
      </div>
      <div class="flex items-center gap-2 pt-2 overflow-x-auto border-t border-gray-100">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap',
            selectedCategory === cat
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </section>
    <section>
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="n in 4" :key="n" class="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
      </div>
      <div v-else-if="filteredFonts.length === 0" class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        <p class="text-gray-500 text-sm">Tidak ada font yang cocok dengan pencarianmu.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="font in filteredFonts"
          :key="font.id"
          class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
        >
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
              <p
                class="text-gray-900 font-normal leading-tight transition-all duration-150 w-full truncate"
                :style="{ fontSize: fontSize + 'px' }"
              >
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
            <BaseButton
              type="click"
              variant="danger"
              size="md"
            >
              Cancel
            </BaseButton>
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
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/layout/MainLayout.vue';
import BaseButton from '@/components/common/button/base_button.vue';
import DefaultInput from '@/components/common/input/default_input.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    MainLayout,
    BaseButton,
    DefaultInput
  },
  data() {
    return {
      // Dummy Database Font
      fonts: [
        {
          id: 'plus-jakarta-sans',
          name: 'Plus Jakarta Sans',
          designer: 'Tokotype',
          category: 'Sans Serif',
          price: 25,
          previewText: 'The quick brown fox jumps over the lazy dog'
        },
        {
          id: 'playfair-display',
          name: 'Playfair Display',
          designer: 'Claus Eggers Sørensen',
          category: 'Serif',
          price: 30,
          previewText: 'Elegance is the only beauty that never fades'
        },
        {
          id: 'fira-code',
          name: 'Fira Code',
          designer: 'Nikita Prokopov',
          category: 'Monospace',
          price: 0,
          previewText: 'const font = () => { return "Awesome"; }'
        },
        {
          id: 'syne-extra',
          name: 'Syne Display',
          designer: 'Bonjour Monde',
          category: 'Display',
          price: 15,
          previewText: 'CREATIVE TYPEFACE FOR HEADLINES'
        }
      ],
      categories: ['All', 'Sans Serif', 'Serif', 'Monospace', 'Display'],
      selectedCategory: 'All',
      searchQuery: '',
      customText: 'The quick brown fox jumps over the lazy dog',
      fontSize: 32,
      isLoading: false
    }
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
  }
})
</script>