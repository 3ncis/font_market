import { defineStore } from 'pinia';
import fonts from '../data/fonts.json';

export const cartLicenseOptions = [
    'Desktop · 1 pengguna',
    'Desktop · 5 pengguna',
    'Web',
    'Aplikasi',
];

const defaultLicense = cartLicenseOptions[0];
const storageKey = 'aksaranusa-cart';
const fontsById = new Map(fonts.map((font) => [font.id, font]));

function loadCartItems() {
    try {
        const storedItems = window.localStorage.getItem(storageKey);
        if (!storedItems) return [];

        const parsedItems = JSON.parse(storedItems);
        if (!Array.isArray(parsedItems)) {
            console.error('Data keranjang tersimpan tidak valid.');
            return [];
        }

        const seenIds = new Set();

        return parsedItems.reduce((items, item) => {
            const id = typeof item?.id === 'string' ? item.id : '';
            const font = fontsById.get(id);

            const price = Number(font?.price);
            if (!font || !Number.isFinite(price) || price <= 0 || seenIds.has(id)) {
                return items;
            }

            seenIds.add(id);
            items.push({
                id,
                license: cartLicenseOptions.includes(item.license)
                    ? item.license
                    : defaultLicense,
            });
            return items;
        }, []);
    } catch (error) {
        console.error('Gagal memulihkan keranjang dari penyimpanan lokal:', error);
        return [];
    }
}

function persistCartItems(items) {
    try {
        window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
        console.error('Gagal menyimpan keranjang ke penyimpanan lokal:', error);
    }
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: loadCartItems(),
    }),

    getters: {
        itemCount: (state) => state.items.length,

        cartItems: (state) => state.items.flatMap(({ id, license }) => {
            const font = fontsById.get(id);
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

        freeFont: () => fonts.find((font) => Number(font.price) === 0) || null,
    },

    actions: {
        addFont(fontOrId) {
            const id = typeof fontOrId === 'string' ? fontOrId : fontOrId?.id;
            const font = typeof id === 'string' ? fontsById.get(id) : null;

            const price = Number(font?.price);
            if (!font || !Number.isFinite(price) || price <= 0) {
                return { added: false, reason: 'unavailable' };
            }

            if (this.items.some((item) => item.id === id)) {
                return { added: false, reason: 'duplicate' };
            }

            this.items.push({ id, license: defaultLicense });
            persistCartItems(this.items);
            return { added: true, reason: null };
        },

        removeFont(id) {
            const nextItems = this.items.filter((item) => item.id !== id);
            if (nextItems.length === this.items.length) return;

            this.items = nextItems;
            persistCartItems(this.items);
        },

        updateLicense(id, license) {
            if (!cartLicenseOptions.includes(license)) return;

            const item = this.items.find((entry) => entry.id === id);
            if (!item || item.license === license) return;

            item.license = license;
            persistCartItems(this.items);
        },
    },
});
