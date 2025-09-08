"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcoCashRefund = void 0;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("./errors");
class EcoCashRefund {
    constructor(config) {
        this.config = config;
        const baseURL = config.baseURL || "https://developers.ecocash.co.zw/api/ecocash_pay";
        this.client = axios_1.default.create({
            baseURL,
            headers: {
                "X-API-KEY": config.apiKey,
                "Content-Type": "application/json",
            },
        });
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                const { status, data } = error.response;
                (0, errors_1.handleError)(status, (data === null || data === void 0 ? void 0 : data.message) || "Request failed", data);
            }
            else if (error.request) {
                throw new Error("No response received from EcoCash API");
            }
            else {
                throw new Error("Error setting up request: " + error.message);
            }
        });
    }
    /**
     * Request a refund
     * @param refundRequest Refund request data
     * @returns Promise with refund result
     */
    async requestRefund(refundRequest) {
        try {
            const endpoint = this.config.environment === "sandbox"
                ? "/api/v2/refund/instant/c2b/sandbox"
                : "/api/v2/refund/instant/c2b/live";
            // Map to the API expected format
            const apiRequest = {
                origionalEcocashTransactionReference: refundRequest.originalEcocashTransactionReference,
                refundCorelator: refundRequest.refundCorrelator,
                sourceMobileNumber: refundRequest.sourceMobileNumber,
                amount: refundRequest.amount,
                clientName: refundRequest.clientName,
                currency: refundRequest.currency,
                reasonForRefund: refundRequest.reasonForRefund,
            };
            const response = await this.client.post(endpoint, apiRequest);
            return {
                success: true,
                data: response.data,
                status: response.data.transactionStatus,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
exports.EcoCashRefund = EcoCashRefund;
