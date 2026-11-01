<template>
    <section class="flex w-full flex-col gap-7 rounded-xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
        <div class="flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-[#F6F6F5] font-['Crimson_Pro'] text-4xl font-semibold text-[#121214]"
            role="img" :aria-label="`Foto profil ${designer.name}`">
            <img v-if="designer.avatar" :src="designer.avatar" :alt="designer.name"
                class="h-full w-full object-cover" />
            <span v-else>{{ initials }}</span>
        </div>

        <div class="flex flex-col gap-2">
            <h1 class="break-words font-['Crimson_Pro'] text-[28px] font-bold text-[#121214]">
                {{ designer.name }}
            </h1>
            <p class="font-['Geist'] text-sm font-semibold text-[#121214]">
                {{ designer.studio || '—' }}
            </p>
            <p class="font-['Geist'] text-sm text-[#6B7280]">
                {{ designer.location || '—' }}
            </p>
        </div>

        <div v-if="designer.biography" class="h-px bg-[#E5E7EB]"></div>
        <p v-if="designer.biography"
            class="whitespace-pre-line font-['Geist'] text-sm leading-[22.4px] text-[#374151]">
            {{ designer.biography }}
        </p>

        <div class="h-px bg-[#E5E7EB]"></div>

        <DesignerProfileStats :stats="stats" />

        <div v-if="hasContacts" class="h-px bg-[#E5E7EB]"></div>
        <DesignerProfileContacts v-if="hasContacts" :contacts="designer.contacts" />
    </section>
</template>

<script>
import DesignerProfileContacts from './DesignerProfileContacts.vue';
import DesignerProfileStats from './DesignerProfileStats.vue';

export default {
    name: 'DesignerProfileCard',

    components: {
        DesignerProfileContacts,
        DesignerProfileStats,
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

        stats() {
            return [
                { label: 'Font Aktif', value: this.designer.activeFonts },
                { label: 'Unduhan', value: this.designer.downloads },
                { label: 'Apresiasi', value: this.designer.appreciation },
            ];
        },

        hasContacts() {
            return Object.values(this.designer.contacts || {}).some(
                (value) => typeof value === 'string' && value.trim(),
            );
        },
    },
};
</script>
