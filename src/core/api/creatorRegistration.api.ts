import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";

interface RegistrationPayload {
    token: string;
    name: string;
    email: string;
    password: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

class CreatorRegistrationApi {
    async validateToken(token: string): Promise<boolean> {
        // TODO: sambungkan ke endpoint backend
        const response = await ApiServices.get(
            ApiEndpoints.validateCreatorRegistrationToken,
            { params: { token } },
        );
        const result = readSuccessResponse(response);

        if (!isRecord(result) || typeof result.valid !== "boolean") {
            throw new TypeError("Token validation API returned an invalid response.");
        }

        return result.valid;
    }

    async register(payload: RegistrationPayload): Promise<void> {
        // TODO: sambungkan ke endpoint backend
        const response = await ApiServices.post(
            ApiEndpoints.registerCreatorWithToken,
            payload,
        );
        readSuccessResponse(response);
    }
}

export default new CreatorRegistrationApi();
