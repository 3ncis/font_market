import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";

export type DesignerRequestStatus = "pending" | "approved" | "rejected" | "expired";

export interface DesignerRequest {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone: string;
    status: DesignerRequestStatus;
    review_note: string | null;
    created_at: string;
    updated_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRequest(value: unknown): DesignerRequest {
    if (
        !isRecord(value) ||
        typeof value.id !== "string" ||
        typeof value.user_id !== "string" ||
        typeof value.name !== "string" ||
        typeof value.email !== "string" ||
        typeof value.phone !== "string" ||
        (value.status !== "pending" &&
            value.status !== "approved" &&
        value.status !== "rejected" &&
        value.status !== "expired") ||
        typeof value.created_at !== "string" ||
        typeof value.updated_at !== "string" ||
        (value.review_note !== null && typeof value.review_note !== "string")
    ) {
        throw new TypeError("The designer request API returned an invalid request.");
    }

    return {
        id: value.id,
        user_id: value.user_id,
        name: value.name,
        email: value.email,
        phone: value.phone,
        status: value.status,
        review_note: value.review_note,
        created_at: value.created_at,
        updated_at: value.updated_at,
    };
}

class DesignerRequestApi {
    async getMine(): Promise<DesignerRequest | null> {
        const response = await ApiServices.get(ApiEndpoints.myDesignerRequest);
        const result = readSuccessResponse(response);
        if (result === null) return null;
        if (isRecord(result) && result.has_store_profile === true) {
            return null;
        }
        return parseRequest(result);
    }

    async submit(phone: string): Promise<DesignerRequest> {
        const response = await ApiServices.post(ApiEndpoints.designerRequests, { phone });
        return parseRequest(readSuccessResponse(response));
    }
}

export default new DesignerRequestApi();
