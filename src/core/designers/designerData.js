import fonts from '@/core/utils/fonts.json';

function slugify(value) {
    const slug = value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, ' dan ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    return slug || 'designer';
}

function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
    }

    return Math.abs(hash).toString(36);
}

function getNumericValue(value) {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function getKnownActiveFontCount(designerFonts) {
    const statuses = designerFonts.map((font) => {
        if (typeof font.isActive === 'boolean') return font.isActive;
        if (typeof font.active === 'boolean') return font.active;
        if (typeof font.status === 'string') {
            if (font.status.toLowerCase() === 'active') return true;
            if (font.status.toLowerCase() === 'inactive') return false;
        }

        return null;
    });

    if (statuses.some((status) => status === null)) return null;
    return statuses.filter(Boolean).length;
}

function getMetadataValue(designerFonts, keys) {
    for (const font of designerFonts) {
        for (const key of keys) {
            const value = font[key];
            if (typeof value === 'string' && value.trim()) return value.trim();
        }
    }

    return null;
}

function getStatistic(designerFonts, keys) {
    for (const font of designerFonts) {
        for (const key of keys) {
            const value = getNumericValue(font[key]);
            if (value !== null) return value;
        }
    }

    return null;
}

export function getFontStyleCount(font) {
    const styles = font.styles;
    if (Array.isArray(styles)) return styles.length;

    for (const value of [styles, font.styleCount, font.stylesCount, font.weightCount]) {
        const count = getNumericValue(value);
        if (count !== null && count >= 0) return count;
    }

    return null;
}

export function getDesigners() {
    const fontsByDesigner = new Map();

    for (const font of fonts) {
        if (typeof font.designer !== 'string' || !font.designer.trim()) continue;
        const sourceName = font.designer.trim();
        const designerFonts = fontsByDesigner.get(sourceName) || [];
        designerFonts.push(font);
        fontsByDesigner.set(sourceName, designerFonts);
    }

    const baseSlugs = new Map();
    for (const sourceName of fontsByDesigner.keys()) {
        const baseSlug = slugify(sourceName);
        baseSlugs.set(baseSlug, (baseSlugs.get(baseSlug) || 0) + 1);
    }

    return [...fontsByDesigner.entries()]
        .map(([sourceName, designerFonts]) => {
            const locationMatch = sourceName.match(/\s*\(([^()]*)\)\s*$/);
            const baseSlug = slugify(sourceName);
            const source = designerFonts[0];
            const publishedFonts = [...designerFonts].sort((first, second) =>
                first.name.localeCompare(second.name),
            );

            return {
                id: baseSlugs.get(baseSlug) > 1
                    ? `${baseSlug}-${hashString(sourceName)}`
                    : baseSlug,
                sourceName,
                name: locationMatch
                    ? sourceName.slice(0, locationMatch.index).trim()
                    : sourceName,
                studio: getMetadataValue(designerFonts, ['designerStudio', 'studio']),
                location: getMetadataValue(designerFonts, ['designerLocation', 'location']) ||
                    locationMatch?.[1]?.trim() ||
                    null,
                avatar: getMetadataValue(designerFonts, ['designerAvatar', 'avatar']),
                biography: getMetadataValue(designerFonts, ['designerBiography', 'biography', 'bio']),
                activeFonts: getKnownActiveFontCount(designerFonts),
                downloads: getStatistic(designerFonts, ['designerDownloads']),
                appreciation: getStatistic(designerFonts, ['designerAppreciation']),
                fontCount: publishedFonts.length,
                fonts: publishedFonts,
                source,
            };
        })
        .sort((first, second) => first.name.localeCompare(second.name));
}

export function getDesignerById(id) {
    return getDesigners().find((designer) => designer.id === id) || null;
}
