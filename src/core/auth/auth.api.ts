import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../utils/url_api";

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

interface ApiResponse<T> {
    data?: T;
}

class ApiAuth {
    async register({ name, email, password }: RegisterPayload): Promise<unknown> {
        const response = await ApiServices.post<ApiResponse<unknown>>(
            ApiEndpoints.register,
            { name, email, password },
        );
        return response.data?.data;
    }

    async registerDeveloper({ name, email, password }: RegisterPayload): Promise<unknown> {
        const response = await ApiServices.post<ApiResponse<unknown>>(
            ApiEndpoints.registerDeveloper,
            { name, email, password },
        );
        return response.data?.data;
    }

    async login(email: string, password: string): Promise<unknown> {
        const response = await ApiServices.post<ApiResponse<unknown>>(
            ApiEndpoints.login,
            { email, password },
        );
        return response.data?.data;
    }

    async getCurrentUser(): Promise<unknown> {
        const response = await ApiServices.get<ApiResponse<unknown>>(
            ApiEndpoints.currentUser,
        );
        return response.data?.data;
    }
}

export default new ApiAuth();
