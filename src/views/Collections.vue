<template>
    <AppLayout>
        <section class="mx-auto flex w-full max-w-[1600px] flex-col gap-5 border-b border-[#E2E2E4] px-4 pb-9 pt-10 sm:px-6 lg:px-20 lg:pt-[52px]">
            <div class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                Arsip Tipografi Nusantara / Koleksi Saya
            </div>

            <div class="flex w-full items-center justify-between overflow-hidden">
                <div class="flex w-full max-w-[690px] flex-col gap-2.5">
                    <h1
                        class="font-['Crimson_Pro'] text-4xl font-semibold leading-tight text-[#121214] sm:text-5xl lg:text-[52px] lg:leading-[58.24px]">
                        Koleksi Saya
                    </h1>
                    <p
                        class="font-['Geist'] text-sm leading-relaxed text-[#68686C] sm:text-[15px] sm:leading-[23.25px]">
                        Rupa huruf dan lisensi untuk karya Anda, dalam satu tempat.
                    </p>
                </div>
            </div>
        </section>

        <section class="flex flex-col">
            <div v-if="!isCollectionEmpty"
                class="mx-auto w-full max-w-[1600px] border-b border-[#E2E2E4] px-4 py-6 sm:px-6 lg:px-20 lg:py-9">
                <div class="flex h-[52px] items-center gap-3 rounded border border-[#E2E2E4] px-4">
                    <svg class="h-4 w-4 shrink-0 text-[#8F897F]" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m16 16 4 4" />
                    </svg>
                    <input v-model="searchQuery" type="search"
                        placeholder="Cari font, desainer, atau gaya rupa..."
                        aria-label="Cari font, desainer, atau gaya rupa"
                        class="w-full bg-transparent font-['Geist'] text-sm text-[#121214] outline-none placeholder:text-[#8F897F]" />
                </div>
            </div>

            <div class="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:flex-row lg:gap-10 lg:px-20 lg:pb-16 lg:pt-9">
                <aside v-if="!isCollectionEmpty" class="w-full shrink-0 lg:w-[248px]">
                    <CollectionSidebar v-model:price="selectedPrice" v-model:categories="selectedCategories"
                        v-model:licenses="selectedLicenses" @reset="resetFilters" />
                </aside>

                <main class="flex min-w-0 flex-1 flex-col gap-6">
                    <p v-if="collectionError" role="alert"
                        class="rounded border border-[#D9A49D] bg-[#FFF8F6] px-4 py-3 font-['Geist'] text-sm text-[#9A3D32]">
                        {{ collectionError }}
                    </p>

                    <p v-else-if="collectionLoading" role="status"
                        class="py-12 text-center font-['Geist'] text-sm text-[#68686C]">
                        Memuat koleksi...
                    </p>

                    <div v-else-if="isCollectionEmpty"
                        class="flex min-h-[440px] flex-col items-center justify-center rounded-lg border border-[#E2E2E4] px-6 py-12 text-center">
                        <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F6F5]">
                            <svg class="h-7 w-7 text-[#8F897F]" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.4" aria-hidden="true">
                                <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v15H5.5A1.5 1.5 0 0 1 4 17.5z" />
                                <path d="M4 17.5A1.5 1.5 0 0 1 5.5 16H19" />
                                <path d="M8 8h7M8 11h5" />
                            </svg>
                        </div>

                        <div class="flex max-w-[440px] flex-col gap-3">
                            <h2
                                class="font-['Crimson_Pro'] text-3xl font-semibold leading-tight text-[#121214] sm:text-[32px]">
                                Koleksi Anda masih kosong.
                            </h2>
                            <p class="font-['Geist'] text-sm leading-relaxed text-[#68686C]">
                                Tambahkan font gratis ke koleksi Anda. Font berbayar hanya akan
                                muncul setelah hak pembeliannya dapat diverifikasi.
                            </p>
                        </div>

                        <button type="button"
                            class="mt-7 inline-flex h-11 items-center justify-center rounded bg-[#121214] px-6 font-['Geist'] text-sm font-medium text-white transition hover:bg-[#343438]"
                            @click="showAddDialog = true">
                            Pilih Font Gratis
                        </button>
                        <RouterLink to="/catalog"
                            class="mt-4 font-['Geist'] text-sm text-[#68686C] underline underline-offset-4 transition hover:text-[#121214]">
                            Jelajahi Katalog
                        </RouterLink>
                    </div>

                    <template v-else>
                        <CollectionToolbar v-model:preview-text="previewText" v-model:preview-size="previewSize"
                            v-model:sort-by="sortBy" />

                        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 class="font-['Geist'] text-sm font-medium text-[#121214]">
                                    {{ collectionStore.collectionFonts.length }} rupa huruf dalam koleksi
                                </h2>
                                <p class="mt-1 font-['Geist'] text-xs text-[#68686C]">
                                    {{ collectionItems.length }} ditampilkan · {{ freeFontCount }} gratis ·
                                    {{ paidFontCount }} berbayar
                                </p>
                            </div>
                            <button type="button"
                                class="inline-flex h-10 w-fit items-center justify-center rounded border border-[#121214] px-4 font-['Geist'] text-sm font-medium text-[#121214] transition hover:bg-[#F6F6F5]"
                                @click="showAddDialog = true">
                                Tambah font gratis
                            </button>
                        </div>

                        <div v-if="collectionItems.length" class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <CollectionFontCard v-for="font in collectionItems" :key="font.id" :font="font"
                                :preview-text="previewText" :preview-size="previewSize"
                                @remove-request="openRemoveModal" />
                        </div>
                        <CollectionNoResults v-else :search-query="searchQuery" @reset="resetFilters" />

                        <p class="border-t border-[#E2E2E4] pt-5 font-['Geist'] text-xs leading-relaxed text-[#8F897F]">
                            Font gratis yang dipilih tersimpan pada koleksi akun Anda dan disinkronkan dengan database.
                            Font berbayar memerlukan catatan pembelian terverifikasi.
                        </p>
                    </template>
                </main>
            </div>
        </section>

        <ConfirmRemoveModal :show="showRemoveModal" :font="selectedFont" @cancel="closeRemoveModal"
            @confirm="confirmRemoveFont" />

        <div v-if="showAddDialog" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            role="presentation" @click.self="showAddDialog = false">
            <section class="max-h-[85vh] w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-xl"
                role="dialog" aria-modal="true" aria-labelledby="add-font-title">
                <div class="flex items-start justify-between gap-4 border-b border-[#E2E2E4] p-5 sm:p-6">
                    <div>
                        <h2 id="add-font-title" class="font-['Geist'] text-lg font-semibold text-[#121214]">
                            Tambahkan font gratis
                        </h2>
                        <p class="mt-1 font-['Geist'] text-sm text-[#68686C]">
                            Pilih font untuk menyimpannya di koleksi akun ini.
                        </p>
                    </div>
                    <button type="button" class="px-2 text-xl leading-none text-[#68686C] hover:text-[#121214]"
                        aria-label="Tutup" @click="showAddDialog = false">
                        ×
                    </button>
                </div>

                <div class="p-5 sm:p-6">
                    <input v-model="availableSearchQuery" type="search" placeholder="Cari font gratis..."
                        aria-label="Cari font gratis"
                        class="h-11 w-full rounded border border-[#E2E2E4] px-3 font-['Geist'] text-sm outline-none focus:border-[#121214]" />

                    <p v-if="collectionError" role="alert" class="mt-3 font-['Geist'] text-sm text-[#9A3D32]">
                        {{ collectionError }}
                    </p>

                    <div class="mt-4 max-h-[50vh] overflow-y-auto">
                        <p v-if="availableFontsLoading" role="status"
                            class="py-8 text-center font-['Geist'] text-sm text-[#68686C]">
                            Memuat font...
                        </p>
                        <div v-else-if="availableFreeFonts.length" class="divide-y divide-[#E2E2E4]">
                            <article v-for="font in availableFreeFonts" :key="font.id"
                                class="flex items-center justify-between gap-4 py-4">
                                <div class="min-w-0">
                                    <h3 class="truncate font-['Geist'] text-sm font-semibold text-[#121214]">
                                        {{ font.name }}
                                    </h3>
                                    <p class="mt-1 truncate font-['Geist'] text-xs text-[#68686C]">
                                        {{ font.designer }} · {{ font.category }}
                                    </p>
                                </div>
                                <button type="button"
                                    class="h-9 shrink-0 rounded bg-[#121214] px-3 font-['Geist'] text-xs font-medium text-white hover:bg-[#343438]"
                                    @click="addFont(font)">
                                    Tambahkan
                                </button>
                            </article>
                        </div>
                        <p v-else class="py-8 text-center font-['Geist'] text-sm text-[#68686C]">
                            Tidak ada font gratis lain yang cocok.
                        </p>
                    </div>

                    <div class="mt-4 flex justify-end border-t border-[#E2E2E4] pt-4">
                        <button type="button"
                            class="h-10 rounded border border-[#E2E2E4] px-4 font-['Geist'] text-sm text-[#343438]"
                            @click="showAddDialog = false">
                            Selesai
                        </button>
                    </div>
                </div>
            </section>
        </div>

        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-3 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-3 opacity-0"
            >
                <div
                    v-if="showAuthModal"
                    class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#121214]/60 p-4 backdrop-blur-sm sm:p-6"
                    @click.self="closeAuthModal"
                >
                    <section
                        class="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="collection-auth-title"
                    >
                        <div class="h-1.5 bg-gradient-to-r from-[#B8955A] via-[#121214] to-[#B8955A]"></div>
                        <button
                            type="button"
                            class="absolute right-5 top-6 rounded-full p-2 text-[#68686C] transition hover:bg-[#F6F6F5] hover:text-[#121214]"
                            aria-label="Tutup dialog autentikasi"
                            @click="closeAuthModal"
                        >
                            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor"
                                stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
                                <path d="m6 6 12 12M18 6 6 18" />
                            </svg>
                        </button>

                        <div class="p-6 sm:p-8">
                            <div class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F1E8] text-[#8A6A36]">
                                <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor"
                                    stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <path d="M12 3 5 6v5c0 4.5 2.9 8.3 7 10 4.1-1.7 7-5.5 7-10V6l-7-3Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>

                            <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A6A36]">
                                Sesi perlu diperbarui
                            </p>
                            <h2 id="collection-auth-title" class="mt-2 pr-8 font-serif text-3xl font-semibold text-[#121214]">
                                {{ authMode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru' }}
                            </h2>
                            <p class="mt-2 text-sm leading-6 text-[#68686C]">
                                Sesi Anda telah berakhir atau tidak valid. Masuk atau daftar untuk mengakses koleksi Anda.
                            </p>

                            <div class="mt-6 grid grid-cols-2 rounded-lg bg-[#F6F6F5] p-1">
                                <button
                                    type="button"
                                    class="rounded-md px-3 py-2.5 text-sm font-semibold transition"
                                    :class="authMode === 'login' ? 'bg-white text-[#121214] shadow-sm' : 'text-[#68686C] hover:text-[#121214]'"
                                    @click="setAuthMode('login')"
                                >
                                    Masuk
                                </button>
                                <button
                                    type="button"
                                    class="rounded-md px-3 py-2.5 text-sm font-semibold transition"
                                    :class="authMode === 'register' ? 'bg-white text-[#121214] shadow-sm' : 'text-[#68686C] hover:text-[#121214]'"
                                    @click="setAuthMode('register')"
                                >
                                    Daftar
                                </button>
                            </div>

                            <form class="mt-5 flex flex-col gap-4" @submit.prevent="submitAuth">
                                <label v-if="authMode === 'register'" class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                                    Nama
                                    <input
                                        v-model="authName"
                                        type="text"
                                        autocomplete="name"
                                        required
                                        :disabled="authSubmitting"
                                        class="h-11 rounded-lg border border-[#E2E2E4] px-3 outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                                        placeholder="Nama lengkap"
                                    />
                                </label>
                                <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                                    Email
                                    <input
                                        v-model="authEmail"
                                        type="email"
                                        autocomplete="email"
                                        required
                                        :disabled="authSubmitting"
                                        class="h-11 rounded-lg border border-[#E2E2E4] px-3 outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                                        placeholder="nama@email.com"
                                    />
                                </label>
                                <label class="flex flex-col gap-2 text-sm font-medium text-[#121214]">
                                    Password
                                    <input
                                        v-model="authPassword"
                                        type="password"
                                        :autocomplete="authMode === 'login' ? 'current-password' : 'new-password'"
                                        required
                                        :disabled="authSubmitting"
                                        class="h-11 rounded-lg border border-[#E2E2E4] px-3 outline-none transition focus:border-[#121214] disabled:bg-[#F6F6F5]"
                                        placeholder="Masukkan password"
                                    />
                                </label>

                                <p v-if="authError" role="alert"
                                    class="rounded-lg border border-[#D9A49D] bg-[#FFF8F6] px-3 py-2 text-sm text-[#9A3D32]">
                                    {{ authError }}
                                </p>

                                <button
                                    type="submit"
                                    :disabled="authSubmitting"
                                    class="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#121214] px-5 text-sm font-semibold text-white transition hover:bg-[#343438] disabled:cursor-wait disabled:opacity-60"
                                >
                                    {{ authSubmitting ? 'Memproses...' : authMode === 'login' ? 'Masuk ke akun' : 'Buat akun' }}
                                    <span v-if="!authSubmitting" aria-hidden="true">→</span>
                                </button>
                            </form>

                            <button
                                type="button"
                                class="mt-4 w-full py-2 text-sm font-medium text-[#68686C] transition hover:text-[#121214]"
                                @click="closeAuthModal"
                            >
                                Lanjutkan tanpa masuk
                            </button>
                        </div>
                    </section>
                </div>
            </Transition>
        </Teleport>
    </AppLayout>
</template>

<script>
import { defineComponent } from 'vue';
import AppLayout from '@/components/layout/applayout.vue';
import { useAuthStore } from '@/core/auth/authStores';
import { useRouter } from 'vue-router';
import { useCollectionStore } from '@/core/collection/collectionStore';
import ApiFont from '@/core/api/font/font.api';
import { readErrorResponse } from '@/core/utils/apiResponse';
import CollectionSidebar from './components/CollectionSidebar.vue';
import CollectionToolbar from './components/CollectionToolbar.vue';
import CollectionFontCard from './components/CollectionFontCard.vue';
import CollectionNoResults from './components/CollectionNoResults.vue';
import ConfirmRemoveModal from './components/ConfirmRemoveModal.vue';
import router from '@/router/index.ts';

function categoryMatches(font, selectedCategory) {
    const category = String(font.category || '').toLowerCase();

    switch (selectedCategory) {
        case 'Serif tradisional':
            return category.includes('serif') && !category.includes('sans');
        case 'Sans modern':
            return category.includes('sans');
        case 'Display ekspresif':
            return category.includes('display');
        case 'Aksara daerah':
            return /ethnic|traditional|ornamental|decorative/.test(category);
        case 'Kaligrafi & coretan':
            return /script|calligraphy|handwritten|cursive|brush/.test(category);
        default:
            return false;
    }
}

function licenseMatches(font, selectedLicense) {
    const license = String(font.license || font.licenseType || font.licenseDescription || '').toLowerCase();

    switch (selectedLicense) {
        case 'Komersial gratis':
            return Number(font.price) === 0 && /commercial|komersial/.test(license);
        case 'Personal/nonkomersial':
            return /personal|non.?commercial|non.?komersial/.test(license);
        case 'Desktop berbayar':
            return Number(font.price) > 0 && /desktop/.test(license);
        case 'Web berbayar':
            return Number(font.price) > 0 && /web/.test(license);
        case 'Aplikasi berbayar':
            return Number(font.price) > 0 && /application|aplikasi|\bapp\b/.test(license);
        default:
            return false;
    }
}

export default defineComponent({
    name: 'CollectionMain',

    components: {
        AppLayout,
        CollectionSidebar,
        CollectionToolbar,
        CollectionFontCard,
        CollectionNoResults,
        ConfirmRemoveModal,
    },

    data() {
        return {
            authStore: useAuthStore(),
            collectionStore: useCollectionStore(),
            searchQuery: '',
            availableSearchQuery: '',
            previewText: 'Lembut elok rumpun padi.',
            previewSize: 43,
            sortBy: 'latest',
            selectedPrice: 'all',
            selectedCategories: [],
            selectedLicenses: [],
            availableFonts: [],
            availableFontsLoading: false,
            showAddDialog: false,
            showRemoveModal: false,
            selectedFont: null,
            collectionError: '',
            collectionLoading: false,
            showAuthModal: false,
            authMode: 'login',
            authName: '',
            authEmail: '',
            authPassword: '',
            authError: '',
            authSubmitting: false,
        };
    },

    computed: {
        accountKey() {
            const user = this.authStore.currentUser;
            if (user?.id !== undefined && user?.id !== null) return `user-${user.id}`;
            if (user?.email) return `email-${String(user.email).trim().toLowerCase()}`;
            return 'guest';
        },

        isCollectionEmpty() {
            return !this.collectionLoading && this.collectionStore.collectionFonts.length === 0;
        },

        collectionItems() {
            const query = this.searchQuery.trim().toLowerCase();

            let result = this.collectionStore.collectionFonts.filter((font) => {
                const searchableText = [font.name, font.designer, font.category]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                const matchesSearch = !query || searchableText.includes(query);
                const matchesPrice = this.selectedPrice === 'all' ||
                    (this.selectedPrice === 'free' && Number(font.price) === 0) ||
                    (this.selectedPrice === 'paid' && Number(font.price) > 0);
                const matchesCategory = !this.selectedCategories.length ||
                    this.selectedCategories.some((category) => categoryMatches(font, category));
                const matchesLicense = !this.selectedLicenses.length ||
                    this.selectedLicenses.some((license) => licenseMatches(font, license));

                return matchesSearch && matchesPrice && matchesCategory && matchesLicense;
            });

            if (this.sortBy === 'name-asc') {
                result = result.sort((first, second) => first.name.localeCompare(second.name));
            } else if (this.sortBy === 'name-desc') {
                result = result.sort((first, second) => second.name.localeCompare(first.name));
            } else {
                result = result.sort((first, second) =>
                    Date.parse(second.acquiredAt) - Date.parse(first.acquiredAt));
            }

            return result;
        },

        availableFreeFonts() {
            const query = this.availableSearchQuery.trim().toLowerCase();
            const ownedIds = new Set(this.collectionStore.items.map((item) => item.id));

            return this.availableFonts.filter((font) => {
                if (Number(font.price) !== 0 || ownedIds.has(String(font.id))) return false;
                const searchableText = [font.name, font.designer, font.category]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return !query || searchableText.includes(query);
            });
        },

        freeFontCount() {
            return this.collectionStore.collectionFonts.filter((font) => Number(font.price) === 0).length;
        },

        paidFontCount() {
            return this.collectionStore.collectionFonts.filter((font) => Number(font.price) > 0).length;
        },
    },

    watch: {
        accountKey(nextAccountKey) {
            this.loadCollection(nextAccountKey);
        },
        showAddDialog(isOpen) {
            if (isOpen && !this.availableFonts.length) {
                this.loadAvailableFonts();
            }
        },
    },

    created() {
        void this.loadCollection(this.accountKey);
    },

    methods: {
        async loadCollection(accountKey) {
            this.collectionError = '';
            this.collectionLoading = true;
            try {
                await this.collectionStore.loadForAccount(accountKey);
            } catch (error) {
                console.error('Gagal memuat koleksi font:', error);
                if (this.handleAuthError(error)) return;
                this.collectionError = readErrorResponse(
                    error,
                    'Koleksi tidak dapat dimuat dari database.',
                );
            } finally {
                this.collectionLoading = false;
            }
        },

        async loadAvailableFonts() {
            this.collectionError = '';
            this.availableFontsLoading = true;
            try {
                this.availableFonts = await ApiFont.getAll();
            } catch (error) {
                console.error('Gagal memuat daftar font:', error);
                if (this.handleAuthError(error)) return;
                this.collectionError = readErrorResponse(
                    error,
                    'Daftar font tidak dapat dimuat dari database.',
                );
            } finally {
                this.availableFontsLoading = false;
            }
        },

        async addFont(font) {
            this.collectionError = '';
            try {
                const result = await this.collectionStore.addFreeFont(font);
                if (result.added) {
                    this.availableSearchQuery = '';
                    return;
                }

                this.collectionError = result.reason === 'duplicate'
                    ? 'Font tersebut sudah ada di koleksi.'
                    : 'Font tidak tersedia untuk ditambahkan ke koleksi.';
            } catch (error) {
                console.error('Gagal menyimpan font ke koleksi:', error);
                if (this.handleAuthError(error)) return;
                this.collectionError = readErrorResponse(
                    error,
                    'Font tidak dapat disimpan ke database.',
                );
            }
        },

        openRemoveModal(font) {
            if (!font || Number(font.price) !== 0) return;

            this.collectionError = '';
            this.selectedFont = font;
            this.showRemoveModal = true;
        },

        closeRemoveModal() {
            this.showRemoveModal = false;
            this.selectedFont = null;
        },

        async confirmRemoveFont() {
            if (!this.selectedFont || Number(this.selectedFont.price) !== 0) {
                this.collectionError = 'Font ini tidak dapat dihapus dari koleksi.';
                return;
            }

            this.collectionError = '';
            try {
                const result = await this.collectionStore.removeFreeFont(this.selectedFont.id);
                if (!result.removed) {
                    this.collectionError = 'Font tidak dapat dihapus dari koleksi.';
                    return;
                }

                this.closeRemoveModal();
            } catch (error) {
                console.error('Gagal menghapus font dari koleksi:', error);
                if (this.handleAuthError(error)) return;
                this.collectionError = readErrorResponse(
                    error,
                    'Font tidak dapat dihapus dari database.',
                );
            }
        },

        handleAuthError(error) {
            const response = error?.response ?? error;
            const status = response?.status;
            const responseData = response?.data;
            const backendMessage = [
                responseData?.message,
                responseData?.error,
                error?.message,
            ]
                .filter((message) => typeof message === 'string')
                .join(' ');
            const invalidTokenMessage =
                /\b(invalid|expired|expire)\b.*\b(token|jwt)\b|\b(token|jwt)\b.*\b(invalid|expired|expire)\b/i
                    .test(backendMessage);

            if (status !== 401 && !invalidTokenMessage) return false;

            this.authStore.clearAuth();
            this.authError = '';
            this.authMode = 'login';
            this.showAuthModal = true;
            return true;
        },

        setAuthMode(mode) {
            this.authMode = mode;
            this.authError = '';
        },

        closeAuthModal() {
            router.back();
            this.showAuthModal = false;
            this.authPassword = '';

        },

        async submitAuth() {
            if (this.authSubmitting) return;

            this.authError = '';
            this.authSubmitting = true;
            try {
                if (this.authMode === 'register') {
                    await this.authStore.register(
                        this.authName.trim(),
                        this.authEmail.trim(),
                        this.authPassword,
                    );
                } else {
                    await this.authStore.login(
                        this.authEmail.trim(),
                        this.authPassword,
                    );
                }

                this.showAuthModal = false;
                this.authPassword = '';
            } catch (error) {
                this.authError = readErrorResponse(
                    error,
                    this.authMode === 'login'
                        ? 'Login gagal. Periksa kembali email dan password Anda.'
                        : 'Pendaftaran gagal. Silakan periksa data Anda dan coba lagi.',
                );
            } finally {
                this.authSubmitting = false;
            }
        },

        resetFilters() {
            this.searchQuery = '';
            this.selectedPrice = 'all';
            this.selectedCategories = [];
            this.selectedLicenses = [];
            this.sortBy = 'latest';
        },
    },
});
</script>
