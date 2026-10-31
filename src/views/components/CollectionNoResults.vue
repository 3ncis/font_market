<script>
export default {
    name: 'CollectionNoResults',

    props: {
        searchQuery: {
            type: String,
            default: '',
        },
    },

    emits: ['reset'],

    computed: {
        hasSearchQuery() {
            return this.searchQuery.trim().length > 0;
        },
    },
};
</script>

<template>
    <div
        class="flex min-h-[440px] flex-col items-center justify-center gap-5 overflow-hidden rounded-lg border border-[#E2E2E4] px-6 py-8 sm:px-8">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6F6F5]">
            <svg class="h-7 w-7 text-[#121214]" viewBox="0 0 28 28" fill="none" stroke="currentColor"
                stroke-width="1.5" aria-hidden="true">
                <circle cx="12.25" cy="12.25" r="8.75" />
                <path d="m18.5 18.5 5 5" />
            </svg>
        </div>

        <div class="flex w-full flex-col gap-3 text-center">
            <h2 class="font-['Crimson_Pro'] text-3xl font-semibold leading-tight text-[#121214] sm:text-[32px]">
                Tidak ada font yang cocok.
            </h2>
            <p class="mx-auto w-full max-w-[480px] font-['Geist'] text-sm leading-[22.4px] text-[#68686C]">
                Tidak ada hasil
                <template v-if="hasSearchQuery">
                    untuk “{{ searchQuery }}”
                </template>
                dengan filter saat ini. Coba kata kunci lain atau reset filter.
            </p>
        </div>

        <button type="button"
            class="inline-flex h-12 items-center justify-center rounded bg-[#121214] px-5 font-['Geist'] text-sm font-semibold text-white transition hover:bg-[#343438]"
            @click="$emit('reset')">
            Reset filter
        </button>
    </div>
</template>
