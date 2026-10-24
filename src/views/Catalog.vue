<template>
    <AppLayout>
        <div class="flex flex-col gap-10">
            <section
                class="flex w-full flex-col gap-5 border-b border-[#E2E2E4] px-4 pb-9 pt-10 sm:px-6 sm:pt-12 lg:px-20 lg:pt-[52px]">
                <div class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                    Arsip tipografi Nusantara / Katalog font
                </div>

                <div class="flex w-full flex-col justify-between gap-6 lg:flex-row lg:items-center">
                    <div class="flex w-full flex-col gap-2.5 lg:max-w-[690px]">
                        <h1
                            class="font-serif text-4xl font-semibold leading-tight text-[#121214] sm:text-5xl lg:text-[52px]">
                            Rupa lokal. Kemungkinan tak terbatas.
                        </h1>

                        <p class="text-[15px] leading-[23.25px] text-[#68686C]">
                            Font gratis dan berbayar, untuk setiap gagasan yang ingin Anda wujudkan.
                        </p>
                    </div>

                    <form
                        class="flex h-[52px] w-full items-center gap-3 rounded border border-[#E2E2E4] bg-white px-4 transition-colors focus-within:border-[#121214] lg:max-w-[400px]"
                        @submit.prevent="handleSearch">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="#121214" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0" aria-hidden="true">
                            <circle cx="11" cy="11" r="7.5" />
                            <path d="m16.5 16.5 4 4" />
                        </svg>

                        <input v-model="searchQuery" type="search" placeholder="Cari font, desainer, atau gaya rupa…"
                            class="h-full min-w-0 flex-1 bg-transparent text-sm text-[#121214] outline-none placeholder:text-[#68686C]"
                            aria-label="Cari font, desainer, atau gaya rupa" />

                        <button v-if="searchQuery" type="button"
                            class="shrink-0 text-xs text-[#68686C] transition-colors hover:text-[#121214]"
                            aria-label="Hapus pencarian" @click="clearSearch">
                            Hapus
                        </button>
                    </form>
                </div>
            </section>
            <section class="w-full px-4 py-9 sm:px-6 lg:px-20 lg:pb-16 lg:pt-9">
                <div class="flex flex-col items-start gap-10 xl:flex-row">
                    <aside class="flex w-full shrink-0 flex-col gap-7 xl:w-[248px]">

                        <!-- Header Filter -->
                        <div class="flex items-center justify-between">
                            <h2 class="text-base font-semibold text-[#121214]">
                                Saring koleksi
                            </h2>

                            <button type="button"
                                class="font-mono text-[10px] font-medium text-[#68686C] transition-colors hover:text-[#121214]"
                                @click="resetFilters">
                                RESET
                            </button>
                        </div>

                        <div class="h-px w-full bg-[#E2E2E4]"></div>

                        <!-- Filter Harga -->
                        <div class="flex flex-col gap-4">
                            <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                                Harga
                            </h3>

                            <div class="flex gap-1 rounded bg-[#F6F6F5] p-1">
                                <button v-for="option in priceOptions" :key="option.value" type="button"
                                    class="h-9 flex-1 rounded text-xs transition-colors" :class="selectedPrice === option.value
                                        ? 'bg-[#121214] text-white'
                                        : 'bg-transparent text-[#68686C] hover:text-[#121214]'
                                        " @click="selectedPrice = option.value">
                                    {{ option.label }}
                                </button>
                            </div>
                        </div>

                        <!-- Filter Klasifikasi Gaya -->
                        <div class="flex flex-col gap-4">
                            <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                                Klasifikasi gaya
                            </h3>

                            <label v-for="category in categoryOptions" :key="category"
                                class="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#68686C] transition-colors hover:text-[#121214]">
                                <input v-model="selectedCategories" type="checkbox" :value="category"
                                    class="h-4 w-4 shrink-0 cursor-pointer accent-[#121214]" />

                                <span>{{ category }}</span>
                            </label>
                        </div>

                        <div class="h-px w-full bg-[#E2E2E4]"></div>

                        <!-- Filter Lisensi -->
                        <div class="flex flex-col gap-4">
                            <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                                Ketentuan lisensi
                            </h3>

                            <label v-for="license in licenseOptions" :key="license"
                                class="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#68686C] transition-colors hover:text-[#121214]">
                                <input v-model="selectedLicenses" type="checkbox" :value="license"
                                    class="h-4 w-4 shrink-0 cursor-pointer accent-[#121214]" />

                                <span>{{ license }}</span>
                            </label>
                        </div>

                        <!-- Informasi Lisensi -->
                        <div class="flex flex-col gap-3 rounded bg-[#F6F6F5] p-5">
                            <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                                Tanpa checkout
                            </h3>

                            <p class="text-[13px] leading-5 text-[#68686C]">
                                Font gratis dapat diunduh langsung. Selalu periksa ketentuan lisensi
                                masing-masing font.
                            </p>

                            <a href="/licenses"
                                class="inline-flex items-center gap-1 text-xs font-semibold text-[#121214] hover:underline">
                                Pelajari lisensi →
                            </a>
                        </div>
                    </aside>
                    <div class="flex min-w-0 w-full flex-1 flex-col gap-6">
                        <div
                            class="flex flex-col gap-4 rounded border border-[#E2E2E4] bg-[#F6F6F5] p-4 sm:flex-row sm:items-center">
                            <div class="flex min-w-0 flex-1 items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" class="shrink-0 text-[#68686C]" aria-hidden="true">
                                    <path d="M4 7V4h16v3" />
                                    <path d="M9 20h6" />
                                    <path d="M12 4v16" />
                                </svg>

                                <input v-model="previewText" type="text" placeholder="Tulis teks pratinjau Anda…"
                                    class="min-w-0 w-full bg-transparent text-sm text-[#121214] outline-none placeholder:text-[#68686C]"
                                    aria-label="Teks pratinjau font" />
                            </div>

                            <!-- Font Size Slider -->
                            <div class="flex items-center gap-3 sm:w-[200px] sm:shrink-0">
                                <span class="min-w-[42px] font-mono text-xs text-[#121214]" aria-live="polite">
                                    {{ previewFontSize }} px
                                </span>

                                <input v-model.number="previewFontSize" type="range" min="16" max="72" step="1"
                                    class="min-w-0 flex-1 cursor-pointer accent-[#121214]"
                                    aria-label="Ukuran teks pratinjau" />
                            </div>
                        </div>
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div class="flex flex-col gap-1">
                                <p class="text-[13px] font-semibold text-[#121214]">
                                    {{ filteredFonts.length }} rupa huruf
                                </p>

                                <p class="font-mono text-[10px] text-[#68686C]">
                                    {{ freeFontCount }} GRATIS / {{ paidFontCount }} BERBAYAR
                                </p>
                            </div>

                            <div class="flex items-center gap-2">
                                <label for="font-sort" class="text-xs text-[#68686C]">
                                    Urutkan:
                                </label>

                                <select id="font-sort" v-model="sortBy"
                                    class="max-w-full cursor-pointer rounded border border-[#E2E2E4] bg-white px-3 py-2 text-xs text-[#121214] outline-none focus:border-[#121214]">
                                    <option value="latest">Terbaru</option>
                                    <option value="name">Nama A–Z</option>
                                    <option value="price-low">Harga terendah</option>
                                    <option value="price-high">Harga tertinggi</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="filteredFonts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <article v-for="font in filteredFonts" :key="font.id"
                                class="relative min-w-0 overflow-hidden rounded-lg border border-[#E2E2E4] transition-shadow hover:shadow-sm">
                                <RouterLink
                                    :to="{ name: 'font-detail', params: { id: font.id } }"
                                    class="absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#121214]"
                                    :aria-label="`Lihat detail ${font.name}`" />
                                <!-- Preview Area -->
                                <div
                                    class="flex min-h-[220px] flex-col justify-between gap-6 overflow-hidden bg-[#F6F6F5] p-5 sm:p-6">
                                    <!-- Category & Price Badge -->
                                    <div class="flex items-start justify-between gap-3">
                                        <span
                                            class="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#68686C]">
                                            {{ font.category }}
                                        </span>

                                        <span class="shrink-0 rounded px-2.5 py-1 font-mono text-[10px] font-semibold"
                                            :class="font.price === 0
                                                ? 'bg-white text-[#121214]'
                                                : 'bg-[#121214] text-white'
                                                ">
                                            {{ font.price === 0 ? 'GRATIS' : 'BERBAYAR' }}
                                        </span>
                                    </div>

                                    <!-- LIVE FONT PREVIEW -->
                                    <div class="w-full min-w-0 break-words text-[#121214]" :style="{
                                        fontFamily: font.fontFamily,
                                        fontSize: `${previewFontSize}px`,
                                        lineHeight: 1.2,
                                        fontWeight: font.fontWeight || 400,
                                        fontStyle: font.fontStyle || 'normal',
                                        overflowWrap: 'anywhere',
                                    }">
                                        {{ previewText || font.previewText || 'Tulis teks pratinjau Anda…' }}
                                    </div>

                                    <!-- Font Styles / Info -->
                                    <div class="font-mono text-[10px] uppercase tracking-wide text-[#68686C]">
                                        {{ font.styles || 1 }} gaya / ketebalan
                                    </div>
                                </div>

                                <!-- Font Information -->
                                <div class="flex flex-col gap-4 p-5 sm:p-6">

                                    <!-- Name & Price -->
                                    <div class="flex items-start justify-between gap-3">
                                        <h3
                                            class="min-w-0 break-words font-serif text-xl font-bold text-[#121214] sm:text-[23px]">
                                            {{ font.name }}
                                        </h3>

                                        <span class="shrink-0 text-sm font-semibold text-[#121214]">
                                            {{ formatPrice(font.price) }}
                                        </span>
                                    </div>

                                    <!-- Designer -->
                                    <p class="text-xs text-[#68686C]">
                                        oleh {{ font.designer }}
                                    </p>

                                    <!-- License Information -->
                                    <p class="text-xs leading-5 text-[#68686C]">
                                        {{ font.license || 'Standar lisensi' }}
                                    </p>

                                    <div class="h-px w-full bg-[#E2E2E4]"></div>

                                    <!-- Actions -->
                                    <div class="flex flex-wrap items-center justify-between gap-3">
                                        <span class="text-[13px] font-semibold text-[#121214]">
                                            Lihat Detail →
                                        </span>

                                        <button v-if="font.price > 0" type="button"
                                            class="relative z-20 rounded border border-[#121214] bg-[#121214] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#121214]"
                                            @click="addToCart(font)">
                                            + Keranjang
                                        </button>

                                        <button v-else type="button"
                                            class="relative z-20 rounded border border-[#E2E2E4] bg-white px-4 py-3 text-sm font-semibold text-[#121214] transition-colors hover:border-[#121214]"
                                            @click="downloadFont(font)">
                                            Unduh Gratis
                                        </button>
                                    </div>
                                    <p v-if="cartFeedbackFontId === font.id" role="status" aria-live="polite"
                                        class="text-xs text-[#68686C]">
                                        {{ cartFeedback }}
                                    </p>
                                </div>
                            </article>
                        </div>

                        <!-- Empty State -->
                        <div v-else
                            class="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded border border-dashed border-[#E2E2E4] px-6 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"
                                stroke-linejoin="round" class="text-[#68686C]" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m16 16 4 4" />
                            </svg>

                            <h3 class="text-base font-semibold text-[#121214]">
                                Font tidak ditemukan
                            </h3>

                            <p class="max-w-sm text-sm leading-6 text-[#68686C]">
                                Coba ubah kata kunci pencarian atau sesuaikan filter yang kamu pilih.
                            </p>

                            <button type="button"
                                class="mt-2 text-sm font-semibold text-[#121214] underline underline-offset-4"
                                @click="resetFilters">
                                Reset filter
                            </button>
                        </div>

                        <!-- Footer Catalog Note -->
                        <p class="text-xs leading-5 text-[#68686C]">
                            Harga dan ketentuan lisensi mengikuti informasi pada masing-masing
                            rupa huruf. Pastikan lisensi sesuai dengan kebutuhan penggunaanmu.
                        </p>
                    </div>
                </div>
            </section>
            <!-- END CATALOG MAIN CONTENT -->
        </div>
    </AppLayout>
