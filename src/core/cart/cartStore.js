import { defineStore } from 'pinia';
import ApiFont from '../api/font/font.api';

export const cartLicenseOptions = [
    'Desktop · 1 pengguna',
    'Desktop · 5 pengguna',
    'Web',
    'Aplikasi',
];

const defaultLicense = cartLicenseOptions[0];

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        fonts: [],
        fontsLoaded: false,
    }),

    getters: {
        itemCount: (state) => state.items.length,

        cartItems: (state) => state.items.flatMap(({ id, license }) => {
            const font = state.fonts.find((entry) => entry.id === id);
            if (!font || Number(font.price) <= 0) return [];

            return [{
                ...font,
                preview: font.previewText || font.name,
                styles: font.styles || 1,
                formats: font.formats || 'Format belum tersedia',
                license,
                licenseDescription:
                    font.licenseDescription || 'Lisensi mengikuti ketentuan font.',
            }];
        }),

        freeFont: (state) =>
            state.fonts.find((font) => Number(font.price) === 0) || null,
    },

    actions: {
        setFonts(fonts) {
            this.fonts = fonts;
            this.fontsLoaded = true;
        },

        async loadFonts() {
            if (this.fontsLoaded) return this.fonts;

            const fonts = await ApiFont.getAll();
            this.setFonts(fonts);
            return fonts;
        },

        async addFont(fontOrId) {
            await this.loadFonts();
            const id = typeof fontOrId === 'string' ? fontOrId : fontOrId?.id;
            const font = typeof id === 'string'
                ? this.fonts.find((entry) => entry.id === id)
                : null;

            const price = Number(font?.price);
            if (!font || !Number.isFinite(price) || price <= 0) {
                return { added: false, reason: 'unavailable' };
            }

            if (this.items.some((item) => item.id === id)) {
                return { added: false, reason: 'duplicate' };
            }

            this.items.push({ id, license: defaultLicense });
            return { added: true, reason: null };
        },

        removeFont(id) {
            this.items = this.items.filter((item) => item.id !== id);
        },

        updateLicense(id, license) {
            if (!cartLicenseOptions.includes(license)) return;

            const item = this.items.find((entry) => entry.id === id);
            if (item) item.license = license;
        },
    },
});
