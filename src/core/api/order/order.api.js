import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../../utils/url_api";

class ApiOrder {
    async getAll() {
        const response = await ApiServices.get(ApiEndpoints.orders);
        return response.data;
    }

    async getById(id) {
        const response = await ApiServices.get(ApiEndpoints.orderById(id));
        return response.data;
    }

    async create(fontIds) {
        if (
            !Array.isArray(fontIds) ||
            fontIds.length < 1 ||
            fontIds.length > 50 ||
            new Set(fontIds).size !== fontIds.length ||
            fontIds.some((id) => typeof id !== "string" || !id.trim())
        ) {
            throw new TypeError("An order requires 1–50 unique font IDs.");
        }

        const response = await ApiServices.post(ApiEndpoints.orders, {
            font_ids: fontIds,
        });
        return response.data;
    }
}

export default new ApiOrder();
