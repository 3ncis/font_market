import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../../utils/url_api";
import { readSuccessResponse } from "../../utils/apiResponse";

const objectIdPattern = /^[a-f\d]{24}$/i;
const paymentMethods = ["bank_transfer", "credit_card", "e_wallet", "qris"];

class ApiOrder {
    async getAll() {
        const response = await ApiServices.get(ApiEndpoints.orders);
        return readSuccessResponse(response);
    }

    async getById(id) {
        if (typeof id !== "string" || !objectIdPattern.test(id)) {
            throw new TypeError("A valid order ID is required.");
        }

        const response = await ApiServices.get(ApiEndpoints.orderById(id));
        return readSuccessResponse(response);
    }

    async create(fontIds, paymentMethod) {
        if (
            !Array.isArray(fontIds) ||
            fontIds.length < 1 ||
            fontIds.length > 50 ||
            new Set(fontIds).size !== fontIds.length ||
            fontIds.some((id) => typeof id !== "string" || !objectIdPattern.test(id))
        ) {
            throw new TypeError("An order requires 1–50 unique font IDs.");
        }

        if (!paymentMethods.includes(paymentMethod)) {
            throw new TypeError("A supported payment method is required.");
        }

        const response = await ApiServices.post(ApiEndpoints.orders, {
            font_ids: fontIds,
            payment_method: paymentMethod,
        });
        return readSuccessResponse(response);
    }
}

export default new ApiOrder();
