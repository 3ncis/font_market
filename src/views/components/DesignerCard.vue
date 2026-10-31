<template>
    <article
        class="flex h-full cursor-pointer flex-col gap-5 overflow-hidden rounded-xl border border-[#E2E2E4] bg-white p-5 transition hover:border-[#121214] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121214] focus-visible:ring-offset-2 sm:p-6"
        role="link"
        tabindex="0"
        :aria-label="`Lihat profil desainer ${designer.name}`"
        @click="openProfile"
        @keydown.enter.self="openProfile">
        <div class="flex flex-col items-center gap-4">
            <div v-if="designer.avatar"
                class="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-[#F6F6F5]">
                <img :src="designer.avatar" :alt="designer.name" class="h-full w-full object-cover" />
            </div>
            <div v-else
                class="flex h-[120px] w-[120px] items-center justify-center rounded-full border border-[#E2E2E4] bg-[#F6F6F5] font-['Crimson_Pro'] text-4xl font-semibold text-[#121214]"
                role="img" :aria-label="`Avatar ${designer.name}`">
                {{ initials }}
            </div>

            <div class="flex w-full flex-col gap-1.5">
                <h2 class="text-center font-['Crimson_Pro'] text-[28px] font-bold text-[#121214]">
                    {{ designer.name }}
                </h2>
                <p class="text-center font-['Geist'] text-[13px] leading-[19.5px] text-[#68686C]">
                    {{ designer.studio || 'Studio —' }}
                    <span v-if="designer.location"> · {{ designer.location }}</span>
                    <span v-else> · —</span>
                </p>
            </div>
        </div>

        <div class="h-px w-full bg-[#E2E2E4]"></div>

        <div class="grid grid-cols-3 gap-2">
            <div v-for="stat in statistics" :key="stat.label" class="flex min-w-0 flex-col gap-1">
                <span class="font-['Crimson_Pro'] text-2xl font-bold text-[#121214]">
                    {{ formatNumber(stat.value) }}
                </span>
                <span class="font-['Geist'] text-xs text-[#68686C]">{{ stat.label }}</span>
            </div>
        </div>

        <div class="h-px w-full bg-[#E2E2E4]"></div>

        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between gap-3">
                <span class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                    Font tercatat
                </span>
                <span class="font-mono text-[10px] text-[#68686C]">{{ designer.fontCount }}</span>
            </div>

            <div v-if="displayedFonts.length" class="flex flex-col gap-3">
                <DesignerFontCard v-for="font in displayedFonts" :key="font.id" :font="font" />
            </div>
            <p v-else class="rounded bg-[#F6F6F5] p-4 font-['Geist'] text-xs text-[#68686C]">
                Belum ada font yang tercatat untuk desainer ini.
            </p>
        </div>

    </article>
</template>

<script>
import DesignerFontCard from './DesignerFontCard.vue';

export default {
    name: 'DesignerCard',

    components: {
        DesignerFontCard,
    },

    props: {
        designer: {
            type: Object,
            required: true,
        },
    },

    computed: {
        initials() {
            return this.designer.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join('');
        },

        statistics() {
            return [
                { label: 'Font aktif', value: this.designer.activeFonts },
                { label: 'Unduhan', value: this.designer.downloads },
                { label: 'Apresiasi', value: this.designer.appreciation },
            ];
        },

        displayedFonts() {
            const fonts = this.designer.fonts || [];
            if (fonts.length <= 3) return fonts;

            const activeFonts = fonts.filter((font) =>
                font.isActive === true || font.active === true || font.status === 'active',
            );
            return (activeFonts.length ? activeFonts : fonts).slice(0, 3);
        },
    },

    methods: {
        openProfile(event) {
            if (event.target.closest('a, button')) return;
            this.$router.push({ name: 'designer-profile', params: { id: this.designer.id } });
        },

        formatNumber(value) {
            return typeof value === 'number' && Number.isFinite(value)
                ? new Intl.NumberFormat('id-ID').format(value)
                : '—';
        },
    },
};
</script>
