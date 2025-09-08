"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcoCashPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const errors_1 = require("./errors");
class EcoCashPayment {
    constructor(config) {
        this.config = {
            autoGenerateReference: true,
            ...config,
        };
        const baseURL = config.baseURL || "https://developers.ecocash.co.zw/api/ecocash_pay";
        this.client = axios_1.default.create({
            baseURL,
            headers: {
                "X-API-KEY": config.apiKey,
                "Content-Type": "application/json",
            },
            timeout: 30000, // 30 seconds timeout
        });
        // Add response interceptor for error handling
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
     * Make a payment request with simplified interface
     * @param paymentRequest Payment request data
     * @returns Promise with payment response
     */
    async makePayment(paymentRequest) {
        try {
            const endpoint = this.config.environment === "sandbox"
                ? "/api/v2/payment/instant/c2b/sandbox"
                : "/api/v2/payment/instant/c2b/live";
            // Generate sourceReference if not provided and autoGenerateReference is true
            const sourceReference = paymentRequest.sourceReference ||
                (this.config.autoGenerateReference ? (0, uuid_1.v4)() : undefined);
            if (!sourceReference) {
                throw new Error("sourceReference is required when autoGenerateReference is false");
            }
            // Map to the API expected format
            const apiRequest = {
                customerMsisdn: paymentRequest.customerEcocashPhoneNumber,
                amount: paymentRequest.amount,
                reason: paymentRequest.description,
                currency: paymentRequest.currency,
                sourceReference: sourceReference,
            };
            const response = await this.client.post(endpoint, apiRequest);
            return {
                success: true,
                data: response.data,
                reference: sourceReference,
                status: response.data.transactionStatus,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                reference: paymentRequest.sourceReference,
            };
        }
    }
    /**
     * Quick payment method with minimal parameters
     * @param phoneNumber Customer EcoCash phone number
     * @param amount Payment amount
     * @param description Payment description
     * @param currency Currency (default: USD)
     * @returns Promise with payment result
     */
    async quickPayment(phoneNumber, amount, description, currency = "USD") {
        return this.makePayment({
            customerEcocashPhoneNumber: phoneNumber,
            amount,
            description,
            currency,
        });
    }
    /**
     * Get the current configuration
     * @returns Current configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update the API key
     * @param apiKey New API key
     */
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this.client.defaults.headers["X-API-KEY"] = apiKey;
    }
    /**
     * Update the environment
     * @param environment New environment (sandbox or live)
     */
    setEnvironment(environment) {
        this.config.environment = environment;
    }
    /**
     * Toggle automatic reference generation
     * @param autoGenerate Whether to auto-generate references
     */
    setAutoGenerateReference(autoGenerate) {
        this.config.autoGenerateReference = autoGenerate;
    }
}
exports.EcoCashPayment = EcoCashPayment;
