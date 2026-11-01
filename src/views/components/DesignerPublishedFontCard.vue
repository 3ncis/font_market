<template>
    <article class="flex min-w-0 flex-col gap-7 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
        <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
                <h3 class="break-words font-['Crimson_Pro'] text-[22px] font-bold text-[#121214]">
                    {{ font.name }}
                </h3>
                <p class="mt-1 font-['Geist'] text-[13px] text-[#524E48]">
                    oleh <span class="font-semibold text-[#D35230]">{{ designerName }}</span>
                </p>
            </div>
            <span class="shrink-0 rounded border border-[#E5E7EB] px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase text-[#6B7280]">
                {{ font.category || '—' }}
            </span>
        </div>

        <div class="flex min-h-[72px] items-center py-3">
            <p class="w-full break-words text-3xl leading-tight text-[#121214] sm:text-4xl"
                :style="previewStyle">
                {{ font.previewText || font.name }}
            </p>
        </div>

        <div class="flex items-center justify-between gap-4">
            <span class="font-mono text-xs text-[#6B7280]">
                {{ styleCount === null ? '—' : styleCount }} Style / Weight
            </span>
            <RouterLink :to="{ name: 'font-detail', params: { id: font.id } }"
                class="inline-flex shrink-0 items-center gap-2 font-['Geist'] text-[13px] font-bold text-[#121214] hover:underline">
                Lihat Detail
                <svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor"
                    stroke-width="1.5" aria-hidden="true">
                    <path d="M3.5 12.5 12 4M5 4h7v7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </RouterLink>
        </div>
    </article>
</template>

<script>
import { getFontStyleCount } from '@/core/designers/designerData';

export default {
    name: 'DesignerPublishedFontCard',

    props: {
        font: {
            type: Object,
            required: true,
        },
        designerName: {
            type: String,
            required: true,
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
};
</script>
