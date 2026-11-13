import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";
import type { AdminListMeta } from "@/core/api/admin.api";
import {
    parseFontRecord,
    type CreatorFont,
} from "@/core/api/fontSubmission.api";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMeta(value: unknown): AdminListMeta {
    if (
        !isRecord(value) ||
        typeof value.page !== "number" ||
        typeof value.limit !== "number" ||
        typeof value.total !== "number" ||
        typeof value.total_pages !== "number"
    ) {
        throw new TypeError("The font review API returned invalid pagination metadata.");
    }
    return {
        page: value.page,
        limit: value.limit,
        total: value.total,
        total_pages: value.total_pages,
    };
}

class AdminFontApi {
    async list(page: number, limit: number): Promise<{ items: CreatorFont[]; meta: AdminListMeta }> {
        const response = await ApiServices.get(ApiEndpoints.fontReviewQueue, {
            params: { page, limit },
        });
        const envelope: unknown = response.data;
        if (
            !isRecord(envelope) ||
            envelope.success !== true ||
            !Array.isArray(envelope.data)
        ) {
            throw new TypeError("The font review API returned an invalid list response.");
        }

        const items = readSuccessResponse(response);
        if (!Array.isArray(items)) {
            throw new TypeError("The font review API did not return a font array.");
        }
        return {
            items: items.map(parseFontRecord),
            meta: parseMeta(envelope.meta),
        };
    }

    async getDetail(fontId: string): Promise<CreatorFont> {
        const response = await ApiServices.get(ApiEndpoints.fontReviewDetail(fontId));
        return parseFontRecord(readSuccessResponse(response));
    }

    async review(
        fontId: string,
        decision: "approved" | "changes_requested" | "rejected",
        note: string,
    ): Promise<void> {
        const response = await ApiServices.patch(ApiEndpoints.reviewFont(fontId), {
            decision,
            note,
        });
        readSuccessResponse(response);
    }

    async downloadFamily(fontId: string, index: number, filename: string): Promise<void> {
        const response = await ApiServices.get(ApiEndpoints.fontFamilyFile(fontId, index), {
            responseType: "blob",
        });
        const url = URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}

export default new AdminFontApi();
