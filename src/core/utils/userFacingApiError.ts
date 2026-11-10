function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function getApiErrorStatus(error: unknown): number | undefined {
    if (!isRecord(error) || !isRecord(error.response)) {
        return undefined;
    }

    return typeof error.response.status === "number"
        ? error.response.status
        : undefined;
}

export function getApiErrorCode(error: unknown): string | undefined {
    if (
        !isRecord(error) ||
        !isRecord(error.response) ||
        !isRecord(error.response.data)
    ) {
        return undefined;
    }

    return typeof error.response.data.code === "string"
        ? error.response.data.code
        : undefined;
}

export function getUserFacingApiError(
    error: unknown,
    fallback: string,
): string {
    switch (getApiErrorStatus(error)) {
        case 400:
            return "Data yang dikirim belum valid. Periksa kembali isian Anda.";
        case 404:
            return "Data atau layanan yang diminta tidak ditemukan.";
        case 409:
            return "Data sudah berubah atau tidak dapat diproses kembali.";
        case 500:
        case 502:
        case 503:
            return "Terjadi gangguan pada server. Silakan coba lagi.";
        default:
            return fallback;
    }
}
