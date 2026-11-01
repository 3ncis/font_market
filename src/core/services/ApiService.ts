import axios from "axios";
import JwtService from "./jwtService";
import { ApiBaseUrl, ApiEndpoints } from "../utils/url_api";

const apiKey = import.meta.env.VITE_API_KEY?.trim();

if (!apiKey) {
    throw new Error("VITE_API_KEY must be configured before using the API.");
}

const ApiService = axios.create({
    baseURL: ApiBaseUrl,
    timeout: 10_000,
    headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
    },
});

ApiService.interceptors.request.use((config) => {
    const requestPath = config.url?.split("?")[0];
    const requiresAuthentication =
        requestPath === ApiEndpoints.currentUser ||
        requestPath === ApiEndpoints.orders ||
        requestPath?.startsWith(`${ApiEndpoints.orders}/`) ||
        requestPath === ApiEndpoints.collection ||
        requestPath?.startsWith(`${ApiEndpoints.collection}/`) ||
        requestPath === ApiEndpoints.checkout;
    const token = JwtService.getToken();

    if (requiresAuthentication && token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
});

export default ApiService;