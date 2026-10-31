<template>
    <AppLayout>
        <section class="mx-auto w-full max-w-[1600px] px-4 pb-9 pt-10 sm:px-6 lg:px-20 lg:pt-10">
            <p class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
                Katalog font / Checkout / Konfirmasi
            </p>
        </section>

        <PaymentStatus status="pending" />

        <div v-if="paymentPreview && !showPaymentModal" class="mx-auto -mt-10 w-full max-w-[1600px] px-4 pb-16 text-center sm:px-6 lg:px-20">
            <button type="button"
                class="font-['Geist'] text-sm font-semibold text-[#68686C] underline underline-offset-4 transition hover:text-[#121214]"
                @click="showPaymentModal = true">
                Buka kembali preview pembayaran
            </button>
        </div>

        <p v-if="loadError" role="alert"
            class="mx-auto mb-8 w-[calc(100%-2rem)] max-w-[1440px] rounded border border-[#D9A49D] bg-[#FFF8F6] px-4 py-3 font-['Geist'] text-sm text-[#9A3D32] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-10rem)]">
            {{ loadError }}
        </p>

        <Teleport to="body">
            <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showPaymentModal && paymentPreview"
                    class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[rgba(18,18,20,0.55)] p-3 sm:p-6"
                    @click.self="requestClosePaymentModal">
                    <section
                        class="relative my-auto max-h-[94vh] w-full max-w-[960px] overflow-y-auto rounded-lg border border-[#E2E2E4] bg-white p-5 shadow-2xl sm:p-8"
                        role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
                        <button type="button"
                            class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded border border-[#E2E2E4] text-2xl leading-none text-[#68686C] transition hover:bg-[#F6F6F5] hover:text-[#121214]"
                            aria-label="Tutup popup pembayaran" @click="requestClosePaymentModal">
                            ×
                        </button>

                        <div class="pr-12">
                            <p class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#9A3D32]">
                                Preview demo · tidak dapat digunakan untuk membayar
                            </p>
                            <h2 id="payment-modal-title"
                                class="mt-2 font-['Crimson_Pro'] text-3xl font-semibold text-[#121214] sm:text-4xl">
                                {{ paymentMethodTitle }}
                            </h2>
                            <p class="mt-2 font-['Geist'] text-sm leading-relaxed text-[#68686C]">
                                Belum ada pembayaran yang dibuat atau dikonfirmasi. QR dan kode di bawah hanya contoh
                                UI.
                            </p>
                        </div>

                        <div class="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div class="flex min-w-0 flex-col gap-6">
                                <section class="rounded border border-[#E2E2E4] p-4 sm:p-5">
                                    <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                                        Data pembeli
                                    </h3>
                                    <dl class="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
                                        <div>
                                            <dt class="font-['Geist'] text-xs text-[#8F897F]">Nama</dt>
                                            <dd class="mt-1 break-words font-['Geist'] text-[#121214]">
                                                {{ paymentPreview.buyer.fullName }}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt class="font-['Geist'] text-xs text-[#8F897F]">Email</dt>
                                            <dd class="mt-1 break-words font-['Geist'] text-[#121214]">
                                                {{ paymentPreview.buyer.email }}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt class="font-['Geist'] text-xs text-[#8F897F]">WhatsApp</dt>
                                            <dd class="mt-1 break-words font-['Geist'] text-[#121214]">
                                                {{ paymentPreview.buyer.whatsapp }}
                                            </dd>
                                        </div>
                                        <div v-if="paymentPreview.buyer.company">
                                            <dt class="font-['Geist'] text-xs text-[#8F897F]">Studio / perusahaan</dt>
                                            <dd class="mt-1 break-words font-['Geist'] text-[#121214]">
                                                {{ paymentPreview.buyer.company }}
                                            </dd>
                                        </div>
                                    </dl>
                                </section>

                                <section class="rounded border border-[#E2E2E4] p-4 sm:p-5">
                                    <div class="flex items-center justify-between gap-4">
                                        <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                                            Ringkasan pesanan
                                        </h3>
                                        <span class="font-mono text-[10px] uppercase text-[#68686C]">
                                            {{ paymentPreview.items.length }} font
                                        </span>
                                    </div>

                                    <div class="mt-4 divide-y divide-[#E2E2E4]">
                                        <div v-for="item in paymentPreview.items" :key="item.id"
                                            class="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                            <div class="min-w-0">
                                                <p
                                                    class="break-words font-['Geist'] text-sm font-medium text-[#121214]">
                                                    {{ item.name }}
                                                </p>
                                                <p class="mt-1 font-['Geist'] text-xs text-[#68686C]">
                                                    {{ item.license }}
                                                </p>
                                            </div>
                                            <span class="shrink-0 font-['Geist'] text-sm text-[#121214]">
                                                {{ formatPrice(item.price) }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mt-4 flex flex-col gap-2 border-t border-[#E2E2E4] pt-4">
                                        <div class="flex justify-between gap-4 font-['Geist'] text-sm text-[#68686C]">
                                            <span>Subtotal</span>
                                            <span>{{ formatPrice(paymentPreview.subtotal) }}</span>
                                        </div>
                                        <div v-if="paymentPreview.serviceFee"
                                            class="flex justify-between gap-4 font-['Geist'] text-sm text-[#68686C]">
                                            <span>Biaya layanan</span>
                                            <span>{{ formatPrice(paymentPreview.serviceFee) }}</span>
                                        </div>
                                        <div
                                            class="flex justify-between gap-4 pt-1 font-['Geist'] text-base font-semibold text-[#121214]">
                                            <span>Total</span>
                                            <span>{{ formatPrice(paymentPreview.total) }}</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <aside class="flex flex-col items-center rounded bg-[#F6F6F5] p-5 text-center sm:p-6">
                                <template v-if="paymentPreview.paymentMethod === 'qris'">
                                    <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                                        QRIS demo
                                    </h3>
                                    <p class="mt-2 font-['Geist'] text-xs leading-relaxed text-[#9A3D32]">
                                        Bukan QR pembayaran. Jangan pindai untuk membayar.
                                    </p>
                                    <div class="mt-4 w-full max-w-[280px] rounded bg-white p-3">
                                        <svg class="h-auto w-full" viewBox="0 0 260 300" role="img"
                                            aria-label="Ilustrasi QR demo yang tidak dapat digunakan untuk membayar">
                                            <rect width="260" height="300" rx="8" fill="#F6F6F5" />
                                            <g fill="#121214">
                                                <rect x="14" y="14" width="72" height="72" />
                                                <rect x="26" y="26" width="48" height="48" fill="#F6F6F5" />
                                                <rect x="38" y="38" width="24" height="24" />
                                                <rect x="174" y="14" width="72" height="72" />
                                                <rect x="186" y="26" width="48" height="48" fill="#F6F6F5" />
                                                <rect x="198" y="38" width="24" height="24" />
                                                <rect x="14" y="174" width="72" height="72" />
                                                <rect x="26" y="186" width="48" height="48" fill="#F6F6F5" />
                                                <rect x="38" y="198" width="24" height="24" />
                                                <path
                                                    d="M102 14h12v12h-12zM126 14h12v12h-12zM102 38h12v12h-12zM138 38h12v12h-12zM102 62h12v12h-12zM126 62h12v12h-12zM98 98h12v12H98zM122 98h12v12h-12zM146 98h12v12h-12zM170 98h12v12h-12zM194 98h12v12h-12zM218 98h12v12h-12zM98 122h12v12H98zM134 122h12v12h-12zM170 122h12v12h-12zM206 122h12v12h-12zM98 146h12v12H98zM122 146h12v12h-12zM158 146h12v12h-12zM194 146h12v12h-12zM98 170h12v12H98zM122 170h12v12h-12zM158 170h12v12h-12zM194 170h12v12h-12zM98 194h12v12H98zM122 194h12v12h-12zM146 194h12v12h-12zM182 194h12v12h-12zM218 194h12v12h-12zM98 218h12v12H98zM134 218h12v12h-12zM170 218h12v12h-12zM206 218h12v12h-12zM98 242h12v12H98zM122 242h12v12h-12zM158 242h12v12h-12zM194 242h12v12h-12zM218 242h12v12h-12z" />
                                            </g>
                                            <rect x="28" y="112" width="204" height="54" rx="6" fill="white"
                                                stroke="#9A3D32" stroke-width="2" />
                                            <text x="130" y="135" text-anchor="middle" fill="#9A3D32"
                                                font-family="Arial,sans-serif" font-size="15"
                                                font-weight="700">DEMO</text>
                                            <text x="130" y="153" text-anchor="middle" fill="#9A3D32"
                                                font-family="Arial,sans-serif" font-size="10">BUKAN QR PEMBAYARAN</text>
                                        </svg>
                                    </div>
                                    <button type="button"
                                        class="mt-4 inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded border border-[#121214] bg-white px-4 font-['Geist'] text-sm font-semibold text-[#121214] transition hover:bg-[#EDE8DF]"
                                        @click="downloadDemoQr">
                                        Unduh QR demo
                                    </button>
                                </template>

                                <template v-else>
                                    <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                                        Virtual Account demo
                                    </h3>
                                    <p class="mt-2 font-['Geist'] text-xs leading-relaxed text-[#9A3D32]">
                                        Kode contoh, bukan nomor pembayaran yang valid.
                                    </p>
                                    <div
                                        class="mt-6 flex w-full max-w-[280px] items-center gap-2 rounded border border-[#E2E2E4] bg-white p-2">
                                        <code
                                            class="min-w-0 flex-1 break-all px-2 text-left font-mono text-sm font-semibold text-[#121214]">
                                            {{ demoVirtualAccount }}
                                        </code>
                                        <button type="button"
                                            class="h-10 shrink-0 rounded bg-[#121214] px-3 font-['Geist'] text-xs font-semibold text-white transition hover:bg-[#343438]"
                                            @click="copyDemoVirtualAccount">
                                            {{ copied ? 'Tersalin' : 'Salin kode demo' }}
                                        </button>
                                    </div>
                                    <p v-if="copyError" role="alert" class="mt-3 font-['Geist'] text-xs text-[#9A3D32]">
                                        {{ copyError }}
                                    </p>
                                    <p class="mt-5 max-w-[280px] font-['Geist'] text-xs leading-relaxed text-[#68686C]">
                                        Kode ini hanya untuk menguji tampilan tombol salin. Jangan gunakan sebagai
                                        tujuan transfer.
                                    </p>
                                </template>
                            </aside>
                        </div>

                        <div class="mt-7 flex justify-end border-t border-[#E2E2E4] pt-5">
                            <button type="button"
                                class="inline-flex h-11 items-center justify-center rounded border border-[#E2E2E4] bg-white px-5 font-['Geist'] text-sm font-semibold text-[#121214] transition hover:bg-[#F6F6F5]"
                                @click="requestClosePaymentModal">
                                Tutup popup
                            </button>
                        </div>
                    </section>
                </div>
            </Transition>
        </Teleport>

        <Teleport to="body">
            <div v-if="showCloseConfirmation"
                class="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(18,18,20,0.65)] p-4"
                @click.self="showCloseConfirmation = false">
                <section class="w-full max-w-md rounded-lg border border-[#E2E2E4] bg-white p-6 shadow-2xl sm:p-8"
                    role="alertdialog" aria-modal="true" aria-labelledby="close-confirmation-title">
                    <h2 id="close-confirmation-title"
                        class="font-['Crimson_Pro'] text-[28px] font-semibold leading-tight text-[#121214]">
                        Tutup popup pembayaran?
                    </h2>
                    <p class="mt-3 font-['Geist'] text-sm leading-relaxed text-[#68686C]">
                        Preview pembayaran akan ditutup. Tidak ada pembayaran yang sedang diproses.
                    </p>
                    <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button type="button"
                            class="inline-flex h-11 items-center justify-center rounded border border-[#E2E2E4] px-4 font-['Geist'] text-sm font-semibold text-[#121214] hover:bg-[#F6F6F5]"
                            @click="showCloseConfirmation = false">
                            Lanjut melihat
                        </button>
                        <button type="button"
                            class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-4 font-['Geist'] text-sm font-semibold text-white hover:bg-[#343438]"
                            @click="confirmClosePaymentModal">
                            Ya, tutup popup
                        </button>
                    </div>
                </section>
            </div>
        </Teleport>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/layout/applayout.vue';
import {
    createDemoQrSvg,
    loadPaymentPreview,
} from '@/core/payment/paymentPreview';
import PaymentStatus from '@/views/components/PaymentStatus.vue';

export default {
    name: 'PaymentConfirmation',

    components: {
        AppLayout,
        PaymentStatus,
    },

    data() {
        return {
            paymentPreview: null,
            showPaymentModal: false,
            showCloseConfirmation: false,
            loadError: '',
            copyError: '',
            copied: false,
            demoVirtualAccount: 'DEMO-TIDAK-VALID',
        };
    },

    computed: {
        paymentMethodTitle() {
            return this.paymentPreview?.paymentMethod === 'va'
                ? 'Transfer Virtual Account'
                : 'Pembayaran QRIS';
        },
    },

    mounted() {
        this.loadPreview();
        window.addEventListener('keydown', this.handleEscape);
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.handleEscape);
    },

    methods: {
        loadPreview() {
            this.loadError = '';
            try {
                this.paymentPreview = loadPaymentPreview();
                this.showPaymentModal = Boolean(this.paymentPreview);
            } catch (error) {
                console.error('Gagal memuat preview pembayaran:', error);
                this.loadError = 'Data preview pembayaran tidak dapat dimuat. Kembali ke checkout dan coba lagi.';
            }
        },

        formatPrice(price) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }).format(Number(price) || 0);
        },

        requestClosePaymentModal() {
            this.showCloseConfirmation = true;
        },

        confirmClosePaymentModal() {
            this.showPaymentModal = false;
            this.showCloseConfirmation = false;
        },

        handleEscape(event) {
            if (event.key !== 'Escape') return;

            if (this.showCloseConfirmation) {
                this.showCloseConfirmation = false;
            } else if (this.showPaymentModal) {
                this.requestClosePaymentModal();
            }
        },

        downloadDemoQr() {
            const blob = new Blob([createDemoQrSvg()], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qris-demo-tidak-valid.svg';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        },

        async copyDemoVirtualAccount() {
            this.copyError = '';
            this.copied = false;

            try {
                if (!navigator.clipboard?.writeText) {
                    throw new Error('Clipboard API tidak tersedia.');
                }

                await navigator.clipboard.writeText(this.demoVirtualAccount);
                this.copied = true;
            } catch (error) {
                console.error('Gagal menyalin kode Virtual Account demo:', error);
                this.copyError = 'Kode tidak dapat disalin. Salin teks demo secara manual.';
            }
        },
    },
};
</script>
