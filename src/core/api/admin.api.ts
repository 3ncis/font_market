import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";

export type AdminUserRole = "creator" | "customer" | "admin";
export type AccountStatusFilter = "all" | "active" | "inactive";
export type CreatorRequestStatus = "pending" | "approved" | "rejected";

export interface AdminUser {
    user_id: string;
    name: string;
    email: string;
    role: AdminUserRole | string;
    roles?: string[];
    is_active: boolean;
    created_at: string;
}

export interface CreatorRequest {
    request_id: string;
    name: string;
    email: string;
    created_at: string;
    status: CreatorRequestStatus;
}

export interface AdminListMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface AdminListResult<T> {
    items: T[];
    meta: AdminListMeta;
}

interface ListEnvelope<T> {
    success?: unknown;
    data?: unknown;
    meta?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeRole(role: string): string {
    return ["developer", "designer", "seller"].includes(role.toLowerCase())
        ? "creator"
        : role;
}

function parseMeta(value: unknown): AdminListMeta {
    if (
        !isRecord(value) ||
        typeof value.page !== "number" ||
        typeof value.limit !== "number" ||
        typeof value.total !== "number" ||
        typeof value.total_pages !== "number"
    ) {
        throw new TypeError("Admin API returned invalid pagination metadata.");
    }

    return {
        page: value.page,
        limit: value.limit,
        total: value.total,
        total_pages: value.total_pages,
    };
}

function parseList<T>(
    body: unknown,
    parseItem: (item: unknown) => T,
): AdminListResult<T> {
    const envelope = body as ListEnvelope<T>;
    if (
        !isRecord(envelope) ||
        envelope.success !== true ||
        !Array.isArray(envelope.data)
    ) {
        throw new TypeError("Admin API returned an invalid list response.");
    }

    return {
        items: envelope.data.map(parseItem),
        meta: parseMeta(envelope.meta),
    };
}

function parseUser(value: unknown): AdminUser {
    const userId = isRecord(value) ? value.user_id ?? value.id : undefined;
    const isActive = isRecord(value)
        ? typeof value.is_active === "boolean"
            ? value.is_active
            : value.status === "inactive"
              ? false
              : true
        : undefined;

    if (
        !isRecord(value) ||
        typeof userId !== "string" ||
        typeof value.name !== "string" ||
        typeof value.email !== "string" ||
        typeof value.role !== "string" ||
        typeof isActive !== "boolean" ||
        typeof value.created_at !== "string" ||
        (value.roles !== undefined &&
            (!Array.isArray(value.roles) ||
                !value.roles.every((role) => typeof role === "string")))
    ) {
        throw new TypeError("Admin API returned an invalid user.");
    }

    return {
        user_id: userId,
        name: value.name,
        email: value.email,
        role: normalizeRole(value.role),
        ...(Array.isArray(value.roles)
            ? { roles: value.roles.map(normalizeRole) }
            : {}),
        is_active: isActive,
        created_at: value.created_at,
    };
}

function parseCreatorRequest(value: unknown): CreatorRequest {
    const requestId = isRecord(value)
        ? value.request_id ?? value.id
        : undefined;
    const user = isRecord(value) ? value.user : undefined;
    const storeProfile = isRecord(value) ? value.store_profile : undefined;
    const createdAt = isRecord(storeProfile)
        ? storeProfile.created_at
        : isRecord(value)
          ? value.created_at
          : undefined;

    if (
        !isRecord(value) ||
        typeof requestId !== "string" ||
        !isRecord(user) ||
        typeof user.name !== "string" ||
        typeof user.email !== "string" ||
        typeof createdAt !== "string" ||
        (value.status !== "pending" &&
            value.status !== "approved" &&
            value.status !== "rejected")
    ) {
        throw new TypeError("Admin API returned an invalid creator request.");
    }

    return {
        request_id: requestId,
        name: user.name,
        email: user.email,
        created_at: createdAt,
        status: value.status,
    };
}

export interface ListAdminUsersParams {
    role: "all" | "creator" | "customer";
    status: AccountStatusFilter;
    search: string;
    page: number;
    limit: number;
}

export interface ListCreatorRequestsParams {
    status: "all" | CreatorRequestStatus;
    page: number;
    limit: number;
}

class AdminApi {
    async listUsers(params: ListAdminUsersParams): Promise<AdminListResult<AdminUser>> {
        // TODO: sambungkan ke endpoint backend
        const response = await ApiServices.get(ApiEndpoints.adminUsers, {
            params: {
                ...params,
                role: params.role === "creator" ? "designer" : params.role,
            },
        });
        return parseList(response.data, parseUser);
    }

    async updateUserStatus(
        userId: string,
        isActive: boolean,
    ): Promise<void> {
        // TODO: sambungkan ke endpoint backend
        const response = await ApiServices.patch(
            ApiEndpoints.adminUserStatus(userId),
            { is_active: isActive },
        );
        readSuccessResponse(response);
    }

    async listCreatorRequests(
        params: ListCreatorRequestsParams,
    ): Promise<AdminListResult<CreatorRequest>> {
        // TODO: sambungkan ke endpoint backend
        const response = await ApiServices.get(ApiEndpoints.adminCreatorRequests, {
            params,
        });
        return parseList(response.data, parseCreatorRequest);
    }

    async reviewCreatorRequest(
        requestId: string,
        decision: "approve" | "reject",
        reason?: string,
    ): Promise<void> {
        // TODO: sambungkan ke endpoint backend
        const endpoint =
            decision === "approve"
                ? ApiEndpoints.approveCreatorRequest(requestId)
                : ApiEndpoints.rejectCreatorRequest(requestId);
        const response = await ApiServices.post(
            endpoint,
            decision === "reject" ? { reason } : {},
        );
        readSuccessResponse(response);
    }
}

export default new AdminApi();
