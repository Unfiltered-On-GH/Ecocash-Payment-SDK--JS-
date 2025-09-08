import { EcoCashConfig, EcoCashRefundRequest, PaymentResult } from "./types";
export declare class EcoCashRefund {
    private client;
    private config;
    constructor(config: EcoCashConfig);
    /**
     * Request a refund
     * @param refundRequest Refund request data
     * @returns Promise with refund result
     */
    requestRefund(refundRequest: EcoCashRefundRequest): Promise<PaymentResult>;
}
