<template>
    <AppLayout>
        <section class="flex flex-col gap-5 border-b border-[#E2E2E4] px-4 pb-9 pt-10 sm:px-6 lg:px-20 lg:pt-[52px]">
            <!-- Breadcrumb -->
            <div class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                Arsip Tipografi Nusantara / Koleksi Saya
            </div>

            <!-- Heading -->
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
    </AppLayout>
</template>
<script>
import { defineComponent } from 'vue';
import AppLayout from '@/components/layout/applayout.vue';

export default defineComponent({
    components: {
        AppLayout,
    },
});
</script>