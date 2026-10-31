<template>
    <AppLayout>
        <main class="w-full pb-16">
            <DesignerProfileBanner v-if="designer" :designer-name="designer.name" :image="designer.banner" />

            <section v-if="designer"
                class="relative mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-[405px_minmax(0,1fr)] lg:gap-10 lg:px-20 lg:pt-0">
                <aside class="w-full lg:relative lg:z-10 lg:-mt-[100px]">
                    <DesignerProfileCard :designer="designer" />
                </aside>
                <DesignerPublishedFonts :designer-name="designer.name" :fonts="designer.fonts" />
            </section>

            <section v-else class="flex min-h-[440px] flex-col items-center justify-center px-6 py-12 text-center">
                <h1 class="font-['Crimson_Pro'] text-3xl font-semibold text-[#121214]">
                    Profil desainer tidak ditemukan.
                </h1>
                <p class="mt-3 font-['Geist'] text-sm text-[#6B7280]">
                    Desainer ini tidak tercatat dalam data font yang tersedia.
                </p>
                <RouterLink :to="{ name: 'designer-search' }"
                    class="mt-6 inline-flex h-11 items-center justify-center rounded bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white hover:bg-[#343438]">
                    Kembali ke Daftar Desainer
                </RouterLink>
            </section>
        </main>
    </AppLayout>
</template>

<script>
import AppLayout from '@/components/layout/applayout.vue';
import { getDesignerById } from '@/core/designers/designerData';
import DesignerProfileBanner from './components/DesignerProfileBanner.vue';
import DesignerProfileCard from './components/DesignerProfileCard.vue';
import DesignerPublishedFonts from './components/DesignerPublishedFonts.vue';

export default {
    name: 'DesignerProfileView',

    components: {
        AppLayout,
        DesignerProfileBanner,
        DesignerProfileCard,
        DesignerPublishedFonts,
    },

    computed: {
        designer() {
            return getDesignerById(this.$route.params.id);
        },
    },

    watch: {
        designer: {
            immediate: true,
            handler(designer) {
                document.title = designer
                    ? `${designer.name} | Profil Desainer | AksaraNusa`
                    : 'Profil Desainer | AksaraNusa';
            },
        },
    },
};
</script>
