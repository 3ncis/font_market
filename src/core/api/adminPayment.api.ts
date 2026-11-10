import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "@/core/utils/url_api";
import { readSuccessResponse } from "@/core/utils/apiResponse";

export type PaymentStatus = "pending" | "success" | "failed" | "expired";

export interface AdminPayment {
    id: string;
    order_id: string;
    user_id: string;
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
    amount: number | null;
    order_status: string | null;
    reference_number: string;
    payment_method: string;
    gateway_status: PaymentStatus;
    expired_at: string;
    paid_at: string | null;
    created_at: string;
}

export interface PaymentListMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface AdminPaymentList {
    items: AdminPayment[];
    testing_enabled: boolean;
    meta: PaymentListMeta;
}

export interface PaymentVerificationResult {
    payment: {
        id: string;
        order_id: string;
        gateway_status: PaymentStatus;
        paid_at: string | null;
    };
    order: {
        id: string;
        status: string;
        paid_at: string | null;
    };
    collection: {
        confirmed: boolean;
        expected_items: number;
        found_items: number;
    };
}

interface PaymentListParams {
    status: "all" | PaymentStatus;
    search: string;
    page: number;
    limit: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPaymentStatus(value: unknown): value is PaymentStatus {
    return (
        value === "pending" ||
        value === "success" ||
        value === "failed" ||
        value === "expired"
    );
}

function isAdminPaymentUser(
    value: unknown,
): value is NonNullable<AdminPayment["user"]> {
    return (
        isRecord(value) &&
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        typeof value.email === "string"
    );
}

function parseMeta(value: unknown): PaymentListMeta {
    if (
        !isRecord(value) ||
        typeof value.page !== "number" ||
        typeof value.limit !== "number" ||
        typeof value.total !== "number" ||
        typeof value.total_pages !== "number"
    ) {
        throw new TypeError("Admin payment API returned invalid pagination metadata.");
    }

    return {
        page: value.page,
        limit: value.limit,
        total: value.total,
        total_pages: value.total_pages,
    };
}

function parsePayment(value: unknown): AdminPayment {
    const user = isRecord(value) ? value.user : undefined;
    if (
        !isRecord(value) ||
        typeof value.id !== "string" ||
        typeof value.order_id !== "string" ||
        typeof value.user_id !== "string" ||
        !(user === null || isAdminPaymentUser(user)) ||
        !(typeof value.amount === "number" || value.amount === null) ||
        !(typeof value.order_status === "string" || value.order_status === null) ||
        typeof value.reference_number !== "string" ||
        typeof value.payment_method !== "string" ||
        !isPaymentStatus(value.gateway_status) ||
        typeof value.expired_at !== "string" ||
        !(typeof value.paid_at === "string" || value.paid_at === null) ||
        typeof value.created_at !== "string"
    ) {
        throw new TypeError("Admin payment API returned an invalid payment.");
    }

    return {
        id: value.id,
        order_id: value.order_id,
        user_id: value.user_id,
        user:
            user === null
                ? null
                : user && isAdminPaymentUser(user)
                  ? { id: user.id, name: user.name, email: user.email }
                  : null,
        amount: value.amount,
        order_status: value.order_status,
        reference_number: value.reference_number,
        payment_method: value.payment_method,
        gateway_status: value.gateway_status,
        expired_at: value.expired_at,
        paid_at: value.paid_at,
        created_at: value.created_at,
    };
}

function parseVerificationResult(value: unknown): PaymentVerificationResult {
    if (
        !isRecord(value) ||
        !isRecord(value.payment) ||
        typeof value.payment.id !== "string" ||
        typeof value.payment.order_id !== "string" ||
        !isPaymentStatus(value.payment.gateway_status) ||
        !(typeof value.payment.paid_at === "string" || value.payment.paid_at === null) ||
        !isRecord(value.order) ||
        typeof value.order.id !== "string" ||
        typeof value.order.status !== "string" ||
        !(typeof value.order.paid_at === "string" || value.order.paid_at === null) ||
        !isRecord(value.collection) ||
        typeof value.collection.confirmed !== "boolean" ||
        typeof value.collection.expected_items !== "number" ||
        typeof value.collection.found_items !== "number"
    ) {
        throw new TypeError("Admin payment API returned an invalid verification result.");
    }

    return {
        payment: {
            id: value.payment.id,
            order_id: value.payment.order_id,
            gateway_status: value.payment.gateway_status,
            paid_at: value.payment.paid_at,
        },
        order: {
            id: value.order.id,
            status: value.order.status,
            paid_at: value.order.paid_at,
        },
        collection: {
            confirmed: value.collection.confirmed,
            expected_items: value.collection.expected_items,
            found_items: value.collection.found_items,
        },
    };
}

class AdminPaymentApi {
    async list(params: PaymentListParams): Promise<AdminPaymentList> {
        const response = await ApiServices.get(ApiEndpoints.adminPayments, {
            params,
        });
        const data = readSuccessResponse(response);

        if (
            !isRecord(data) ||
            !Array.isArray(data.items) ||
            typeof data.testing_enabled !== "boolean"
        ) {
            throw new TypeError("Admin payment API returned an invalid list response.");
        }

        return {
            items: data.items.map(parsePayment),
            testing_enabled: data.testing_enabled,
            meta: parseMeta(response.data?.meta),
        };
    }

    async approveForTesting(paymentId: string): Promise<PaymentVerificationResult> {
        const response = await ApiServices.post(
            ApiEndpoints.approvePaymentForTesting(paymentId),
        );
        return parseVerificationResult(readSuccessResponse(response));
    }
}

export default new AdminPaymentApi();
