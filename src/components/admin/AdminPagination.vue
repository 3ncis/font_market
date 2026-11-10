<script setup lang="ts">
defineProps<{
    page: number;
    totalPages: number;
    total: number;
}>();

const emit = defineEmits<{
    "update:page": [page: number];
}>();
</script>

<template>
    <nav
        v-if="totalPages > 0"
        class="flex flex-col gap-3 border-t border-[#E2E2E4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Pagination"
    >
        <p class="text-xs text-[#68686C]">
            {{ total }} data · Halaman {{ page }} dari {{ totalPages }}
        </p>
        <div class="flex gap-2">
            <button
                type="button"
                :disabled="page <= 1"
                class="rounded border border-[#E2E2E4] px-3 py-2 text-sm text-[#121214] hover:bg-[#F6F6F5] disabled:cursor-not-allowed disabled:opacity-50"
                @click="emit('update:page', page - 1)"
            >
                Sebelumnya
            </button>
            <button
                type="button"
                :disabled="page >= totalPages"
                class="rounded border border-[#E2E2E4] px-3 py-2 text-sm text-[#121214] hover:bg-[#F6F6F5] disabled:cursor-not-allowed disabled:opacity-50"
                @click="emit('update:page', page + 1)"
            >
                Berikutnya
            </button>
        </div>
    </nav>
</template>
