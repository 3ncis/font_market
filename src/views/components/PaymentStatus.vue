<script>
export default {
    name: 'PaymentStatus',

    props: {
        status: {
            type: String,
            default: 'pending',
            validator: (value) => ['pending', 'success'].includes(value),
        },
        order: {
            type: Object,
            default: null,
        },
    },

    methods: {
        formatPrice(price) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }).format(Number(price) || 0);
        },

        formatDate(value) {
            const timestamp = Date.parse(value);
            return Number.isFinite(timestamp)
                ? new Intl.DateTimeFormat('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                }).format(timestamp)
                : 'Tidak tersedia';
        },
    },

    computed: {
        isSuccess() {
            return this.status === 'success';
        },
    },
};
</script>

<template>
    <section class="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-3 sm:px-6 lg:px-20">
        <div class="flex flex-col gap-6 rounded-lg border border-[#E2E2E4] p-6 sm:p-10">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[#F6F6F5]">
                <svg v-if="!isSuccess" class="h-7 w-7 text-[#121214]" viewBox="0 0 28 28" fill="none"
                    stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <circle cx="14" cy="14" r="11.67" />
                    <path d="M14 7.5V14L18.5 17" stroke-linecap="round" />
                </svg>
                <svg v-else class="h-7 w-7 text-[#121214]" viewBox="0 0 28 28" fill="none"
                    stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <circle cx="14" cy="14" r="11.67" />
                    <path d="m8.5 14 3.5 3.5 7.5-7.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                {{ isSuccess ? 'Berhasil' : 'Pending / Belum Terkonfirmasi' }}
            </div>

            <h2 class="font-['Crimson_Pro'] text-3xl font-semibold leading-tight text-[#121214] sm:text-[40px] sm:leading-[44.8px]">
                {{ isSuccess ? 'Pembayaran terkonfirmasi.' : 'Pembayaran sedang diproses.' }}
            </h2>

            <p class="max-w-[850px] font-['Geist'] text-sm leading-relaxed text-[#68686C] sm:text-[15px] sm:leading-[23.25px]">
                {{ isSuccess
                    ? 'Pembayaran berhasil dikonfirmasi. Font dengan hak akses yang telah terverifikasi dapat ditemukan melalui Koleksi Saya.'
                    : 'Pembayaran belum terkonfirmasi. Kami belum dapat memastikan status transaksi Anda sampai konfirmasi dari sistem pembayaran tersedia.' }}
            </p>

            <div class="h-px w-full bg-[#E2E2E4]"></div>

            <div v-if="order" class="flex flex-col gap-4">
                <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                    Detail transaksi
                </h3>
                <dl class="grid grid-cols-1 gap-3 rounded border border-[#E2E2E4] p-4 text-sm sm:grid-cols-2">
                    <div>
                        <dt class="font-['Geist'] text-xs text-[#8F897F]">ID transaksi</dt>
                        <dd class="mt-1 break-all font-mono text-xs text-[#121214]">{{ order.id }}</dd>
                    </div>
                    <div>
                        <dt class="font-['Geist'] text-xs text-[#8F897F]">Tanggal transaksi</dt>
                        <dd class="mt-1 font-['Geist'] text-[#121214]">{{ formatDate(order.createdAt) }}</dd>
                    </div>
                </dl>

                <div v-if="order.items.length" class="divide-y divide-[#E2E2E4] border-y border-[#E2E2E4]">
                    <div v-for="item in order.items" :key="item.id"
                        class="flex items-start justify-between gap-4 py-3">
                        <div class="min-w-0">
                            <p class="break-words font-['Geist'] text-sm font-medium text-[#121214]">
                                {{ item.name }}
                            </p>
                            <p v-if="item.license" class="mt-1 font-['Geist'] text-xs text-[#68686C]">
                                {{ item.license }}
                            </p>
                        </div>
                        <span class="shrink-0 font-['Geist'] text-sm text-[#121214]">
                            {{ formatPrice(item.price) }}
                        </span>
                    </div>
                </div>
                <p v-else class="font-['Geist'] text-sm leading-[21.7px] text-[#68686C]">
                    Rincian font tidak tersedia pada data order.
                </p>

                <div class="flex justify-between gap-4 font-['Geist'] text-base font-semibold text-[#121214]">
                    <span>Total transaksi</span>
                    <span>{{ formatPrice(order.total) }}</span>
                </div>
            </div>

            <div v-else class="flex flex-col gap-2.5">
                <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                    Detail transaksi belum tersedia
                </h3>
                <p class="font-['Geist'] text-sm leading-[21.7px] text-[#68686C]">
                    Detail transaksi akan ditampilkan setelah data order berhasil dimuat.
                </p>
            </div>

            <div v-if="!isSuccess" class="flex flex-col gap-2 rounded bg-[#F6F6F5] p-5">
                <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                    Mengapa belum ada tombol unduh?
                </h3>
                <p class="font-['Geist'] text-sm leading-[21.7px] text-[#68686C]">
                    Unduhan font berbayar hanya tersedia setelah pembayaran dikonfirmasi dan hak akses diverifikasi.
                    Tidak ada tombol download selama status masih Pending.
                </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <RouterLink v-if="isSuccess" to="/collections"
                    class="inline-flex h-12 items-center justify-center rounded border border-[#121214] bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white transition hover:bg-[#343438]">
                    Lihat Koleksi Saya
                </RouterLink>

                <RouterLink to="/catalog" :class="[
                    'inline-flex h-12 items-center justify-center rounded px-5 font-[Geist] text-sm font-semibold transition',
                    isSuccess
                        ? 'border border-[#E2E2E4] bg-white text-[#121214] hover:bg-[#F6F6F5]'
                        : 'border border-[#121214] bg-[#121214] text-white hover:bg-[#343438]',
                ]">
                    Kembali ke Katalog
                </RouterLink>
            </div>
        </div>
    </section>
</template>
