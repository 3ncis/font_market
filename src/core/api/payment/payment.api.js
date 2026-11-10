import ApiServices from "@/core/services/ApiService";
import { ApiEndpoints } from "../../utils/url_api";
import { readSuccessResponse } from "../../utils/apiResponse";

const objectIdPattern = /^[a-f\d]{24}$/i;
const paymentMethods = ["bank_transfer", "credit_card", "e_wallet", "qris"];

class ApiPayment {
    async createCheckout(orderId, paymentMethod) {
        if (typeof orderId !== "string" || !objectIdPattern.test(orderId)) {
            throw new TypeError("A valid order ID is required for checkout.");
        }

        if (!paymentMethods.includes(paymentMethod)) {
            throw new TypeError("A supported payment method is required for checkout.");
        }

        const response = await ApiServices.post(ApiEndpoints.checkout, {
            order_id: orderId,
            payment_method: paymentMethod,
        });
        return readSuccessResponse(response);
    }
}

export default new ApiPayment();
