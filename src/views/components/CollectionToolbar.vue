<template>
    <div class="flex flex-col gap-4 border-b border-[#E2E2E4] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <label class="flex min-w-0 flex-1 flex-col gap-2 font-['Geist'] text-xs text-[#68686C]">
            <span>Pratinjau langsung</span>
            <input :value="previewText" type="text" maxlength="80"
                class="h-10 w-full rounded border border-[#E2E2E4] px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                placeholder="Ketik teks pratinjau"
                @input="$emit('update:previewText', $event.target.value)" />
        </label>

        <label class="flex w-full flex-col gap-2 font-['Geist'] text-xs text-[#68686C] sm:w-40">
            <span>Ukuran: {{ previewSize }} px</span>
            <input :value="previewSize" type="range" min="20" max="72" step="1"
                class="w-full accent-[#121214]"
                @input="$emit('update:previewSize', Number($event.target.value))" />
        </label>

        <label class="flex flex-col gap-2 font-['Geist'] text-xs text-[#68686C] sm:w-44">
            <span>Urutkan</span>
            <select :value="sortBy"
                class="h-10 rounded border border-[#E2E2E4] bg-white px-3 text-sm text-[#121214] outline-none focus:border-[#121214]"
                @change="$emit('update:sortBy', $event.target.value)">
                <option value="latest">Terbaru</option>
                <option value="name-asc">Nama A–Z</option>
                <option value="name-desc">Nama Z–A</option>
            </select>
        </label>
    </div>
</template>

<script>
export default {
    name: 'CollectionToolbar',

    props: {
        previewText: { type: String, required: true },
        previewSize: { type: Number, required: true },
        sortBy: { type: String, required: true },
    },

    emits: ['update:previewText', 'update:previewSize', 'update:sortBy'],
};
</script>
