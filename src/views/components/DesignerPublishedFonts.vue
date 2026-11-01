<template>
    <section class="min-w-0 flex-1 pt-0 lg:pt-10">
        <header class="flex flex-col gap-2">
            <div class="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#D35230]">
                <span class="h-px w-6 bg-[#D35230]"></span>
                Koleksi Terbitan
            </div>
            <h2 class="font-['Crimson_Pro'] text-3xl font-bold text-[#121214] sm:text-4xl">
                Semua Rupa Huruf oleh {{ designerName }}
            </h2>
        </header>

        <div v-if="fonts.length" class="mt-8 flex flex-col gap-6">
            <DesignerPublishedFontCard v-for="font in fonts" :key="font.id" :font="font"
                :designer-name="designerName" />
        </div>
        <div v-else
            class="mt-8 flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 text-center">
            <h3 class="font-['Crimson_Pro'] text-2xl font-semibold text-[#121214]">
                Belum ada font yang dipublikasikan
            </h3>
            <p class="mt-2 max-w-md font-['Geist'] text-sm leading-relaxed text-[#6B7280]">
                Belum ada font desainer ini yang dapat ditampilkan dalam katalog.
            </p>
        </div>
    </section>
</template>

<script>
import DesignerPublishedFontCard from './DesignerPublishedFontCard.vue';

export default {
    name: 'DesignerPublishedFonts',

    components: {
        DesignerPublishedFontCard,
    },

    props: {
        designerName: {
            type: String,
            required: true,
        },
        fonts: {
            type: Array,
            required: true,
        },
    },
};
</script>
