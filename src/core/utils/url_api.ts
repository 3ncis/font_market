const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiBaseUrl) {
    throw new Error("VITE_API_BASE_URL must be configured before using the API.");
}

let parsedApiBaseUrl: URL;

try {
    parsedApiBaseUrl = new URL(configuredApiBaseUrl);
} catch {
    throw new Error("VITE_API_BASE_URL must be a valid absolute URL.");
}

if (parsedApiBaseUrl.protocol !== "http:" && parsedApiBaseUrl.protocol !== "https:") {
    throw new Error("VITE_API_BASE_URL must use HTTP or HTTPS.");
}

if (parsedApiBaseUrl.search || parsedApiBaseUrl.hash) {
    throw new Error("VITE_API_BASE_URL cannot contain a query string or fragment.");
}

if (
    import.meta.env.PROD &&
    parsedApiBaseUrl.protocol !== "https:" &&
    !["localhost", "127.0.0.1", "[::1]"].includes(parsedApiBaseUrl.hostname)
) {
    throw new Error("VITE_API_BASE_URL must use HTTPS in production.");
}

export const ApiBaseUrl = configuredApiBaseUrl.replace(/\/+$/, "");

export const ApiEndpoints = {
    register: "/auth/register",
    registerCreator: "/auth/register-developer",
    login: "/auth/login",
    currentUser: "/auth/me",
    adminUsers: "/admin/users",
    adminUserStatus: (userId: string) =>
        `/admin/users/${encodeURIComponent(userId)}/status`,
    adminCreatorRequests: "/admin/designer-requests",
    approveCreatorRequest: (requestId: string) =>
        `/admin/designer-requests/${encodeURIComponent(requestId)}/approve`,
    rejectCreatorRequest: (requestId: string) =>
        `/admin/designer-requests/${encodeURIComponent(requestId)}/reject`,
    validateCreatorRegistrationToken: "/auth/register-designer/validate",
    registerCreatorWithToken: "/auth/register-designer",
    adminPayments: "/admin/payments",
    approvePaymentForTesting: (paymentId: string) =>
        `/admin/payments/${encodeURIComponent(paymentId)}/approve-testing`,
    fonts: "/fonts",
    fontBySlug: (slug: string) => `/fonts/${encodeURIComponent(slug)}`,
    orders: "/orders",
    designers: "/designer",
    collection: "/collections",
    collectionFontById: (fontId: string) =>
        `/collections/${encodeURIComponent(fontId)}`,
    orderById: (id: string) => `/orders/${encodeURIComponent(id)}`,
    checkout: "/payments/checkout",
} as const;

export const Asset = `${ApiBaseUrl}${ApiEndpoints.fonts}`;
