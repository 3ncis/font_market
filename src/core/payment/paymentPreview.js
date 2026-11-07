import { defineStore } from 'pinia';

export const usePaymentPreviewStore = defineStore('paymentPreview', {
    state: () => ({
        preview: null,
    }),

    actions: {
        setPreview(preview) {
            this.preview = preview;
        },
    },
});

export function createDemoQrSvg() {
    const modules = [
        '1110010110101',
        '1011011001101',
        '1110010111101',
        '0001010100010',
        '1101011010111',
        '0110100111001',
        '1011011001010',
        '1000110110101',
        '0111010011010',
        '1010101100111',
        '1110010110101',
        '0011101001100',
        '1101010111011',
    ];
    const squares = modules.flatMap((row, rowIndex) =>
        [...row].flatMap((module, columnIndex) =>
            module === '1'
                ? [`<rect x="${16 + columnIndex * 12}" y="${16 + rowIndex * 12}" width="10" height="10" fill="#121214"/>`]
                : [],
        ),
    ).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="420" viewBox="0 0 360 420">
<rect width="360" height="420" rx="16" fill="#fff"/>
<rect x="10" y="10" width="340" height="340" rx="8" fill="#f6f6f5"/>
${squares}
<rect x="34" y="156" width="292" height="54" rx="8" fill="#fff" stroke="#9a3d32" stroke-width="2"/>
<text x="180" y="179" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="700" fill="#9a3d32">DEMO - BUKAN QR PEMBAYARAN</text>
<text x="180" y="198" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#9a3d32">Gambar ini tidak dapat dipindai untuk membayar</text>
<text x="180" y="390" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#121214">PREVIEW SAJA · TIDAK VALID</text>
</svg>`;
}
