export interface EcoCashPaymentRequest {
    customerEcocashPhoneNumber: string;
    amount: number;
    description: string;
    currency: string;
    sourceReference?: string;
}
export interface EcoCashPaymentResponse {
    sourceReference: string;
    transactionEndTime: string;
    callbackUrl: string;
    destinationReferenceCode: string;
    sourceMobileNumber: string;
    transactionStatus: string;
    amount: number;
    destinationEcocashReference: string;
    clientMerchantCode: string;
    clientMerchantNumber: string;
    clienttransactionDate: string;
    description: string;
    responseMessage: string;
    currency: string;
    paymentAmount: number;
    ecocashReference: string;
    transactionstartTime: string;
}
export interface EcoCashRefundRequest {
    originalEcocashTransactionReference: string;
    refundCorrelator: string;
    sourceMobileNumber: string;
    amount: number;
    clientName: string;
    currency: string;
    reasonForRefund: string;
}
export interface EcoCashRefundResponse {
    sourceReference: string;
    transactionEndTime: string;
    callbackUrl: string;
    destinationReferenceCode: string;
    sourceMobileNumber: string;
    transactionStatus: string;
    amount: number;
    destinationEcocashReference: string;
    clientMerchantCode: string;
    clientMerchantNumber: string;
    clienttransactionDate: string;
    description: string;
    responseMessage: string;
    currency: string;
    paymentAmount: number;
    ecocashReference: string;
    transactionstartTime: string;
}
export interface EcoCashTransactionLookupRequest {
    sourceMobileNumber: string;
    sourceReference: string;
}
export interface EcoCashTransactionLookupResponse {
    amount: {
        amount: number;
        currency: string;
    };
    customerMsisdn: string;
    reference: string;
    ecocashReference: string;
    status: string;
    transactionDateTime: string;
}
export interface EcoCashConfig {
    apiKey: string;
    environment: "sandbox" | "live";
    baseURL?: string;
    autoGenerateReference?: boolean;
}
export interface PaymentResult {
    success: boolean;
    data?: any;
    error?: string;
    reference?: string;
    status?: string;
}
