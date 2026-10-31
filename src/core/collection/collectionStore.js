import { defineStore } from 'pinia';
import fonts from '../utils/fonts.json';

const fontsById = new Map(fonts.map((font) => [font.id, font]));

function getStorageKey(accountId) {
    return `aksaranusa-collection:${encodeURIComponent(accountId)}`;
}

function readItems(accountId) {
    const storedItems = window.localStorage.getItem(getStorageKey(accountId));
    if (!storedItems) return [];

    const parsedItems = JSON.parse(storedItems);
    if (!Array.isArray(parsedItems)) {
        throw new Error('Data koleksi tersimpan tidak valid.');
    }

    const seenIds = new Set();
    return parsedItems.reduce((items, item) => {
        const id = typeof item?.id === 'string' ? item.id : '';
        const font = fontsById.get(id);
        const acquiredAt = typeof item?.acquiredAt === 'string' ? item.acquiredAt : '';

        if (
            !font ||
            Number(font.price) !== 0 ||
            !Number.isFinite(Date.parse(acquiredAt)) ||
            seenIds.has(id)
        ) {
            return items;
        }

        seenIds.add(id);
        items.push({ id, acquiredAt });
        return items;
    }, []);
}

function persistItems(accountId, items) {
    window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(items));
}

export const useCollectionStore = defineStore('collection', {
    state: () => ({
        accountId: 'guest',
        items: [],
    }),

    getters: {
        storageKey: (state) => getStorageKey(state.accountId),

        collectionFonts: (state) => state.items.flatMap((item) => {
            const font = fontsById.get(item.id);
            return font ? [{ ...font, acquiredAt: item.acquiredAt }] : [];
        }),
    },

    actions: {
        loadForAccount(accountId) {
            const nextAccountId = String(accountId || 'guest');
            const items = readItems(nextAccountId);
            this.accountId = nextAccountId;
            this.items = items;
        },

        reload() {
            this.items = readItems(this.accountId);
        },

        addFreeFont(id) {
            const font = fontsById.get(id);
            if (!font || Number(font.price) !== 0) {
                return { added: false, reason: 'unavailable' };
            }

            if (this.items.some((item) => item.id === id)) {
                return { added: false, reason: 'duplicate' };
            }

            const nextItems = [
                ...this.items,
                { id, acquiredAt: new Date().toISOString() },
            ];
            persistItems(this.accountId, nextItems);
            this.items = nextItems;
            return { added: true, reason: null };
        },

        removeFreeFont(id) {
            const font = fontsById.get(id);
            if (!font || Number(font.price) !== 0) {
                return { removed: false, reason: 'unavailable' };
            }

            const nextItems = this.items.filter((item) => item.id !== id);
            if (nextItems.length === this.items.length) {
                return { removed: false, reason: 'not-found' };
            }

            persistItems(this.accountId, nextItems);
            this.items = nextItems;
            return { removed: true, reason: null };
        },
    },
});
