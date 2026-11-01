import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../../utils/url_api";
import { readSuccessResponse } from "../../utils/apiResponse";

class ApiCollection {
    async getMine() {
        const response = await ApiServices.get(ApiEndpoints.collection);
        const collection = readSuccessResponse(response);

        if (!Array.isArray(collection)) {
            throw new TypeError("The collection API response must contain an array.");
        }

        return collection;
    }

    async addFreeFont(fontId) {
        if (typeof fontId !== "string" || !fontId.trim()) {
            throw new TypeError("A valid font ID is required.");
        }

        const response = await ApiServices.post(ApiEndpoints.collection, {
            font_id: fontId,
        });
        return readSuccessResponse(response);
    }

    async removeFreeFont(fontId) {
        if (typeof fontId !== "string" || !fontId.trim()) {
            throw new TypeError("A valid font ID is required.");
        }

        const response = await ApiServices.delete(
            ApiEndpoints.collectionFontById(fontId),
        );
        return readSuccessResponse(response);
    }
}

export default new ApiCollection();