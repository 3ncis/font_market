interface ApiResponseLike {
    data?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readSuccessResponse(response: ApiResponseLike): unknown {
    const body = response.data;

    if (isRecord(body) && body.success === false) {
        const message =
            typeof body.message === "string" && body.message.trim()
                ? body.message
                : "The API request was not successful.";
        throw new Error(message);
    }

    return isRecord(body) && Object.hasOwn(body, "data") ? body.data : body;
}

export function readErrorResponse(error: unknown, fallback: string): string {
    if (!isRecord(error)) {
        return fallback;
    }

    const response = isRecord(error.response) ? error.response : null;
    const body = response && isRecord(response.data) ? response.data : null;
    if (body && typeof body.message === "string" && body.message.trim()) {
        return body.message;
    }

    return typeof error.message === "string" && error.message.trim()
        ? error.message
        : fallback;
}
