import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";

interface RegistrationPayload {
    token: string;
    store_name: string;
    website: string;
    instagram: string;
    bio: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

class CreatorRegistrationApi {
    async validateToken(token: string): Promise<boolean> {
        const response = await ApiServices.post(
            ApiEndpoints.validateCreatorRegistrationToken,
            { token },
        );
        const result = readSuccessResponse(response);

        if (!isRecord(result) || typeof result.valid !== "boolean") {
            throw new TypeError("Token validation API returned an invalid response.");
        }

        return result.valid;
    }

    async register(payload: RegistrationPayload): Promise<void> {
        const response = await ApiServices.post(
            ApiEndpoints.registerCreatorWithToken,
            payload,
        );
        readSuccessResponse(response);
    }
}

export default new CreatorRegistrationApi();
