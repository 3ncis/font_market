import { defineStore } from 'pinia';
import ApiCollection from '../api/collection/collection.api';
import ApiFont from '../api/font/font.api';

function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeFont(font) {
    if (!isRecord(font)) {
        throw new TypeError('The collection API returned an invalid font.');
    }

    const rawId = font.id ?? font._id;
    if (
        (typeof rawId !== 'string' && typeof rawId !== 'number') ||
        !String(rawId).trim()
    ) {
        throw new TypeError('The collection API returned a font without an ID.');
    }

    return {
        ...font,
        id: String(rawId),
        name: typeof font.name === 'string' ? font.name : '',
        designer:
            typeof font.designer === 'string'
                ? font.designer
                : font.store_id?.name ?? '',
        category:
            typeof font.category === 'string'
                ? font.category
                : font.category_id?.name ?? '',
        fontFamily: font.fontFamily ?? font.name ?? '',
    };
}

async function getCollectionFont(item) {
    const referencedFont = isRecord(item.font)
        ? item.font
        : isRecord(item.font_id)
            ? item.font_id
            : typeof item.name === 'string' && item.price !== undefined
                ? item
                : null;
    if (referencedFont) {
        return normalizeFont(referencedFont);
    }

    const rawId = item.font_id ?? item.fontId;
    if (typeof rawId !== 'string' && typeof rawId !== 'number') {
        throw new TypeError('The collection API returned an item without a font.');
    }

    return normalizeFont(await ApiFont.getById(String(rawId)));
}

async function normalizeCollectionItems(collection) {
    const normalizedItems = await Promise.all(collection.map(async (entry) => {
        if (!isRecord(entry)) {
            throw new TypeError('The collection API returned an invalid item.');
        }

        const font = await getCollectionFont(entry);
        const timestamp =
            entry.acquiredAt ??
            entry.created_at ??
            entry.createdAt ??
            entry.updated_at ??
            entry.updatedAt;
        const acquiredAt =
            typeof timestamp === 'string' && Number.isFinite(Date.parse(timestamp))
                ? timestamp
                : new Date().toISOString();

        return { id: font.id, acquiredAt, font };
    }));

    return [...new Map(normalizedItems.map((item) => [item.id, item])).values()];
}

export const useCollectionStore = defineStore('collection', {
    state: () => ({
        accountId: 'guest',
        items: [],
    }),

    getters: {
        collectionFonts: (state) =>
            state.items.map((item) => ({ ...item.font, acquiredAt: item.acquiredAt })),
    },

    actions: {
        async loadForAccount(accountId) {
            const nextAccountId = String(accountId || 'guest');
            if (nextAccountId !== this.accountId) {
                this.items = [];
            }
            this.accountId = nextAccountId;

            const items = await normalizeCollectionItems(await ApiCollection.getMine());
            if (this.accountId === nextAccountId) {
                this.items = items;
            }
        },

        async reload() {
            const accountId = this.accountId;
            const items = await normalizeCollectionItems(await ApiCollection.getMine());
            if (this.accountId === accountId) {
                this.items = items;
            }
        },

        async addFreeFont(font) {
            if (!isRecord(font) || Number(font.price) !== 0) {
                return { added: false, reason: 'unavailable' };
            }

            const normalizedFont = normalizeFont(font);
            if (this.items.some((item) => item.id === normalizedFont.id)) {
                return { added: false, reason: 'duplicate' };
            }

            await ApiCollection.addFreeFont(normalizedFont.id);
            this.items = [
                ...this.items,
                {
                    id: normalizedFont.id,
                    acquiredAt: new Date().toISOString(),
                    font: normalizedFont,
                },
            ];
            return { added: true, reason: null };
        },

        async removeFreeFont(id) {
            const existingItem = this.items.find((item) => item.id === String(id));
            if (!existingItem || Number(existingItem.font.price) !== 0) {
                return { removed: false, reason: 'unavailable' };
            }

            await ApiCollection.removeFreeFont(id);
            this.items = this.items.filter((item) => item.id !== String(id));
            return { removed: true, reason: null };
        },
    },
});