</template>

<script>
import { defineComponent } from 'vue';
import AppLayout from '@/components/layout/applayout.vue';
import FontApi from '@/core/api/font/font.api';
import { useCartStore } from '@/core/cart/cartStore';

export default defineComponent({
    name: 'Catalog',

    components: {
        AppLayout,
    },

    data() {
        return {
            searchQuery: '',
            previewText: 'Lembut elok rumpun padi.',
            previewFontSize: 43,

            selectedPrice: 'all',
            selectedCategories: [],
            selectedLicenses: [],
            sortBy: 'latest',

            priceOptions: [
                { label: 'Semua', value: 'all' },
                { label: 'Gratis', value: 'free' },
                { label: 'Berbayar', value: 'paid' },
            ],

            categoryOptions: [
                'Serif tradisional',
                'Sans modern',
                'Display ekspresif',
                'Aksara daerah',
                'Kaligrafi & coretan',
                'Display / Script',
            ],

            licenseOptions: [
                'Komersial gratis',
                'Personal / nonkomersial',
                'Desktop berbayar',
                'Web berbayar',
                'Aplikasi berbayar',
            ],

            // Data array font akan diambil dari FontApi
            fonts: [],
            cartStore: useCartStore(),
            cartFeedback: '',
            cartFeedbackFontId: '',
        };
    },

    async mounted() {
        await this.loadFonts();
    },

    computed: {
        filteredFonts() {
            const query = this.searchQuery.trim().toLowerCase();

            let result = this.fonts.filter((font) => {
                const searchableText = [
                    font.name,
                    font.designer,
                    font.category,
                    font.license,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                const matchSearch =
                    query === '' || searchableText.includes(query);

                const matchPrice =
                    this.selectedPrice === 'all' ||
                    (this.selectedPrice === 'free' && font.price === 0) ||
                    (this.selectedPrice === 'paid' && font.price > 0);

                const matchCategory =
                    this.selectedCategories.length === 0 ||
                    this.selectedCategories.includes(font.category);

                const matchLicense =
                    this.selectedLicenses.length === 0 ||
                    this.selectedLicenses.includes(font.license);

                return (
                    matchSearch &&
                    matchPrice &&
                    matchCategory &&
                    matchLicense
                );
            });

            if (this.sortBy === 'name') {
                result.sort((a, b) => a.name.localeCompare(b.name));
            } else if (this.sortBy === 'price-low') {
                result.sort((a, b) => a.price - b.price);
            } else if (this.sortBy === 'price-high') {
                result.sort((a, b) => b.price - a.price);
            } else {
                result.sort((a, b) => {
                    return this.fonts.indexOf(a) - this.fonts.indexOf(b);
                });
            }

            return result;
        },

        freeFontCount() {
            return this.filteredFonts.filter(
                (font) => font.price === 0
            ).length;
        },

        paidFontCount() {
            return this.filteredFonts.filter(
                (font) => font.price > 0
            ).length;
        },
    },

    methods: {
        async loadFonts() {
            try {
                const data = await FontApi.getAll();
                // Menangani jika kembalian API berupa error atau array langsung
                if (!data.error) {
                    this.fonts = data;
                }
            } catch (error) {
                console.error('Gagal mengambil data font:', error);
            }
        },

        handleSearch() {
            return this.filteredFonts;
        },

        clearSearch() {
            this.searchQuery = '';
        },

        resetFilters() {
            this.selectedPrice = 'all';
            this.selectedCategories = [];
            this.selectedLicenses = [];
            this.searchQuery = '';
            this.sortBy = 'latest';
        },

        formatPrice(price) {
            if (price === 0) {
                return 'Gratis';
            }

            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }).format(price);
        },

        addToCart(font) {
            this.cartFeedbackFontId = font.id;

            const result = this.cartStore.addFont(font.id);
            if (result.added) {
                this.cartFeedback = `${font.name} berhasil ditambahkan ke keranjang.`;
            } else if (result.reason === 'duplicate') {
                this.cartFeedback = `${font.name} sudah ada di keranjang.`;
            } else {
                this.cartFeedback = 'Font ini tidak tersedia untuk ditambahkan ke keranjang.';
            }
        },

        downloadFont(font) {
            console.log('Permintaan unduh font:', font.name);
        },
    },
});
</script>