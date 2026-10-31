<template>
    <article class="flex min-w-0 flex-col overflow-hidden rounded border border-[#E2E2E4] bg-white">
        <div class="flex items-start justify-between gap-4 border-b border-[#E2E2E4] px-5 py-4">
            <div class="min-w-0">
                <h3 class="truncate font-['Geist'] text-base font-semibold text-[#121214]">
                    {{ font.name }}
                </h3>
                <p class="mt-1 truncate font-['Geist'] text-xs text-[#68686C]">
                    {{ font.designer }}
                </p>
            </div>
            <span class="shrink-0 rounded bg-[#F6F6F5] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-[#68686C]">
                Gratis
            </span>
        </div>

        <div class="flex min-h-[190px] items-center justify-center overflow-hidden bg-[#F6F6F5] px-5 py-8">
            <p class="max-w-full break-words text-center leading-tight text-[#121214]"
                :style="previewStyle">
                {{ previewText || font.name }}
            </p>
        </div>

        <div class="flex flex-col gap-4 p-5">
            <div class="flex flex-wrap items-center justify-between gap-2 font-['Geist'] text-xs text-[#68686C]">
                <span>{{ font.category || 'Klasifikasi belum dicantumkan' }}</span>
                <span>{{ licenseLabel }}</span>
            </div>

            <p v-if="!fontAsset" class="font-['Geist'] text-xs text-[#8F897F]">
                Berkas font belum tersedia untuk diunduh.
            </p>
            <p v-if="downloadError" role="status" class="font-['Geist'] text-xs text-[#9A3D32]">
                {{ downloadError }}
            </p>

            <div class="flex flex-wrap items-center gap-3">
                <button type="button" :disabled="!fontAsset"
                    class="inline-flex h-10 items-center justify-center rounded bg-[#121214] px-4 font-['Geist'] text-sm font-medium text-white transition hover:bg-[#343438] disabled:cursor-not-allowed disabled:opacity-50"
                    :title="fontAsset ? 'Unduh berkas font' : 'Berkas font belum tersedia'"
                    @click="downloadFont">
                    Unduh Gratis
                </button>
                <button v-if="isFree" type="button"
                    class="h-10 px-2 font-['Geist'] text-sm text-[#68686C] transition hover:text-[#121214]"
                    @click="requestRemoval">
                    Hapus
                </button>
            </div>
        </div>
    </article>
</template>

<script>
import { getFontAsset } from '@/core/collection/fontAssets';

export default {
    name: 'CollectionFontCard',

    props: {
        font: { type: Object, required: true },
        previewText: { type: String, required: true },
        previewSize: { type: Number, required: true },
    },

    emits: ['remove-request'],

    data() {
        return {
            downloadError: '',
        };
    },

    computed: {
        fontAsset() {
            return getFontAsset(this.font.id);
        },

        previewStyle() {
            return {
                fontFamily: this.fontAsset ? `'${this.font.fontFamily}', sans-serif` : 'sans-serif',
                fontSize: `${this.previewSize}px`,
                whiteSpace: 'pre-line',
            };
        },

        licenseLabel() {
            return this.font.license || this.font.licenseType || 'Lisensi belum dicantumkan';
        },

        isFree() {
            return Number(this.font.price) === 0;
        },
    },

    methods: {
        downloadFont() {
            this.downloadError = '';
            if (!this.fontAsset) {
                this.downloadError = 'Berkas font belum tersedia untuk diunduh.';
                return;
            }

            const link = document.createElement('a');
            link.href = this.fontAsset.url;
            link.download = this.fontAsset.filename;
            link.click();
        },

        requestRemoval() {
            if (!this.isFree) return;
            this.$emit('remove-request', this.font);
        },
    },
};
</script>
