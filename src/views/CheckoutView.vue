<template>
  <AppLayout>
    <section class="flex w-full flex-col gap-6 overflow-hidden px-4 pb-9 pt-10 sm:px-6 lg:px-20">
      <!-- Breadcrumb & Checkout Progress -->
      <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <!-- Breadcrumb -->
        <div class="font-['Geist'] text-xs font-normal text-[#68686C]">
          Katalog font / Keranjang / Checkout
        </div>

        <!-- Progress Indicator -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-5">
          <!-- Step 1: Keranjang -->
          <div class="flex items-center gap-2">
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F6F6F5]">
              <span class="font-['Geist_Mono'] text-[10px] font-normal text-[#68686C]">
                1
              </span>
            </div>

            <span class="font-['Geist'] text-xs font-normal text-[#68686C]">
              Keranjang
            </span>

            <div class="h-px w-7 bg-[#E2E2E4]"></div>
          </div>

          <!-- Step 2: Checkout (Active) -->
          <div class="flex items-center gap-2">
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#121214]">
              <span class="font-['Geist_Mono'] text-[10px] font-normal text-white">
                2
              </span>
            </div>

            <span class="font-['Geist'] text-xs font-normal text-[#121214]">
              Checkout
            </span>

            <div class="h-px w-7 bg-[#E2E2E4]"></div>
          </div>

          <!-- Step 3: Unduh Font -->
          <div class="flex items-center gap-2">
            <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F6F6F5]">
              <span class="font-['Geist_Mono'] text-[10px] font-normal text-[#68686C]">
                3
              </span>
            </div>

            <span class="font-['Geist'] text-xs font-normal text-[#68686C]">
              Unduh font
            </span>
          </div>
        </div>
      </div>

      <!-- Checkout Heading -->
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <!-- Title & Description -->
        <div class="flex flex-col items-start gap-2.5">
          <span class="font-['Geist_Mono'] text-[11px] font-semibold uppercase text-[#68686C]">
            Selesaikan pembelian
          </span>

          <h1
            class="font-['Crimson_Pro'] text-4xl font-semibold leading-tight text-[#121214] sm:text-5xl lg:text-[52px]">
            Karya berikutnya dimulai di sini.
          </h1>

          <p class="font-['Geist'] text-sm font-normal text-[#68686C] sm:text-[15px]">
            Lengkapi data lisensi dan pilih cara pembayaran Anda.
          </p>
        </div>

        <!-- Payment Security -->
        <div class="flex shrink-0 items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"
            aria-hidden="true">
            <path
              d="M9 1.5L15.75 4.125V8.25C15.75 12.1875 12.9375 15.375 9 16.5C5.0625 15.375 2.25 12.1875 2.25 8.25V4.125L9 1.5Z"
              stroke="#121214" stroke-width="1.5" stroke-linejoin="round" />
          </svg>

          <span class="font-['Geist'] text-xs font-normal text-[#68686C]">
            Pembayaran aman &amp; terenkripsi
          </span>
        </div>
      </div>
    </section>
    <section
      class="flex w-full flex-col gap-10 overflow-hidden px-4 pb-16 pt-3 sm:px-6 lg:flex-row lg:items-start lg:gap-16 lg:px-20">
      <!-- LEFT: BUYER FORM & PAYMENT METHODS -->
      <div class="flex min-w-0 flex-1 flex-col gap-9">
        <!-- 01 — DATA PEMBELI -->
        <section class="flex flex-col gap-[22px]">
          <div class="flex items-center justify-between gap-4">
            <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214] sm:text-[28px]">
              01 — Data pembeli
            </h2>

            <span class="shrink-0 font-['Geist'] text-xs text-[#68686C]">
              * Wajib diisi
            </span>
          </div>

          <div class="h-px w-full bg-[#E2E2E4]"></div>

          <form class="flex flex-col gap-5" @submit.prevent="proceedToPayment">
            <!-- Full Name & Email -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex min-w-0 flex-col gap-2">
                <label for="buyer-name" class="font-['Geist'] text-[13px] font-medium text-[#121214]">
                  Nama lengkap / pemegang lisensi *
                </label>

                <input id="buyer-name" v-model="buyer.fullName" type="text" autocomplete="name"
                  placeholder="Masukkan nama lengkap" required
                  class="h-12 w-full rounded border border-[#E2E2E4] bg-white px-4 font-['Geist'] text-sm text-[#121214] outline-none transition-colors placeholder:text-[#9A9A9E] focus:border-[#121214]" />
              </div>

              <div class="flex min-w-0 flex-col gap-2">
                <label for="buyer-email" class="font-['Geist'] text-[13px] font-medium text-[#121214]">
                  Alamat email *
                </label>

                <input id="buyer-email" v-model="buyer.email" type="email" autocomplete="email"
                  placeholder="nama@email.com" required
                  class="h-12 w-full rounded border border-[#E2E2E4] bg-white px-4 font-['Geist'] text-sm text-[#121214] outline-none transition-colors placeholder:text-[#9A9A9E] focus:border-[#121214]" />
              </div>
            </div>

            <!-- WhatsApp & Company -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex min-w-0 flex-col gap-2">
                <label for="buyer-whatsapp" class="font-['Geist'] text-[13px] font-medium text-[#121214]">
                  Nomor WhatsApp *
                </label>

                <input id="buyer-whatsapp" v-model="buyer.whatsapp" type="tel" autocomplete="tel"
                  placeholder="08xx xxxx xxxx" required
                  class="h-12 w-full rounded border border-[#E2E2E4] bg-white px-4 font-['Geist'] text-sm text-[#121214] outline-none transition-colors placeholder:text-[#9A9A9E] focus:border-[#121214]" />
              </div>

              <div class="flex min-w-0 flex-col gap-2">
                <label for="buyer-company" class="font-['Geist'] text-[13px] font-medium text-[#121214]">
                  Nama studio / perusahaan (opsional)
                </label>

                <input id="buyer-company" v-model="buyer.company" type="text" autocomplete="organization"
                  placeholder="Nama studio atau perusahaan"
                  class="h-12 w-full rounded border border-[#E2E2E4] bg-white px-4 font-['Geist'] text-sm text-[#121214] outline-none transition-colors placeholder:text-[#9A9A9E] focus:border-[#121214]" />
              </div>
            </div>
          </form>

          <p class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
            Dokumen lisensi diterbitkan atas nama pemegang lisensi di atas.
            Tautan unduhan dan bukti pembayaran dikirim ke email Anda.
          </p>
        </section>

        <!-- 02 — METODE PEMBAYARAN -->
        <section class="flex flex-col gap-[18px]">
          <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214] sm:text-[28px]">
            02 — Metode pembayaran
          </h2>

          <div class="h-px w-full bg-[#E2E2E4]"></div>

          <div class="flex flex-col gap-3">
            <label v-for="method in paymentMethods" :key="method.id" :class="[
              'flex cursor-pointer flex-col gap-3 rounded border p-[18px] transition-colors',
              paymentMethod === method.id
                ? 'border-[#121214] bg-[#F6F6F5] ring-1 ring-inset ring-[#121214]'
                : 'border-[#E2E2E4] bg-white hover:border-[#A6A6AA]',
            ]">
              <div class="flex items-center gap-3.5">
                <!-- Custom Radio -->
                <span :class="[
                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border',
                  paymentMethod === method.id
                    ? 'border-[#121214]'
                    : 'border-[#E2E2E4]',
                ]">
                  <span v-if="paymentMethod === method.id" class="h-2 w-2 rounded-full bg-[#121214]"></span>
                </span>

                <input v-model="paymentMethod" type="radio" name="payment-method" :value="method.id" class="sr-only" />

                <div class="flex min-w-0 flex-1 flex-col gap-[5px]">
                  <span class="font-['Geist'] text-sm font-semibold text-[#121214]">
                    {{ method.name }}
                  </span>

                  <span class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
                    {{ method.description }}
                  </span>
                </div>

                <!-- Payment Method Badge -->
                <div
                  class="flex h-8 w-[46px] shrink-0 items-center justify-center rounded border border-[#E2E2E4] bg-white">
                  <span class="font-['Geist_Mono'] text-sm font-semibold text-[#121214]">
                    {{ method.badge }}
                  </span>
                </div>
              </div>

              <!-- QRIS Additional Information -->
              <div v-if="method.id === 'qris' && paymentMethod === 'qris'" class="ml-8 flex flex-col gap-2">
                <div class="h-px w-full bg-[#E2E2E4]"></div>

                <p class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
                  {{ method.detail }}
                </p>
              </div>
            </label>
          </div>
        </section>

        <!-- BACK TO CART -->
        <div>
          <RouterLink :to="{ name: 'cart' }"
            class="inline-flex items-center font-['Geist'] text-[13px] font-semibold text-[#121214] transition-colors hover:text-[#68686C]">
            ← Kembali ke Keranjang
          </RouterLink>
        </div>
      </div>

      <!-- RIGHT: ORDER SUMMARY -->
      <aside
        class="flex w-full min-w-0 flex-col gap-[22px] rounded-lg border border-[#E2E2E4] p-5 sm:p-7 lg:sticky lg:top-24 lg:w-[416px] lg:shrink-0">
        <!-- Summary Heading -->
        <div class="flex items-center justify-between gap-3">
          <h2 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214] sm:text-[28px]">
            Pesanan Anda
          </h2>

          <span class="shrink-0 font-['Geist_Mono'] text-[11px] font-normal text-[#68686C]">
            {{ cartItems.length }} FONT
          </span>
        </div>

        <!-- Empty Cart -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-start gap-3 rounded bg-[#F6F6F5] p-5">
          <p class="font-['Geist'] text-sm font-medium text-[#121214]">
            Keranjang Anda masih kosong.
          </p>

          <RouterLink :to="{ name: 'catalog' }"
            class="font-['Geist'] text-sm font-semibold text-[#121214] underline underline-offset-4">
            Jelajahi katalog font
          </RouterLink>
        </div>

        <!-- Actual Cart Items -->
        <div v-else class="flex flex-col gap-6">
          <div v-for="item in cartItems" :key="item.id" class="flex flex-col gap-2.5">
            <!-- Font Preview -->
            <div class="flex min-h-[72px] items-center overflow-hidden bg-[#F6F6F5] p-4">
              <span class="break-words text-[28px] leading-tight text-[#121214]" :class="item.fontFamily
                ? ''
                : 'font-[inherit]'
                " :style="item.fontFamily
                  ? { fontFamily: item.fontFamily }
                  : {}
                  ">
                {{ item.name }}
              </span>
            </div>

            <!-- Font Details & Price -->
            <div class="flex items-start justify-between gap-3">
              <span class="font-['Geist'] text-xs font-normal text-[#68686C]">
                {{ getFontStyles(item) }} gaya ·
                {{ getFontFormats(item) }}
              </span>

              <span class="shrink-0 font-['Geist'] text-[13px] font-semibold text-[#121214]">
                {{ formatPrice(item.price) }}
              </span>
            </div>

            <p class="font-['Geist'] text-xs text-[#68686C]">
              {{ item.license || 'Desktop · 1 pengguna' }} · berlaku selamanya
            </p>
          </div>
        </div>

        <template v-if="cartItems.length > 0">
          <div class="h-px w-full bg-[#E2E2E4]"></div>

          <!-- Subtotal -->
          <div class="flex items-center justify-between gap-3">
            <span class="font-['Geist'] text-sm text-[#68686C]">
              Subtotal
            </span>

            <span class="font-['Geist'] text-sm font-medium text-[#121214]">
              {{ formatPrice(subtotal) }}
            </span>
          </div>

          <!-- Service Fee -->
          <div class="flex items-center justify-between gap-3">
            <span class="font-['Geist'] text-sm text-[#68686C]">
              Biaya layanan
            </span>

            <span class="font-['Geist'] text-sm font-medium text-[#121214]">
              {{ formatPrice(serviceFee) }}
            </span>
          </div>

          <p class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
            Sudah termasuk pajak yang berlaku.
          </p>

          <div class="h-px w-full bg-[#E2E2E4]"></div>

          <!-- Total -->
          <div class="flex items-center justify-between gap-3">
            <span class="font-['Geist'] text-base font-semibold text-[#121214]">
              Total pembayaran
            </span>

            <span class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214] sm:text-[32px]">
              {{ formatPrice(total) }}
            </span>
          </div>

          <!-- Terms Checkbox -->
          <label class="flex cursor-pointer items-start gap-2.5">
            <input v-model="agreedToTerms" type="checkbox"
              class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#121214]" />

            <span class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
              Saya menyetujui ketentuan pembelian dan lisensi Desktop untuk
              seluruh font di atas.
            </span>
          </label>

          <!-- Pay Button -->
          <button type="button" :disabled="!agreedToTerms || isSubmitting"
            class="flex h-12 w-full items-center justify-center gap-2.5 rounded border border-[#121214] bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white transition-colors hover:bg-[#383735] disabled:cursor-not-allowed disabled:opacity-50"
            @click="proceedToPayment">
            <span>Bayar {{ formatPrice(total) }}</span>

            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"
              aria-hidden="true">
              <path d="M3.75 9H14.25M14.25 9L9 3.75M14.25 9L9 14.25" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <p class="font-['Geist'] text-[11px] leading-[17px] text-[#68686C]">
            Anda akan melanjutkan ke proses pembayaran melalui metode yang
            dipilih. Tidak ada biaya layanan tambahan.
          </p>

          <div class="h-px w-full bg-[#E2E2E4]"></div>

          <!-- After Payment -->
          <div class="flex flex-col gap-2.5">
            <span class="font-['Geist_Mono'] text-[11px] font-semibold uppercase text-[#68686C]">
              Setelah pembayaran berhasil
            </span>

            <p class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
              Unduh seluruh berkas font dan dokumen lisensi melalui Koleksi
              Saya. Salinan bukti pembelian juga dikirim ke email Anda.
            </p>
          </div>
        </template>
      </aside>
    </section>
  </AppLayout>
