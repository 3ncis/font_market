import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../utils/url_api";
import { readSuccessResponse } from "../utils/apiResponse";

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

class ApiAuth {
    async register({ name, email, password }: RegisterPayload): Promise<unknown> {
        const response = await ApiServices.post(
            ApiEndpoints.register,
            { name, email, password },
        );
        return readSuccessResponse(response);
    }

    async registerDeveloper({ name, email, password }: RegisterPayload): Promise<unknown> {
        const response = await ApiServices.post(
            ApiEndpoints.registerDeveloper,
            { name, email, password },
        );
        return readSuccessResponse(response);
    }

    async login(email: string, password: string): Promise<unknown> {
        const response = await ApiServices.post(
            ApiEndpoints.login,
            { email, password },
        );
        return readSuccessResponse(response);
    }

    async getCurrentUser(): Promise<unknown> {
        const response = await ApiServices.get(ApiEndpoints.currentUser);
        return readSuccessResponse(response);
    }
}

export default new ApiAuth();
