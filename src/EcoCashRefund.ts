import axios, { AxiosInstance } from "axios";
import {
  EcoCashConfig,
  EcoCashRefundRequest,
  EcoCashRefundResponse,
  PaymentResult,
} from "./types";
import { handleError } from "./errors";

export class EcoCashRefund {
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
   * Request a refund
   * @param refundRequest Refund request data
   * @returns Promise with refund result
   */
  async requestRefund(
    refundRequest: EcoCashRefundRequest
  ): Promise<PaymentResult> {
    try {
      const endpoint =
        this.config.environment === "sandbox"
          ? "/api/v2/refund/instant/c2b/sandbox"
          : "/api/v2/refund/instant/c2b/live";

      // Map to the API expected format
      const apiRequest = {
        origionalEcocashTransactionReference:
          refundRequest.originalEcocashTransactionReference,
        refundCorelator: refundRequest.refundCorrelator,
        sourceMobileNumber: refundRequest.sourceMobileNumber,
        amount: refundRequest.amount,
        clientName: refundRequest.clientName,
        currency: refundRequest.currency,
        reasonForRefund: refundRequest.reasonForRefund,
      };

      const response = await this.client.post<EcoCashRefundResponse>(
        endpoint,
        apiRequest
      );

      return {
        success: true,
        data: response.data,
        status: response.data.transactionStatus,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
