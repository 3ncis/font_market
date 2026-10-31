<template>
    <div class="flex flex-col gap-7">
        <section class="flex flex-col gap-3">
            <h2 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                Harga
            </h2>
            <label v-for="option in priceOptions" :key="option.value"
                class="flex cursor-pointer items-center gap-2.5 font-['Geist'] text-sm text-[#343438]">
                <input type="radio" name="collection-price" :value="option.value" :checked="price === option.value"
                    class="accent-[#121214]" @change="$emit('update:price', option.value)" />
                {{ option.label }}
            </label>
        </section>

        <section class="flex flex-col gap-3">
            <h2 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                Klasifikasi
            </h2>
            <label v-for="category in categoryOptions" :key="category"
                class="flex cursor-pointer items-start gap-2.5 font-['Geist'] text-sm text-[#343438]">
                <input type="checkbox" :value="category" :checked="categories.includes(category)"
                    class="mt-0.5 accent-[#121214]" @change="toggleCategory(category)" />
                <span>{{ category }}</span>
            </label>
        </section>

        <section class="flex flex-col gap-3">
            <h2 class="font-mono text-[11px] font-semibold uppercase tracking-wide text-[#68686C]">
                Lisensi
            </h2>
            <label v-for="license in licenseOptions" :key="license"
                class="flex cursor-pointer items-start gap-2.5 font-['Geist'] text-sm text-[#343438]">
                <input type="checkbox" :value="license" :checked="licenses.includes(license)"
                    class="mt-0.5 accent-[#121214]" @change="toggleLicense(license)" />
                <span>{{ license }}</span>
            </label>
            <p class="font-['Geist'] text-xs leading-relaxed text-[#8F897F]">
                Hasil lisensi ditampilkan jika ketentuannya tercantum pada data font.
            </p>
        </section>

        <button type="button"
            class="w-fit font-mono text-[10px] font-semibold uppercase tracking-wider text-[#68686C] transition hover:text-[#121214]"
            @click="$emit('reset')">
            Reset
        </button>
    </div>
</template>

<script>
export default {
    name: 'CollectionSidebar',

    props: {
        price: { type: String, required: true },
        categories: { type: Array, required: true },
        licenses: { type: Array, required: true },
    },

    emits: ['update:price', 'update:categories', 'update:licenses', 'reset'],

    data() {
        return {
            priceOptions: [
                { label: 'Semua', value: 'all' },
                { label: 'Gratis', value: 'free' },
                { label: 'Berbayar', value: 'paid' },
            ],
            categoryOptions: [
                'Serif tradisional',
                'Sans modern',
                'Display ekspresif',
                'Aksara daerah',
                'Kaligrafi & coretan',
            ],
            licenseOptions: [
                'Komersial gratis',
                'Personal/nonkomersial',
                'Desktop berbayar',
                'Web berbayar',
                'Aplikasi berbayar',
            ],
        };
    },

    methods: {
        toggleCategory(category) {
            const nextCategories = this.categories.includes(category)
                ? this.categories.filter((item) => item !== category)
                : [...this.categories, category];
            this.$emit('update:categories', nextCategories);
        },

        toggleLicense(license) {
            const nextLicenses = this.licenses.includes(license)
                ? this.licenses.filter((item) => item !== license)
                : [...this.licenses, license];
            this.$emit('update:licenses', nextLicenses);
        },
    },
};
</script>
