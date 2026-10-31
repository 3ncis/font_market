import awanikaUrl from '@/assets/fonts/Awanika.ttf';
import kerisdipaUrl from '@/assets/fonts/kerisdipa_Demo.ttf';

const fontAssets = {
    awanika: {
        url: awanikaUrl,
        filename: 'Awanika.ttf',
    },
    kerisdipa: {
        url: kerisdipaUrl,
        filename: 'Kerisdipa.ttf',
    },
};

export function getFontAsset(fontId) {
    return fontAssets[fontId] || null;
}
