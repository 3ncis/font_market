<template>
    <AppLayout>
        <main class="mx-auto w-full max-w-[1440px]">
            <section class="border-b border-[#E2E2E4] px-4 pb-8 pt-10 sm:px-6 lg:px-20 lg:pb-10 lg:pt-[52px]">
                <nav aria-label="Breadcrumb" class="font-['Geist'] text-xs text-[#68686C]">
                    <RouterLink :to="{ name: 'designer-search' }" class="transition hover:text-[#121214]">
                        Daftar Desainer
                    </RouterLink>
                    <span class="mx-2">/</span>
                    <span class="text-[#121214]">{{ designer?.name || 'Profil Desainer' }}</span>
                </nav>
            </section>

            <section v-if="isLoading" role="status"
                class="flex min-h-[440px] items-center justify-center px-6 py-12 font-['Geist'] text-sm text-[#68686C]">
                Memuat profil desainer...
            </section>

            <section v-else-if="loadError" role="alert"
                class="flex min-h-[440px] flex-col items-center justify-center px-6 py-12 text-center">
                <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Profil desainer tidak dapat dimuat.
                </h1>
                <p class="mt-3 font-['Geist'] text-sm text-[#68686C]">{{ loadError }}</p>
                <button type="button" @click="loadDesigner"
                    class="mt-6 inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white hover:bg-[#343438]">
                    Coba lagi
                </button>
            </section>

            <section v-else-if="designer" class="flex flex-col gap-10 px-4 py-9 sm:px-6 lg:px-20 lg:py-12">
                <div class="flex flex-col items-center gap-6 rounded-lg border border-[#E2E2E4] p-6 text-center sm:p-10 md:flex-row md:text-left">
                    <div v-if="designer.avatar"
                        class="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[#F6F6F5] sm:h-36 sm:w-36">
                        <img :src="designer.avatar" :alt="designer.name" class="h-full w-full object-cover" />
                    </div>
                    <div v-else
                        class="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-[#E2E2E4] bg-[#F6F6F5] font-['Crimson_Pro'] text-4xl font-semibold text-[#121214] sm:h-36 sm:w-36 sm:text-5xl"
                        role="img" :aria-label="`Avatar ${designer.name}`">
                        {{ initials }}
                    </div>

                    <div class="min-w-0">
                        <p class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                            Profil perupa huruf
                        </p>
                        <h1 class="mt-2 break-words font-['Crimson_Pro'] text-4xl font-semibold leading-tight text-[#121214] sm:text-5xl">
                            {{ designer.name }}
                        </h1>
                        <p class="mt-3 font-['Geist'] text-sm text-[#68686C]">
                            {{ designer.studio || 'Studio —' }}
                            <span class="mx-1">·</span>
                            {{ designer.location || '—' }}
                        </p>
                    </div>
                </div>

                <section class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                    <div class="rounded-lg border border-[#E2E2E4] p-6 sm:p-8">
                        <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214] sm:text-[28px]">
                            Tentang Desainer
                        </h2>
                        <p class="mt-4 whitespace-pre-line font-['Geist'] text-sm leading-6 text-[#68686C]">
                            {{ designer.biography || '—' }}
                        </p>
                    </div>

                    <div class="rounded-lg border border-[#E2E2E4] p-6 sm:p-8">
                        <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214] sm:text-[28px]">
                            Informasi Desainer
                        </h2>
                        <dl class="mt-5 flex flex-col divide-y divide-[#E2E2E4]">
                            <div v-for="stat in statistics" :key="stat.label"
                                class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                <dt class="font-['Geist'] text-sm text-[#68686C]">{{ stat.label }}</dt>
                                <dd class="font-['Geist'] text-sm font-semibold text-[#121214]">
                                    {{ formatNumber(stat.value) }}
                                </dd>
                            </div>
                        </dl>
                        <p class="mt-5 border-t border-[#E2E2E4] pt-4 font-['Geist'] text-xs leading-relaxed text-[#8F897F]">
                            Font tercatat di katalog: {{ designer.fontCount }}
                        </p>
                    </div>
                </section>

                <section>
                    <div class="flex flex-col gap-2 border-b border-[#E2E2E4] pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                                Arsip tipografi
                            </p>
                            <h2 class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214] sm:text-4xl">
                                Font yang dipublikasikan
                            </h2>
                        </div>
                        <p class="font-['Geist'] text-sm text-[#68686C]">
                            {{ designer.fonts.length }} font tercatat
                        </p>
                    </div>

                    <div v-if="designer.fonts.length" class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <DesignerFontCard v-for="font in designer.fonts" :key="font.id" :font="font" />
                    </div>
                    <div v-else class="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-[#E2E2E4] bg-[#F6F6F5] px-6 text-center">
                        <h3 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                            Belum ada font yang dipublikasikan
                        </h3>
                        <p class="mt-2 max-w-md font-['Geist'] text-sm leading-relaxed text-[#68686C]">
                            Belum ada font desainer ini yang dapat ditampilkan dalam katalog.
                        </p>
                    </div>
                </section>
            </section>

            <section v-else class="flex min-h-[440px] flex-col items-center justify-center px-6 py-12 text-center">
                <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Profil desainer tidak ditemukan.
                </h1>
                <p class="mt-3 font-['Geist'] text-sm text-[#68686C]">
                    Desainer ini tidak ditemukan di database.
                </p>
                <RouterLink :to="{ name: 'designer-search' }"
                    class="mt-6 inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white hover:bg-[#343438]">
                    Kembali ke Daftar Desainer
                </RouterLink>
            </section>
        </main>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/layout/applayout.vue';
import ApiDesigner from '@/core/api/designer.api';
import { readErrorResponse } from '@/core/utils/apiResponse';
import DesignerFontCard from './components/DesignerFontCard.vue';

export default {
    name: 'DesignerProfileView',

    components: {
        AppLayout,
        DesignerFontCard,
    },

    data() {
        return {
            designer: null,
            isLoading: false,
            loadError: '',
        };
    },

    computed: {
        initials() {
            return this.designer?.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('') || '';
        },

        statistics() {
            return [
                { label: 'Font aktif', value: this.designer?.activeFonts },
                { label: 'Unduhan', value: this.designer?.downloads },
                { label: 'Rating', value: this.designer?.rating },
            ];
        },
    },

    created() {
        this.loadDesigner();
    },

    watch: {
        '$route.params.id'() {
            this.loadDesigner();
        },
    },

    methods: {
        async loadDesigner() {
            this.isLoading = true;
            this.loadError = '';
            this.designer = null;

            try {
                this.designer = await ApiDesigner.getById(String(this.$route.params.id));
            } catch (error) {
                console.error('Gagal memuat profil desainer:', error);
                this.loadError = readErrorResponse(
                    error,
                    'Profil desainer tidak dapat dimuat dari database.',
                );
            } finally {
                this.isLoading = false;
            }
        },

        formatNumber(value) {
            return typeof value === 'number' && Number.isFinite(value)
                ? new Intl.NumberFormat('id-ID').format(value)
                : '—';
        },
    },
};
</script>
