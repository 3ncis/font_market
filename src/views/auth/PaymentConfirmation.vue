<template>
    <AppLayout>
        <section class="mx-auto w-full max-w-[1600px] px-4 pb-9 pt-10 sm:px-6 lg:px-20 lg:pt-10">
            <p class="font-['Geist'] text-xs leading-[18.6px] text-[#68686C]">
                Katalog font / Checkout / Konfirmasi
            </p>
        </section>

        <PaymentStatus
            :status="paymentStatus === 'success' ? 'success' : 'pending'"
            :order="transactionDetails"
        />

        <div v-if="paymentPreview && !showPaymentModal && paymentStatus !== 'success'" class="mx-auto -mt-10 w-full max-w-[1600px] px-4 pb-16 text-center sm:px-6 lg:px-20">
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
                                Status payment dari backend: {{ paymentStatus }}. QR dan kode di bawah hanya contoh UI
                                dan tidak dapat digunakan untuk membayar.
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
                        Preview ditutup, tetapi payment pending di backend tidak dibatalkan.
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

        <Teleport to="body">
            <div v-if="showExpiredModal"
                class="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(18,18,20,0.65)] p-4">
                <section class="w-full max-w-md rounded-lg border border-[#E2E2E4] bg-white p-6 shadow-2xl sm:p-8"
                    role="alertdialog" aria-modal="true" aria-labelledby="expired-order-title">
                    <h2 id="expired-order-title"
                        class="font-['Crimson_Pro'] text-[28px] font-semibold leading-tight text-[#121214]">
                        Waktu pembayaran telah habis
                    </h2>
                    <p class="mt-3 font-['Geist'] text-sm leading-relaxed text-[#68686C]">
                        Pesanan ini sudah tidak tersedia. Katalog Anda tetap tersimpan dan Anda akan diarahkan kembali
                        ke keranjang.
                    </p>
                    <div class="mt-6 flex justify-end">
                        <button type="button"
                            class="inline-flex h-11 items-center justify-center rounded bg-[#121214] px-4 font-['Geist'] text-sm font-semibold text-white hover:bg-[#343438]"
                            @click="leaveExpiredOrder">
                            Kembali ke keranjang
                        </button>
                    </div>
                </section>
            </div>
        </Teleport>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/layout/applayout.vue';
import { useCartStore } from '@/core/cart/cartStore';
import { useAuthStore } from '@/core/auth/authStores';
import { useCollectionStore } from '@/core/collection/collectionStore';
import ApiOrder from '@/core/api/order/order.api';
import {
    createDemoQrSvg,
    usePaymentPreviewStore,
} from '@/core/payment/paymentPreview';
import PaymentStatus from '@/views/components/PaymentStatus.vue';

const objectIdPattern = /^[a-f\d]{24}$/i;
const MAX_TIMEOUT_MS = 2_147_483_647;

function getErrorStatus(error) {
    const status = error?.response?.status;
    return Number.isInteger(status) ? status : undefined;
}

function getExpiryTimestamp(order) {
    const expiryValues = [order?.expired_at, order?.payment?.expired_at]
        .filter((value) => typeof value === 'string')
        .map(Date.parse)
        .filter(Number.isFinite);

    return expiryValues.length ? Math.min(...expiryValues) : NaN;
}

function getOrderErrorMessage(error) {
    const status = getErrorStatus(error);
    if (status === 400) return 'Data pesanan tidak dapat diverifikasi.';
    if (status === 401 || status === 403) return 'Sesi Anda tidak dapat digunakan. Silakan masuk kembali.';
    if (status === 409) return 'Pesanan tidak lagi tersedia untuk pembayaran.';
    if (status === 500) return 'Layanan sedang bermasalah. Silakan coba kembali beberapa saat lagi.';
    if (
        error?.request ||
        error?.code === 'ERR_NETWORK' ||
        error?.code === 'ECONNABORTED'
    ) {
        return 'Koneksi ke layanan pembayaran gagal. Periksa jaringan lalu coba kembali.';
    }
    if (!error?.response) return 'Respons layanan tidak dapat diproses. Silakan coba kembali.';
    return 'Status pesanan tidak dapat dimuat. Silakan coba kembali.';
}

function isBackendOrder(value) {
    return value &&
        typeof value === 'object' &&
        typeof value.id === 'string' &&
        objectIdPattern.test(value.id) &&
        value.payment &&
        typeof value.payment.id === 'string' &&
        objectIdPattern.test(value.payment.id);
}

