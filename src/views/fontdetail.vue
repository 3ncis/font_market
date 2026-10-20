<template>
  <Applayout>
    <!-- 1. Sedang memuat data -->
    <div v-if="isLoading" class="mx-auto w-full max-w-[1440px] px-4 py-24 sm:px-6 lg:px-20">
      <div class="h-10 w-72 animate-pulse rounded bg-[#EDE8DF]"></div>
    </div>

    <!-- 2. Font ditemukan -->
    <template v-else-if="font">
      <!-- ===== BAGIAN ATAS: judul, tombol, pratinjau ===== -->
      <section class="w-full border-b border-[#D1C9B8] bg-[#FAF8F5] px-4 py-10 sm:px-6 sm:py-14 lg:px-20 lg:py-16">
        <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-8">
          <!-- Judul + tombol aksi -->
          <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div class="flex flex-col gap-2">
              <div class="inline-flex items-center gap-2">
                <div class="h-px w-6 bg-[#121214]"></div>
                <span class="font-['Geist_Mono'] text-xs font-bold uppercase text-[#121214]">
                  Rupa Huruf Pilihan
                </span>
              </div>
              <h1 class="font-['Crimson_Pro'] text-4xl font-bold text-[#121214] sm:text-5xl">
                {{ font.name }}
              </h1>
              <p class="font-['Geist'] text-sm text-[#8F897F]">
                Dibuat oleh <span class="font-semibold text-[#121214]">{{ designerName }}</span>
              </p>
            </div>

            <div class="flex flex-col items-start gap-3">
              <div class="flex flex-wrap gap-3">
                <button type="button"
                  class="rounded-md border border-[#121214] bg-white px-6 py-3 font-['Geist'] text-sm font-semibold text-[#121214] transition-colors hover:bg-[#EDE8DF]">
                  Donasi Desainer
                </button>
                <button type="button"
                  class="inline-flex items-center gap-2 rounded-md bg-[#121214] px-6 py-3 font-['Geist'] text-sm font-semibold text-[#FAF8F5] transition-colors hover:bg-[#383735]"
                  @click="handlePurchaseAction">
                  {{ isFree ? 'Unduh Font (.OTF/.TTF)' : 'Beli Font ($' + font.price + ')' }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true">
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </button>
              </div>
              <p role="status" aria-live="polite"
                class="h-4 w-full overflow-hidden text-ellipsis whitespace-nowrap font-['Geist'] text-xs text-[#68686C]">
                {{ cartFeedback }}
              </p>
            </div>
          </div>

          <!-- Kotak pratinjau kustom -->
          <div class="rounded-xl border border-[#D1C9B8] bg-white p-6 sm:p-10">
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label for="preview-input" class="font-['Geist'] text-sm text-[#8F897F]">
                Pratinjau Kustom (Sunting teks di bawah):
              </label>
              <div class="flex items-center gap-3 font-['Geist'] text-sm">
                <label for="preview-size" class="text-[#524E48]">Ukuran:</label>
                <input id="preview-size" v-model.number="previewSize" type="range" min="24" max="120"
                  class="w-32 cursor-pointer accent-[#121214]" />
                <span class="w-12 text-right font-bold text-[#121214]">{{ previewSize }}px</span>
              </div>
            </div>

            <input id="preview-input" v-model="previewText" type="text"
              class="w-full border-0 bg-transparent p-0 text-[#121214] outline-none focus:ring-0"
              :style="{ fontFamily: fontStack, fontSize: previewSize + 'px', lineHeight: 1.2 }" />
          </div>
        </div>
      </section>

      <!-- ===== BAGIAN BAWAH: 2 kolom ===== -->
      <section class="w-full bg-[#FAF8F5] px-4 py-12 sm:px-6 sm:py-16 lg:px-20 lg:py-20">
        <div class="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_405px] lg:gap-20">
          <!-- Kolom kiri: daftar style + glyph -->
          <div class="flex flex-col gap-16">
            <div>
              <h2 class="font-['Crimson_Pro'] text-2xl font-bold text-[#121214]">
                Tersedia dalam {{ styles.length }} style
              </h2>

              <ul class="mt-8">
                <li v-for="style in styles" :key="style.label" class="border-b border-[#D1C9B8] py-5">
                  <div class="flex items-center justify-between">
                    <span class="font-['Geist_Mono'] text-xs font-bold uppercase text-[#8F897F]">
                      {{ style.label }}
                    </span>
                    <button type="button" class="font-['Geist'] text-xs text-[#8F897F] hover:text-[#121214]">
                      Unduh khusus
                    </button>
                  </div>
                  <p class="mt-2 truncate text-2xl text-[#121214] sm:text-[28px]" :style="{
                    fontFamily: fontStack,
                    fontWeight: style.weight,
                    fontStyle: style.italic ? 'italic' : 'normal',
                  }">
                    {{ sampleText }}
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <h2 class="font-['Crimson_Pro'] text-2xl font-bold text-[#121214]">
                Peta karakter (glyph set)
              </h2>
              <div class="mt-6 flex flex-col gap-3 rounded-xl border border-[#D1C9B8] bg-white p-6 text-xl tracking-[0.2em] sm:text-2xl"
                :style="{ fontFamily: fontStack }">
                <p class="break-all text-[#121214]">{{ glyphs.upper }}</p>
                <p class="break-all text-[#8F897F]">{{ glyphs.lower }}</p>
                <p class="break-all text-[#8F897F]">{{ glyphs.symbols }}</p>
              </div>
            </div>
          </div>

          <!-- Kolom kanan: lisensi + desainer -->
          <aside class="flex flex-col gap-6">
            <div class="rounded-xl border border-[#D1C9B8] bg-white p-6">
              <div class="flex items-center justify-between">
                <h3 class="font-['Geist'] text-base font-bold text-[#121214]">Informasi Lisensi</h3>
                <span class="rounded bg-[#121214] px-2 py-1 font-['Geist_Mono'] text-[10px] font-bold uppercase text-white">
                  {{ isFree ? 'Gratis' : 'Berbayar' }}
                </span>
              </div>

              <p v-if="isFree" class="mt-4 font-['Geist'] text-sm leading-6 text-[#8F897F]">
                Rupa huruf ini disebarluaskan di bawah lisensi
                <span class="font-semibold text-[#524E48]">Aksara Bebas Nusantara</span>.
                Boleh digunakan secara gratis baik untuk kebutuhan personal maupun komersial,
                dengan wajib menyertakan atribusi nama desainer asli.
              </p>
              <p v-else class="mt-4 font-['Geist'] text-sm leading-6 text-[#8F897F]">
                Rupa huruf ini berbayar (<span class="font-semibold text-[#524E48]">${{ font.price }}</span>).
                Ketentuan lisensi lengkap ditampilkan saat pembelian.
              </p>

              <ul class="mt-5 flex flex-col gap-3 border-t border-[#D1C9B8] pt-5 font-['Geist'] text-[13px] text-[#524E48]">
                <li v-for="rule in licenseRules" :key="rule.text" class="flex items-center gap-2">
                  <svg v-if="rule.allowed" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" aria-label="Diperbolehkan">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    aria-label="Dilarang">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m9 9 6 6" />
                    <path d="m15 9-6 6" />
                  </svg>
                  {{ rule.text }}
                </li>
              </ul>
            </div>

            <div class="rounded-xl border border-[#D1C9B8] bg-white p-6">
              <div class="flex items-center gap-4">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDE8DF] font-['Crimson_Pro'] text-2xl font-bold text-[#121214]">
                  {{ designerName.charAt(0) }}
                </div>
                <div>
                  <p class="font-['Crimson_Pro'] text-lg font-bold text-[#121214]">{{ designerName }}</p>
                  <p v-if="designerLocation" class="font-['Geist'] text-xs text-[#8F897F]">{{ designerLocation }}</p>
                </div>
              </div>

              <p class="mt-4 font-['Geist'] text-sm leading-6 text-[#8F897F]">
                Memiliki {{ designerFontCount }} rupa huruf di AksaraNusa.
              </p>

              <!-- Karya lain dari desainer yang sama -->
              <ul v-if="otherFonts.length" class="mt-3 flex flex-col gap-1.5 font-['Geist'] text-sm">
                <li v-for="other in otherFonts" :key="other.id">
                  <RouterLink :to="{ name: 'font-detail', params: { id: other.id } }"
                    class="text-[#524E48] underline-offset-2 hover:text-[#121214] hover:underline">
                    {{ other.name }}
                  </RouterLink>
                </li>
              </ul>

              <RouterLink :to="{ name: 'home' }"
                class="mt-5 inline-flex items-center gap-2 font-['Geist'] text-sm font-bold text-[#121214] hover:opacity-70">
                Kunjungi Profil Desainer
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </RouterLink>
            </div>
          </aside>
        </div>
      </section>
    </template>

    <!-- 3. Font tidak ditemukan -->
    <div v-else class="mx-auto w-full max-w-[1440px] px-4 py-24 text-center sm:px-6 lg:px-20">
      <p class="font-['Geist'] text-[#524E48]">
        Font dengan ID "{{ $route.params.id }}" tidak ditemukan.
      </p>
      <RouterLink :to="{ name: 'home' }" class="mt-4 inline-block text-sm font-semibold text-[#121214] underline">
        Kembali ke beranda
      </RouterLink>
    </div>
  </Applayout>
</template>

<script>
import { defineComponent } from 'vue'
import Applayout from '@/components/layout/applayout.vue';
import ApiFont from '@/core/api/font/font.api'
import { useCartStore } from '@/core/cart/cartStore';

export default defineComponent({
  name: 'FontDetailView',
  components: { Applayout },
  data() {
    return {
      fonts: [],
      isLoading: true,
      cartFeedback: '',

      // State pratinjau (berubah saat user mengetik / geser slider)
      previewText: 'Karsa Luhur Bumi Khatulistiwa',
      previewSize: 72,

      sampleText: 'Senja berselimut rupa karsa budaya nusantara',

      // Data statis: 6 style sesuai desain
      styles: [
        { label: 'Light 300', weight: 300, italic: false },
        { label: 'Regular 400', weight: 400, italic: false },
        { label: 'Italic 400', weight: 400, italic: true },
        { label: 'Medium 500', weight: 500, italic: false },
        { label: 'Bold 700', weight: 700, italic: false },
        { label: 'Black 900', weight: 900, italic: false },
      ],

      glyphs: {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        symbols: '0123456789!@#$%^&*()_+',
      },

      licenseRules: [
        { text: 'Gunakan untuk desain komersial', allowed: true },
        { text: 'Gunakan untuk logo & branding', allowed: true },
        { text: 'Dilarang memperjualbelikan berkas mentah', allowed: false },
      ],
    }
  },
  computed: {
    font() {
      return this.fonts.find((f) => f.id === this.$route.params.id) || null
    },
    // "Adien Gunarta (Indonesia)" -> "Adien Gunarta"
    designerName() {
      return this.font ? this.font.designer.replace(/\s*\(.*\)\s*$/, '') : ''
    },
    // "Adien Gunarta (Indonesia)" -> "Indonesia"; kalau tidak ada tanda kurung -> ''
    designerLocation() {
      if (!this.font) return ''
      const match = this.font.designer.match(/\(([^)]*)\)\s*$/)
      return match ? match[1] : ''
    },
    // Semua font milik desainer yang sama (dibandingkan lewat nama yang sudah dibersihkan)
    designerFonts() {
      return this.fonts.filter(
        (f) => f.designer.replace(/\s*\(.*\)\s*$/, '') === this.designerName
      )
    },
    designerFontCount() {
      return this.designerFonts.length
    },
    otherFonts() {
      return this.designerFonts.filter((f) => f.id !== this.font.id)
    },
    // Cadangan kalau file font belum ada: sesuaikan dengan jenisnya
    fallbackFamily() {
      const category = this.font ? this.font.category.toLowerCase() : ''
      if (category.includes('mono')) return 'monospace'
      if (category.includes('sans')) return 'sans-serif'
      return 'serif'
    },
    isFree() {
      return this.font ? this.font.price === 0 : false
    },
    // Nama font dari JSON + cadangan serif kalau file font belum ada
    fontStack() {
      return this.font ? `'${this.font.fontFamily}', ${this.fallbackFamily}` : 'serif'
    },
  },
  methods: {
    handlePurchaseAction() {
      if (!this.font) return;

      if (this.isFree) {
        this.cartFeedback = 'File font untuk unduhan belum tersedia.';
        return;
      }

      const result = useCartStore().addFont(this.font);
      if (result.added) {
        this.cartFeedback = `${this.font.name} berhasil ditambahkan ke keranjang.`;
      } else if (result.reason === 'duplicate') {
        this.cartFeedback = `${this.font.name} sudah ada di keranjang.`;
      } else {
        this.cartFeedback = 'Font ini tidak tersedia untuk ditambahkan ke keranjang.';
      }
    },
  },
  mounted() {
    ApiFont.getAll()
      .then((response) => {
        this.fonts = response
      })
      .finally(() => {
        this.isLoading = false
      })
  },
})
</script>