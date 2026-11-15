import axios from "axios";
import JwtService from "./jwtService";
import { ApiBaseUrl, ApiEndpoints } from "../utils/url_api";

const apiKey = import.meta.env.VITE_API_KEY?.trim();

const ApiService = axios.create({
    baseURL: ApiBaseUrl,
    timeout: 10_000,
    headers: {
        Accept: "application/json",
        ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
});

ApiService.interceptors.request.use((config) => {
    const requestPath = config.url?.split("?")[0];
    const requiresAuthentication =
        requestPath === ApiEndpoints.currentUser ||
        requestPath === ApiEndpoints.designerRequests ||
        requestPath === ApiEndpoints.myDesignerRequest ||
        requestPath === ApiEndpoints.fonts && config.method?.toLowerCase() === "post" ||
        requestPath?.startsWith(`${ApiEndpoints.fonts}/mine`) ||
        requestPath?.startsWith(`${ApiEndpoints.fontReviewQueue}`) ||
        requestPath?.startsWith("/fonts/") &&
            (config.method?.toLowerCase() === "patch" ||
                requestPath.endsWith("/submit") ||
                requestPath.endsWith("/review") ||
                requestPath.endsWith("/file")) ||
        requestPath === ApiEndpoints.orders ||
        requestPath?.startsWith(`${ApiEndpoints.orders}/`) ||
        requestPath === ApiEndpoints.collection ||
        requestPath?.startsWith(`${ApiEndpoints.collection}/`) ||
        requestPath === ApiEndpoints.checkout ||
        requestPath?.startsWith("/admin/");
    const token = JwtService.getToken();

    if (requiresAuthentication && token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
});

export default ApiService;