function getOrderItems(order) {
    if (!Array.isArray(order.items)) return [];

    return order.items.map((item, index) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
            throw new TypeError('The order API returned an invalid order item.');
        }

        const font = item.font && typeof item.font === 'object'
            ? item.font
            : null;
        const fontReference = item.font_id ?? item.fontId;
        const rawId = fontReference && typeof fontReference === 'object'
            ? fontReference.id ?? fontReference._id ?? font?.id ?? font?._id ?? item.id
            : fontReference ?? font?.id ?? font?._id ?? item.id;

        return {
            id: String(rawId ?? `order-item-${index}`),
            name: item.font_name ?? font?.name ?? item.name ?? 'Font',
            price: Number(item.price ?? item.unit_price) || 0,
            license: item.license ?? '',
        };
    });
}

export default {
    name: 'PaymentConfirmation',

    components: {
        AppLayout,
        PaymentStatus,
    },

    data() {
        return {
            paymentPreviewStore: usePaymentPreviewStore(),
            cartStore: useCartStore(),
            authStore: useAuthStore(),
            collectionStore: useCollectionStore(),
            transactionOrder: null,
            showPaymentModal: false,
            showCloseConfirmation: false,
            showExpiredModal: false,
            loadError: '',
            copyError: '',
            copied: false,
            demoVirtualAccount: 'DEMO-TIDAK-VALID',
            paymentStatus: 'pending',
            expiryTimer: null,
            redirectTimer: null,
            isCheckingOrder: false,
            expiryCheckRequested: false,
            expiredModalShown: false,
            hasLoadedOrder: false,
            purchasedOrderId: null,
        };
    },

    computed: {
        paymentPreview() {
            return this.paymentPreviewStore.preview;
        },

        paymentMethodTitle() {
            return this.paymentPreview?.paymentMethod === 'va'
                ? 'Transfer Virtual Account'
                : 'Pembayaran QRIS';
        },

        transactionDetails() {
            if (!this.transactionOrder) return null;

            const items = getOrderItems(this.transactionOrder);
            const itemTotal = items.reduce((total, item) => total + item.price, 0);
            const reportedTotal = Number(
                this.transactionOrder.total ?? this.transactionOrder.total_amount,
            );

            return {
                id: this.transactionOrder.id,
                createdAt: this.transactionOrder.created_at,
                items,
                total: Number.isFinite(reportedTotal) ? reportedTotal : itemTotal,
            };
        },
    },

    mounted() {
        window.addEventListener('keydown', this.handleEscape);
        window.addEventListener('focus', this.refreshOrderOnReturn);
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        void this.loadOrder();
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.handleEscape);
        window.removeEventListener('focus', this.refreshOrderOnReturn);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        this.clearTimers();
    },

    methods: {
        async loadOrder() {
            this.loadError = '';
            if (!this.paymentPreviewStore.pendingOrder) {
                this.loadError = 'Data preview pembayaran tidak dapat dimuat. Kembali ke checkout dan coba lagi.';
                return;
            }

            await this.refreshOrder();
        },

        async refreshOrder(expiryCheck = false) {
            const savedOrder = this.paymentPreviewStore.pendingOrder;
            if (!savedOrder || this.showExpiredModal) return;
            if (this.isCheckingOrder) {
                if (expiryCheck) this.expiryCheckRequested = true;
                return;
            }

            this.isCheckingOrder = true;
            this.loadError = '';

            try {
                const order = await ApiOrder.getById(savedOrder.orderId);
                if (!isBackendOrder(order) || order.id !== savedOrder.orderId) {
                    throw new TypeError('The order API returned an invalid order.');
                }

                const payment = order.payment;
                if (payment.id !== savedOrder.paymentId) {
                    throw new TypeError('The order API returned an unexpected payment.');
                }

                const isFirstOrderLoad = !this.hasLoadedOrder;
                this.transactionOrder = order;
                this.restorePreview(order, savedOrder);
                this.paymentStatus = payment.gateway_status;
                this.hasLoadedOrder = true;

                const expiryTimestamp = getExpiryTimestamp(order);
                if (!Number.isFinite(expiryTimestamp)) {
                    throw new TypeError('The order API returned an invalid expiration time.');
                }
                const expiredAt = new Date(expiryTimestamp).toISOString();
                this.paymentPreviewStore.setPendingOrder({
                    ...savedOrder,
                    expiredAt,
                });

                if (payment.gateway_status === 'success') {
                    this.expiryCheckRequested = false;
                    this.clearExpiryTimer();
                    this.showPaymentModal = false;
                    this.showCloseConfirmation = false;
                    const successErrors = [];
                    try {
                        await this.cartStore.clearCatalogAfterPayment();
                    } catch (error) {
                        console.error('Catalog gagal dibersihkan setelah payment sukses:', error);
                        successErrors.push('Keranjang lokal tidak dapat dibersihkan.');
                    }
                    if (this.purchasedOrderId !== order.id) {
                        try {
                            await this.refreshPurchasedCollection();
                            this.purchasedOrderId = order.id;
                        } catch (error) {
                            console.error('Koleksi gagal diperbarui setelah payment sukses:', error);
                            successErrors.push(
                                'Koleksi belum dapat diperbarui. Buka kembali Koleksi Saya beberapa saat lagi.',
                            );
                        }
                    }
                    this.loadError = successErrors.join(' ');
                    return;
                }

                if (isFirstOrderLoad) {
                    this.showPaymentModal = true;
                }

                if (
                    order.status === 'expired' ||
                    payment.gateway_status === 'expired'
                ) {
                    this.expiryCheckRequested = false;
                    this.handleExpiredOrder();
                    return;
                }

                if (
                    order.status === 'failed' ||
                    payment.gateway_status === 'failed'
                ) {
                    this.expiryCheckRequested = false;
                    this.clearExpiryTimer();
                    this.loadError = 'Pembayaran gagal. Katalog Anda tetap tersimpan; silakan kembali ke keranjang untuk mencoba lagi.';
                    return;
                }

                const remainingMs =
                    expiryTimestamp -
                    (Date.now() + savedOrder.serverTimeOffsetMs);
                if (remainingMs <= 0) {
                    this.handleExpiredOrder();
                    return;
                }

                this.scheduleExpiryCheck(remainingMs);
            } catch (error) {
                const status = getErrorStatus(error);
                if (status === 404 || status === 410) {
                    this.handleExpiredOrder();
                } else if (
                    expiryCheck &&
                    Date.parse(savedOrder.expiredAt) <=
                        Date.now() + savedOrder.serverTimeOffsetMs
                ) {
                    this.handleExpiredOrder();
                } else {
                    console.error('Gagal memuat status order:', error);
                    this.loadError = getOrderErrorMessage(error);
                }
            } finally {
                this.isCheckingOrder = false;
                if (this.expiryCheckRequested) {
                    this.expiryCheckRequested = false;
                    void this.refreshOrder(true);
                }
            }
        },

        restorePreview(order, savedOrder) {
            const items = getOrderItems(order);
            const subtotal = items.reduce((total, item) => total + item.price, 0);
            const reportedTotal = Number(order.total ?? order.total_amount);
            const total = Number.isFinite(reportedTotal) ? reportedTotal : subtotal;
            this.paymentPreviewStore.setPreview({
                ...this.paymentPreview,
                paymentMethod: savedOrder.paymentMethod === 'bank_transfer' ? 'va' : 'qris',
                buyer: this.paymentPreview?.buyer ?? {
                    fullName: '',
                    email: '',
                    whatsapp: '',
                    company: '',
                },
                items,
                subtotal,
                serviceFee: Math.max(0, total - subtotal),
                total,
                createdAt: order.created_at ?? this.paymentPreview?.createdAt,
            });
        },

        async refreshPurchasedCollection() {
            let user = this.authStore.currentUser;
            if (!user) {
                user = await this.authStore.loadCurrentUser();
            }
            if (!user) {
                throw new Error('Pengguna terautentikasi tidak tersedia.');
            }

            const accountKey = user.id !== undefined && user.id !== null
                ? `user-${user.id}`
                : user.email
                    ? `email-${String(user.email).trim().toLowerCase()}`
                    : 'guest';
            await this.collectionStore.loadForAccount(accountKey);
        },

        scheduleExpiryCheck(remainingMs) {
            this.clearExpiryTimer();
            this.expiryTimer = window.setTimeout(
                () => void this.refreshOrder(true),
                Math.min(remainingMs, MAX_TIMEOUT_MS),
            );
        },

        clearExpiryTimer() {
            if (this.expiryTimer !== null) {
                window.clearTimeout(this.expiryTimer);
                this.expiryTimer = null;
            }
        },

        clearTimers() {
            this.clearExpiryTimer();
            if (this.redirectTimer !== null) {
                window.clearTimeout(this.redirectTimer);
                this.redirectTimer = null;
            }
        },

        handleVisibilityChange() {
            if (document.visibilityState === 'visible') {
                void this.refreshOrderOnReturn();
            }
        },

        refreshOrderOnReturn() {
            void this.refreshOrder();
        },

        handleExpiredOrder() {
            if (this.expiredModalShown) return;

            this.expiryCheckRequested = false;
            this.expiredModalShown = true;
            this.showExpiredModal = true;
            this.showPaymentModal = false;
            this.showCloseConfirmation = false;
            this.paymentStatus = 'expired';
            this.clearExpiryTimer();
            this.paymentPreviewStore.clearPreview();
            try {
                this.paymentPreviewStore.clearPendingOrder();
            } catch (error) {
                console.error('Data order expired tidak dapat dihapus:', error);
            }
            this.redirectTimer = window.setTimeout(
                () => void this.leaveExpiredOrder(),
                3500,
            );
        },

        async leaveExpiredOrder() {
            this.clearTimers();
            await this.$router.push({ name: 'cart' });
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
            if (this.showExpiredModal) return;

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
