import { EcoCashPaymentRequest, EcoCashConfig, PaymentResult } from "./types";
export declare class EcoCashPayment {
    private client;
    private config;
    constructor(config: EcoCashConfig);
    /**
     * Make a payment request with simplified interface
     * @param paymentRequest Payment request data
     * @returns Promise with payment response
     */
    makePayment(paymentRequest: EcoCashPaymentRequest): Promise<PaymentResult>;
    /**
     * Quick payment method with minimal parameters
     * @param phoneNumber Customer EcoCash phone number
     * @param amount Payment amount
     * @param description Payment description
     * @param currency Currency (default: USD)
     * @returns Promise with payment result
     */
    quickPayment(phoneNumber: string, amount: number, description: string, currency?: string): Promise<PaymentResult>;
    /**
     * Get the current configuration
     * @returns Current configuration
     */
    getConfig(): EcoCashConfig;
    /**
     * Update the API key
     * @param apiKey New API key
     */
    setApiKey(apiKey: string): void;
    /**
     * Update the environment
     * @param environment New environment (sandbox or live)
     */
    setEnvironment(environment: "sandbox" | "live"): void;
    /**
     * Toggle automatic reference generation
     * @param autoGenerate Whether to auto-generate references
     */
    setAutoGenerateReference(autoGenerate: boolean): void;
}
