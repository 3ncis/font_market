<template>
    <Applayout>
        <div class="flex w-full flex-col gap-6 px-4 pb-8 pt-10 sm:px-6 sm:pt-12 lg:px-20 lg:pt-10">

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
                        2 keluarga font berbayar. Selangkah lagi menjadi milik karya Anda.
                    </p>

                </div>

                <!-- Continue Shopping -->
                <RouterLink to="/catalog"
                    class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#121214] transition-colors hover:text-[#68686C]">
                    <span aria-hidden="true">←</span>
                    <span>Lanjut Belanja</span>
                </RouterLink>

            </div>

        </div>
    </Applayout>
</template>
<script>
import Applayout from '@/components/layout/applayout.vue';
export default {
    name: 'CartView',
    components: { Applayout },
};
</script>