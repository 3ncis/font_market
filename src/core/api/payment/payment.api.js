import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../../utils/url_api";

class ApiPayment {
    async createCheckout(orderId, paymentMethod) {
        if (typeof orderId !== "string" || !orderId.trim()) {
            throw new TypeError("A valid order ID is required for checkout.");
        }

        if (typeof paymentMethod !== "string" || !paymentMethod.trim()) {
            throw new TypeError("A payment method is required for checkout.");
        }

        const response = await ApiServices.post(ApiEndpoints.checkout, {
            order_id: orderId,
            payment_method: paymentMethod,
        });
        return response.data;
    }
}

export default new ApiPayment();
