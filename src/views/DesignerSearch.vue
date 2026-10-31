<template>
    <AppLayout>
        <section
            class="flex flex-col gap-5 overflow-hidden border-b border-[#E2E2E4] px-4 pb-9 pt-10 sm:px-6 lg:px-20 lg:pt-[52px]">
            <div class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                Arsip Tipografi Nusantara / Daftar Desainer
            </div>

            <div class="flex w-full items-center justify-between overflow-hidden">
                <div class="flex w-full max-w-[690px] flex-col gap-2.5">
                    <h1
                        class="font-['Crimson_Pro'] text-4xl font-semibold leading-tight text-[#121214] sm:text-5xl lg:text-[52px] lg:leading-[58.24px]">
                        Kenali para perupa huruf.
                    </h1>
                    <p class="font-['Geist'] text-sm leading-relaxed text-[#68686C] sm:text-[15px] sm:leading-[23.25px]">
                        Temukan sosok di balik rupa huruf lokal Indonesia.
                    </p>
                </div>
            </div>
        </section>

        <section class="flex flex-col gap-6 px-4 pb-16 pt-9 sm:px-6 lg:px-20">
            <label class="flex h-[52px] items-center gap-3 rounded border border-[#E2E2E4] px-4">
                <svg class="h-[18px] w-[18px] shrink-0 text-[#121214]" viewBox="0 0 18 18" fill="none"
                    stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <circle cx="7.875" cy="7.875" r="5.625" />
                    <path d="m12.5 12.5 3 3" stroke-linecap="round" />
                </svg>
                <input v-model="searchQuery" type="search"
                    placeholder="Cari nama desainer, studio, lokasi, atau font..."
                    aria-label="Cari desainer"
                    class="w-full bg-transparent font-['Geist'] text-sm text-[#121214] outline-none placeholder:text-[#68686C]" />
                <button v-if="searchQuery" type="button"
                    class="shrink-0 font-['Geist'] text-xs text-[#68686C] hover:text-[#121214]"
                    @click="resetSearch">
                    Hapus
                </button>
            </label>

            <div class="flex items-center justify-between gap-4">
                <p class="font-['Geist'] text-[13px] font-semibold text-[#121214]">
                    {{ filteredDesigners.length }} desainer ditampilkan
                </p>
                <span class="font-mono text-[10px] font-normal tracking-wide text-[#68686C]">
                    {{ designers.length }} DESAINER TERCATAT
                </span>
            </div>

            <div v-if="filteredDesigners.length"
                class="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                <DesignerCard v-for="designer in filteredDesigners" :key="designer.id" :designer="designer" />
            </div>

            <div v-else
                class="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-lg border border-[#E2E2E4] px-6 py-10 text-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F6F5]">
                    <svg class="h-7 w-7 text-[#121214]" viewBox="0 0 28 28" fill="none" stroke="currentColor"
                        stroke-width="1.5" aria-hidden="true">
                        <circle cx="12.25" cy="12.25" r="8.75" />
                        <path d="m18.5 18.5 5 5" stroke-linecap="round" />
                    </svg>
                </div>
                <div class="flex flex-col gap-2">
                    <h2 class="font-['Crimson_Pro'] text-[32px] font-semibold text-[#121214]">
                        {{ searchQuery.trim() ? 'Desainer tidak ditemukan.' : 'Belum ada data desainer.' }}
                    </h2>
                    <p class="font-['Geist'] text-sm text-[#68686C]">
                        <template v-if="searchQuery.trim()">
                            Tidak ada desainer atau studio yang cocok dengan “{{ searchQuery }}”. Coba nama lain.
                        </template>
                        <template v-else>
                            Data font yang tersedia belum mencantumkan desainer.
                        </template>
                    </p>
                </div>
                <button type="button"
                    class="inline-flex h-12 items-center justify-center rounded bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white transition hover:bg-[#343438]"
                    @click="resetSearch">
                    Reset pencarian
                </button>
            </div>

            <div class="flex flex-col gap-3 rounded bg-[#F6F6F5] p-5 sm:p-6">
                <h3 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                    Tentang data direktori
                </h3>
                <p class="font-['Geist'] text-[13px] leading-[20.15px] text-[#68686C]">
                    Profil dibentuk dengan mengelompokkan font berdasarkan nilai nama desainer yang sama persis.
                    Studio, biografi, statistik, dan foto hanya ditampilkan jika tersedia pada data sumber.
                    Tanda “—” menunjukkan informasi yang belum tersedia, bukan nilai nol.
                </p>
            </div>
        </section>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/layout/applayout.vue';
import { getDesigners } from '@/core/designers/designerData';
import DesignerCard from './components/DesignerCard.vue';

export default {
    name: 'DesignerDirectory',

    components: {
        AppLayout,
        DesignerCard,
    },

    data() {
        return {
            searchQuery: '',
            designers: getDesigners(),
        };
    },

    computed: {
        filteredDesigners() {
            const query = this.searchQuery.trim().toLocaleLowerCase();
            if (!query) return this.designers;

            return this.designers.filter((designer) => {
                const searchableContent = [
                    designer.name,
                    designer.sourceName,
                    designer.studio,
                    designer.location,
                    ...designer.fonts.map((font) => font.name),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLocaleLowerCase();

                return searchableContent.includes(query);
            });
        },
    },

    methods: {
        resetSearch() {
            this.searchQuery = '';
        },
    },
};
</script>
