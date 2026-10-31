<script>
export default {
    name: 'PaymentStatus',

    props: {
        status: {
            type: String,
            default: 'pending',
            validator: (value) => ['pending', 'success'].includes(value),
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

            <div class="flex flex-col gap-2.5">
                <h3 class="font-['Geist'] text-sm font-semibold text-[#121214]">
                    Detail transaksi belum tersedia
                </h3>
                <p class="font-['Geist'] text-sm leading-[21.7px] text-[#68686C]">
                    ID dan tanggal transaksi hanya akan ditampilkan jika datanya tersedia.
                    <template v-if="!isSuccess">
                        Ringkasan pesanan di halaman ini bukan bukti pembayaran.
                    </template>
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