</template>
<script>
import AppLayout from '@/components/layout/applayout.vue';
import { useCartStore } from '@/core/cart/cartStore';

export default {
  name: 'CheckoutView',

  components: {
    AppLayout,
  },

  data() {
    return {
      cartStore: useCartStore(),
      buyer: {
        fullName: '',
        email: '',
        whatsapp: '',
        company: '',
      },

      paymentMethod: 'qris',
      agreedToTerms: false,
      isSubmitting: false,
      serviceFee: 0,
    };
  },

  computed: {
    cartItems() {
      return this.cartStore.cartItems;
    },

    subtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + Number(item.price || 0);
      }, 0);
    },

    total() {
      return this.subtotal + this.serviceFee;
    },

    paymentMethods() {
      return [
        {
          id: 'qris',
          name: 'QRIS',
          description:
            'Pindai dengan GoPay, OVO, DANA, ShopeePay, atau aplikasi bank.',
          badge: 'QR',
          detail:
            'Kode QR muncul setelah Anda menekan tombol pembayaran. Selesaikan pembayaran dalam 30 menit.',
        },
        {
          id: 'va',
          name: 'Transfer Virtual Account',
          description:
            'BCA, BNI, BRI, Mandiri, dan Permata · verifikasi otomatis.',
          badge: 'VA',
        },
        {
          id: 'ewallet',
          name: 'Dompet digital',
          description:
            'GoPay, OVO, atau DANA · lanjutkan melalui aplikasi Anda.',
          badge: 'Rp',
        },
        {
          id: 'card',
          name: 'Kartu debit / kredit',
          description:
            'Visa & Mastercard · kartu berlogo yang didukung.',
          badge: '••',
        },
      ];
    },
  },

  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(price || 0);
    },

    getFontStyles(font) {
      return font.styles || font.styleCount || font.stylesCount || 0;
    },

    getFontFormats(font) {
      if (Array.isArray(font.formats)) {
        return font.formats.join(' + ');
      }

      return font.formats || 'OTF + TTF';
    },

    validateForm() {
      if (!this.cartItems.length) {
        alert('Keranjang Anda masih kosong.');
        return false;
      }

      if (
        !this.buyer.fullName.trim() ||
        !this.buyer.email.trim() ||
        !this.buyer.whatsapp.trim()
      ) {
        alert('Mohon lengkapi seluruh data pembeli yang wajib diisi.');
        return false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(this.buyer.email)) {
        alert('Mohon masukkan alamat email yang valid.');
        return false;
      }

      if (!this.agreedToTerms) {
        alert('Mohon setujui ketentuan pembelian dan lisensi terlebih dahulu.');
        return false;
      }

      return true;
    },

    async proceedToPayment() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 200));

        alert(
          'Formulir valid. Integrasi pembayaran belum tersedia. ' +
          'Metode yang dipilih: ' +
          this.paymentMethods.find((method) => method.id === this.paymentMethod)?.name,
        );
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>