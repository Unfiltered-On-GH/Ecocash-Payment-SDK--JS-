import { EcoCashConfig, EcoCashTransactionLookupRequest, PaymentResult } from "./types";
export declare class EcoCashTransaction {
    private client;
    private config;
    constructor(config: EcoCashConfig);
    /**
     * Look up transaction status
     * @param lookupRequest Transaction lookup request data
     * @returns Promise with transaction details
     */
    lookupTransaction(lookupRequest: EcoCashTransactionLookupRequest): Promise<PaymentResult>;
    /**
     * Quick lookup by reference only (uses the phone number from config if available)
     * @param sourceReference The transaction reference
     * @param sourceMobileNumber Optional phone number (will try to use from config if not provided)
     * @returns Promise with transaction details
     */
    quickLookup(sourceReference: string, sourceMobileNumber?: string): Promise<PaymentResult>;
}
