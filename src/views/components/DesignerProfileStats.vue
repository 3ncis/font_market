<template>
    <div class="flex items-start justify-between gap-3">
        <div v-for="stat in stats" :key="stat.label" class="flex min-w-0 flex-col gap-1">
            <span class="font-['Crimson_Pro'] text-2xl font-bold text-[#121214]">
                {{ formatNumber(stat.value) }}
            </span>
            <span class="font-['Geist'] text-xs text-[#6B7280]">{{ stat.label }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DesignerProfileStats',

    props: {
        stats: {
            type: Array,
            required: true,
        },
    },

    methods: {
        formatNumber(value) {
            return typeof value === 'number' && Number.isFinite(value)
                ? new Intl.NumberFormat('id-ID').format(value)
                : '—';
        },
    },
};
</script>
