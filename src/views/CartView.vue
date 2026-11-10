<template>
    <AppLayout>
        <section class="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 pb-8 pt-10 sm:px-6 sm:pt-12 lg:px-20 lg:pt-10">

            <!-- BREADCRUMB & CHECKOUT PROGRESS -->
            <div class="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <!-- Breadcrumb -->
                <div class="font-sans text-xs text-[#68686C]">
                    <RouterLink to="/catalog" class="transition-colors hover:text-[#121214]">
                        Katalog font
                    </RouterLink>

                    <span class="mx-1">/</span>

                    <span class="text-[#121214]">Keranjang</span>
                </div>

                <!-- Checkout Progress -->
                <div class="flex flex-wrap items-center gap-3 sm:gap-5">

                    <!-- Step 1: Keranjang -->
                    <div class="flex items-center gap-2">
                        <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#121214]">
                            <span class="font-mono text-[10px] text-white">1</span>
                        </div>

                        <span class="text-xs text-[#121214]">
                            Keranjang
                        </span>

                        <div class="h-px w-4 bg-[#E2E2E4] sm:w-7"></div>
                    </div>

                    <!-- Step 2: Checkout -->
                    <div class="flex items-center gap-2">
                        <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F6F6F5]">
                            <span class="font-mono text-[10px] text-[#68686C]">2</span>
                        </div>

                        <span class="text-xs text-[#68686C]">
                            Checkout
                        </span>

                        <div class="h-px w-4 bg-[#E2E2E4] sm:w-7"></div>
                    </div>

                    <!-- Step 3: Unduh Font -->
                    <div class="flex items-center gap-2">
                        <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F6F6F5]">
                            <span class="font-mono text-[10px] text-[#68686C]">3</span>
                        </div>

                        <span class="text-xs text-[#68686C]">
                            Unduh font
                        </span>
                    </div>

                </div>
            </div>

            <!-- CART PAGE HEADING -->
            <div class="flex w-full flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <!-- Title & Description -->
                <div class="flex flex-col gap-3">

                    <span class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                        Pilihan untuk karya Anda
                    </span>

                    <h1
                        class="font-serif text-4xl font-semibold leading-tight text-[#121214] sm:text-5xl lg:text-[52px]">
                        Keranjang belanja
                    </h1>

                    <p class="text-sm leading-relaxed text-[#68686C] sm:text-[15px]">
                        {{ cartItems.length }} keluarga font berbayar. Selangkah lagi menjadi milik karya Anda.
                    </p>

                </div>

                <!-- Continue Shopping -->
                <RouterLink to="/catalog"
                    class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#121214] transition-colors hover:text-[#68686C]">
                    <span aria-hidden="true">←</span>
                    <span>Lanjut Belanja</span>
                </RouterLink>

            </div>

        </section>
        <section
            class="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-4 pb-16 pt-3 sm:px-6 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-[72px]">
            <!-- LEFT: CART ITEMS -->
            <div class="flex min-w-0 flex-1 flex-col gap-6">

                <p v-if="cartLoadError" role="alert"
                    class="rounded border border-[#D9A49D] bg-[#FFF8F6] px-4 py-3 text-sm text-[#9A3D32]">
                    {{ cartLoadError }}
                </p>

                <!-- TABLE HEADER -->
                <div class="flex items-center justify-between border-b border-[#E2E2E4] pb-3">
                    <span class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                        Font & lisensi
                    </span>

                    <span class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                        Harga
                    </span>
                </div>

                <!-- PAID FONT ITEMS -->
                <div v-if="cartItems.length" class="flex flex-col">

                    <article v-for="font in cartItems" :key="font.id"
                        class="flex flex-col gap-5 border-b border-[#E2E2E4] py-6">
                        <div class="flex flex-col gap-5 sm:flex-row sm:gap-6">

                            <!-- FONT PREVIEW -->
                            <RouterLink :to="{ name: 'font-detail', params: { id: font.id } }"
                                class="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded bg-[#F6F6F5] transition-colors hover:bg-[#F0EFED] sm:h-[148px] sm:w-[180px]">
                                <span class="max-w-full break-words px-3 text-center text-[32px] text-[#121214]" :style="{
                                    fontFamily: font.fontFamily,
                                    fontWeight: font.fontWeight,
                                    fontStyle: font.fontStyle || 'normal',
                                }">
                                    {{ font.preview }}
                                </span>
                            </RouterLink>

                            <!-- FONT DETAILS -->
                            <div class="flex min-w-0 flex-1 flex-col gap-[9px]">

                                <!-- NAME & PRICE -->
                                <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <RouterLink :to="{ name: 'font-detail', params: { id: font.id } }"
                                        class="font-serif text-2xl font-semibold leading-tight text-[#121214] transition-colors hover:text-[#68686C] sm:text-[28px]">
                                        {{ font.name }}
                                    </RouterLink>

                                    <span class="shrink-0 text-base font-semibold text-[#121214] sm:text-[17px]">
                                        {{ formatPrice(font.price) }}
                                    </span>
                                </div>

                                <!-- DESIGNER & FONT INFORMATION -->
                                <p class="text-[13px] leading-5 text-[#68686C]">
                                    oleh {{ font.designer }}
                                    · {{ font.styles }} gaya
                                    · {{ font.formats }}
                                </p>

                                <!-- LICENSE & REMOVE -->
                                <div class="flex flex-wrap items-center gap-4 pt-1">

                                    <!-- LICENSE SELECT -->
                                    <div class="relative w-full sm:max-w-[280px]">
                                        <select :value="font.license" :aria-label="`Lisensi ${font.name}`"
                                            @change="updateLicense(font.id, $event.target.value)"
                                            class="h-[42px] w-full appearance-none rounded border border-[#E2E2E4] bg-white px-[14px] pr-9 text-[13px] text-[#121214] outline-none transition-colors focus:border-[#121214]">
                                            <option v-for="license in licenseOptions" :key="license" :value="license">
                                                {{ license }}
                                            </option>
                                        </select>

                                        <svg class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                                            xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </div>

                                    <!-- REMOVE ITEM -->
                                    <button type="button"
                                        class="inline-flex shrink-0 items-center gap-1.5 text-xs text-[#68686C] transition-colors hover:text-red-600"
                                        :aria-label="`Hapus ${font.name} dari keranjang`"
                                        @click="removeFromCart(font.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4h8v2" />
                                            <path d="m19 6-1 14H6L5 6" />
                                        </svg>

                                        Hapus item
                                    </button>
                                </div>

                                <!-- LICENSE DESCRIPTION -->
                                <p class="text-xs leading-[18.6px] text-[#68686C]">
                                    {{ font.licenseDescription }}
                                </p>

                            </div>
                        </div>
                    </article>
                </div>

                <!-- EMPTY CART STATE -->
                <div v-else
                    class="flex flex-col items-center justify-center gap-4 rounded border border-dashed border-[#D1C9B8] px-5 py-12 text-center">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F6F5]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </div>

                    <div class="flex flex-col gap-1">
                        <h2 class="font-serif text-2xl font-semibold text-[#121214]">
                            Keranjang Anda masih kosong
                        </h2>

                        <p class="max-w-sm text-sm leading-relaxed text-[#68686C]">
                            Temukan rupa huruf yang sesuai dengan karya Anda melalui katalog
                            tipografi Nusantara.
                        </p>
                    </div>

                    <RouterLink :to="{ name: 'catalog' }"
                        class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#343438]">
                        Jelajahi Katalog
                    </RouterLink>
                </div>

                <!-- FREE FONT INFORMATION -->
                <div v-if="freeFont" class="flex flex-col gap-[14px] rounded-lg bg-[#F6F6F5] p-5 sm:p-6">

                    <!-- NOTICE -->
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>

                        <h3 class="text-[15px] font-semibold text-[#121214]">
                            Font gratis tidak perlu masuk keranjang.
                        </h3>
                    </div>

                    <p class="text-[13px] leading-[20.15px] text-[#68686C]">
                        Unduh langsung dari katalog atau halaman detail. Lisensi personal
                        dan komersial mengikuti ketentuan masing-masing desainer.
                    </p>

                    <div class="h-px w-full bg-[#E2E2E4]"></div>

                    <!-- FREE FONT ITEM -->
                    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div class="flex min-w-0 flex-col gap-1">
                            <h3 class="font-serif text-[23px] font-semibold text-[#121214]">
                                {{ freeFont.name }}
                            </h3>

                            <p class="text-xs text-[#68686C]">
                                Gratis · komersial dengan atribusi
                            </p>
                        </div>

                        <button type="button"
                            class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded border border-[#E2E2E4] bg-white px-5 text-sm font-semibold text-[#121214] transition-colors hover:bg-[#FAF8F5]"
                            @click="downloadFreeFont">
                            Unduh Gratis

                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" aria-hidden="true">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <path d="m7 10 5 5 5-5" />
                                <path d="M12 15V3" />
                            </svg>
                        </button>

                    </div>
                    <p v-if="downloadMessage" role="status" aria-live="polite"
                        class="text-xs text-[#68686C]">
                        {{ downloadMessage }}
                    </p>
                </div>
            </div>

            <!-- RIGHT: ORDER SUMMARY -->
            <aside
                class="flex w-full flex-col gap-[22px] rounded-lg border border-[#E2E2E4] p-5 sm:p-7 lg:sticky lg:top-[110px] lg:w-[384px] lg:shrink-0">
                <h2 class="font-serif text-[28px] font-semibold text-[#121214]">
                    Ringkasan belanja
                </h2>

                <!-- SUBTOTAL -->
                <div class="flex items-center justify-between gap-4">
                    <span class="text-sm text-[#68686C]">
                        Subtotal · {{ cartItems.length }} font
                    </span>

                    <span class="text-sm font-medium text-[#121214]">
                        {{ formatPrice(subtotal) }}
                    </span>
                </div>

                <!-- SERVICE FEE -->
                <div class="flex items-center justify-between gap-4">
                    <span class="text-sm text-[#68686C]">
                        Biaya layanan
                    </span>

                    <span class="text-sm font-medium text-[#121214]">
                        {{ formatPrice(serviceFee) }}
                    </span>
                </div>

                <p class="text-xs leading-[18.6px] text-[#68686C]">
                    Harga sudah termasuk pajak yang berlaku. Tidak ada biaya pengiriman
                    untuk produk digital.
                </p>

                <div class="h-px w-full bg-[#E2E2E4]"></div>

                <!-- TOTAL -->
                <div class="flex items-center justify-between gap-3">
                    <span class="text-base font-semibold text-[#121214]">
                        Total
                    </span>

                    <span class="font-serif text-3xl font-semibold text-[#121214] sm:text-[32px]">
                        {{ formatPrice(total) }}
                    </span>
                </div>

                <!-- CHECKOUT BUTTON -->
                <button type="button"
                    class="inline-flex h-12 w-full items-center justify-center gap-2 rounded border border-[#121214] bg-[#121214] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#343438] disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="cartItems.length === 0" @click="proceedToCheckout">
                    Lanjut ke Checkout

                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </button>

                <p class="text-xs leading-[18.6px] text-[#68686C]">
                    Lisensi atas nama pembeli. Periksa kembali jenis lisensi sebelum
                    melanjutkan.
                </p>

                <div class="h-px w-full bg-[#E2E2E4]"></div>

                <!-- PAYMENT SECURITY -->
                <div class="flex items-start gap-[10px]">
                    <svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>

                    <p class="text-xs leading-[18.6px] text-[#68686C]">
                        Pembayaran aman. Font dan dokumen lisensi tersedia setelah
                        pembayaran berhasil.
                    </p>
                </div>
            </aside>
        </section>
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
                        aria-labelledby="cart-auth-title"
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
                                Autentikasi diperlukan
                            </p>
                            <h2 id="cart-auth-title" class="mt-2 pr-8 font-serif text-3xl font-semibold text-[#121214]">
                                {{ authMode === 'login' ? 'Masuk untuk checkout' : 'Buat akun baru' }}
                            </h2>
                            <p class="mt-2 text-sm leading-6 text-[#68686C]">
                                Masuk atau daftar untuk melanjutkan ke checkout.
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
                        </div>
                    </section>
                </div>
            </Transition>
        </Teleport>
    </AppLayout>
</template>
<script>
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';
import AppLayout from '@/components/layout/applayout.vue';
import { useAuthStore } from '@/core/auth/authStores';
import { cartLicenseOptions, useCartStore } from '@/core/cart/cartStore';
import JwtService from '@/core/services/jwtService';
import { readErrorResponse } from '@/core/utils/apiResponse';

export default defineComponent({
  name: 'Cart',

  components: {
    AppLayout,
    RouterLink,
  },

  data() {
    return {
      cartStore: useCartStore(),
      authStore: useAuthStore(),
      licenseOptions: cartLicenseOptions,
      downloadMessage: '',
      cartLoadError: '',
      serviceFee: 0,
      showAuthModal: false,
      authMode: 'login',
      authName: '',
      authEmail: '',
      authPassword: '',
      authError: '',
      authSubmitting: false,
    };
  },

  async mounted() {
    try {
      await this.cartStore.loadFonts();
    } catch (error) {
      console.error('Gagal memuat font keranjang:', error);
      this.cartLoadError = 'Daftar font tidak dapat dimuat. Silakan muat ulang halaman.';
    }
  },

  computed: {
    cartItems() {
      return this.cartStore.cartItems;
    },

    freeFont() {
      return this.cartStore.freeFont;
    },

    // Menghitung subtotal seluruh font berbayar
    subtotal() {
      return this.cartItems.reduce((sum, font) => {
        return sum + font.price;
      }, 0);
    },

    // Menghitung total pembayaran
    total() {
      return this.subtotal + this.serviceFee;
    },
  },

  methods: {
    // Format angka menjadi mata uang Rupiah
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(price);
    },

    // Menghapus font dari keranjang
    removeFromCart(fontId) {
      this.cartStore.removeFont(fontId);
    },

    updateLicense(fontId, license) {
      this.cartStore.updateLicense(fontId, license);
    },

    downloadFreeFont() {
      const file = this.freeFont?.files
        ? Object.values(this.freeFont.files).find(
          (value) => typeof value === 'string' && value.trim()
        )
        : null;

      if (!file) {
        this.downloadMessage = 'File font belum tersedia untuk diunduh.';
        return;
      }

      const link = document.createElement('a');
      link.href = file;
      link.download = `${this.freeFont.id}`;
      link.click();
      this.downloadMessage = '';
    },

    proceedToCheckout() {
      if (this.cartItems.length === 0) {
        return;
      }

      if (!JwtService.getToken()) {
        this.authStore.clearAuth();
        this.authMode = 'login';
        this.authError = '';
        this.showAuthModal = true;
        return;
      }

      this.$router.push({ name: 'checkout' });
    },

    setAuthMode(mode) {
      this.authMode = mode;
      this.authError = '';
    },

    closeAuthModal() {
      if (this.authSubmitting) return;
      this.showAuthModal = false;
      this.authPassword = '';
      this.authError = '';
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
  },
});
</script>