import { defineStore } from 'pinia';
import ApiFont from '../api/font/font.api';

export const cartLicenseOptions = [
    'Desktop · 1 pengguna',
    'Desktop · 5 pengguna',
    'Web',
    'Aplikasi',
];

const defaultLicense = cartLicenseOptions[0];
const CATALOG_STORAGE_KEY = 'fontstore.catalog';

function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readCatalog() {
    if (typeof window === 'undefined') return [];

    try {
        const rawCatalog = window.localStorage.getItem(CATALOG_STORAGE_KEY);
        if (rawCatalog === null) return [];

        const catalog = JSON.parse(rawCatalog);
        if (
            !Array.isArray(catalog) ||
            catalog.some((item) =>
                !isRecord(item) ||
                typeof item.id !== 'string' ||
                !item.id.trim() ||
                !cartLicenseOptions.includes(item.license)
            )
        ) {
            console.error('Data catalog lokal memiliki struktur yang tidak valid.');
            return [];
        }

        return [
            ...new Map(catalog.map((item) => [item.id, item])).values(),
        ];
    } catch (error) {
        console.error('Data catalog lokal tidak dapat dibaca:', error);
        return [];
    }
}

function persistCatalog(items) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(items));
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: readCatalog(),
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

            const items = [...this.items, { id, license: defaultLicense }];
            persistCatalog(items);
            this.items = items;
            return { added: true, reason: null };
        },

        removeFont(id) {
            const items = this.items.filter((item) => item.id !== id);
            persistCatalog(items);
            this.items = items;
        },

        updateLicense(id, license) {
            if (!cartLicenseOptions.includes(license)) return;

            const items = this.items.map((item) =>
                item.id === id ? { ...item, license } : item,
            );
            if (items.some((item, index) => item !== this.items[index])) {
                persistCatalog(items);
                this.items = items;
            }
        },

        clearCatalogAfterPayment() {
            this.items = [];
            if (typeof window === 'undefined') return;

            try {
                window.localStorage.removeItem(CATALOG_STORAGE_KEY);
            } catch (error) {
                console.error('Catalog lokal tidak dapat dihapus:', error);
                throw error;
            }
        },
    },
});
