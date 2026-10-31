<template>
    <article class="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#E2E2E4] bg-white">
        <RouterLink v-if="linkable" :to="{ name: 'font-detail', params: { id: font.id } }"
            class="group flex min-h-[168px] flex-col justify-between gap-5 bg-[#F6F6F5] p-5 transition-colors hover:bg-[#F0EFED]"
            :aria-label="`Lihat detail ${font.name}`">
            <div class="flex items-start justify-between gap-3">
                <span class="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#68686C]">
                    {{ font.category || 'Klasifikasi —' }}
                </span>
                <span class="shrink-0 rounded bg-white px-2 py-1 font-mono text-[10px] text-[#68686C]">
                    {{ font.price === 0 ? 'GRATIS' : Number.isFinite(Number(font.price)) ? 'BERBAYAR' : '—' }}
                </span>
            </div>

            <p class="break-words text-[28px] leading-tight text-[#121214] sm:text-[32px]"
                :style="previewStyle">
                {{ font.previewText || font.name }}
            </p>
        </RouterLink>
        <div v-else class="flex min-h-[168px] flex-col justify-between gap-5 bg-[#F6F6F5] p-5">
            <div class="flex items-start justify-between gap-3">
                <span class="font-mono text-[10px] font-semibold uppercase tracking-wide text-[#68686C]">
                    {{ font.category || 'Klasifikasi —' }}
                </span>
                <span class="shrink-0 rounded bg-white px-2 py-1 font-mono text-[10px] text-[#68686C]">
                    {{ font.price === 0 ? 'GRATIS' : Number.isFinite(Number(font.price)) ? 'BERBAYAR' : '—' }}
                </span>
            </div>
            <p class="break-words text-[28px] leading-tight text-[#121214] sm:text-[32px]" :style="previewStyle">
                {{ font.previewText || font.name }}
            </p>
        </div>

        <div class="flex flex-col gap-2 p-4">
            <RouterLink v-if="linkable" :to="{ name: 'font-detail', params: { id: font.id } }"
                class="font-['Geist'] text-base font-semibold text-[#121214] hover:underline">
                {{ font.name }}
            </RouterLink>
            <span v-else class="font-['Geist'] text-base font-semibold text-[#121214]">
                {{ font.name }}
            </span>
            <p class="font-['Geist'] text-xs text-[#68686C]">
                {{ styleCount === null ? '—' : styleCount }} style ·
                {{ font.price === 0 ? 'Gratis' : Number.isFinite(Number(font.price)) ? formatPrice(font.price) : '—' }}
            </p>
        </div>
    </article>
</template>

<script>
import { getFontStyleCount } from '@/core/designers/designerData';

export default {
    name: 'DesignerFontCard',

    props: {
        font: {
            type: Object,
            required: true,
        },
        linkable: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        styleCount() {
            return getFontStyleCount(this.font);
        },

        previewStyle() {
            return {
                fontFamily: `'${this.font.fontFamily || 'Crimson Pro'}', serif`,
            };
        },
    },

    methods: {
        formatPrice(price) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
            }).format(Number(price));
        },
    },
};
</script>
