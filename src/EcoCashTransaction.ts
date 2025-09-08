import axios, { AxiosInstance } from "axios";
import {
  EcoCashConfig,
  EcoCashTransactionLookupRequest,
  EcoCashTransactionLookupResponse,
  PaymentResult,
} from "./types";
import { handleError } from "./errors";

export class EcoCashTransaction {
  private client: AxiosInstance;
  private config: EcoCashConfig;

  constructor(config: EcoCashConfig) {
    this.config = config;

    const baseURL =
      config.baseURL || "https://developers.ecocash.co.zw/api/ecocash_pay";

    this.client = axios.create({
      baseURL,
      headers: {
        "X-API-KEY": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { status, data } = error.response;
          handleError(status, data?.message || "Request failed", data);
        } else if (error.request) {
          throw new Error("No response received from EcoCash API");
        } else {
          throw new Error("Error setting up request: " + error.message);
        }
      }
    );
  }

  /**
   * Look up transaction status
   * @param lookupRequest Transaction lookup request data
   * @returns Promise with transaction details
   */
  async lookupTransaction(
    lookupRequest: EcoCashTransactionLookupRequest
  ): Promise<PaymentResult> {
    try {
      const endpoint =
        this.config.environment === "sandbox"
          ? "/api/v1/transaction/c2b/status/sandbox"
          : "/api/v1/transaction/c2b/status/live";

      const response = await this.client.post<EcoCashTransactionLookupResponse>(
        endpoint,
        lookupRequest
      );

      return {
        success: true,
        data: response.data,
        status: response.data.status,
        reference: lookupRequest.sourceReference,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        reference: lookupRequest.sourceReference,
      };
    }
  }

  /**
   * Quick lookup by reference only (uses the phone number from config if available)
   * @param sourceReference The transaction reference
   * @param sourceMobileNumber Optional phone number (will try to use from config if not provided)
   * @returns Promise with transaction details
   */
  async quickLookup(
    sourceReference: string,
    sourceMobileNumber?: string
  ): Promise<PaymentResult> {
    // In a real implementation, you might store the phone number in config
    // or require it as a parameter
    if (!sourceMobileNumber) {
      return {
        success: false,
        error: "Source mobile number is required for transaction lookup",
        reference: sourceReference,
      };
    }

    return this.lookupTransaction({
      sourceMobileNumber,
      sourceReference,
    });
  }
}
