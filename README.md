# EcoCash Payment SDK

A Node.js SDK for interacting with the EcoCash API for payments, refunds, and transaction lookups.

## Installation

```bash
npm install ecocash-payment-sdk
```

### First Things First: Get Your EcoCash API Key

1. Go to the EcoCash Developer's Portal [https://developers.ecocash.co.zw/]
2. Sign Up or Sign in (FreeOTP App is required)

- PlayStore : https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp
- AppStore : https://apps.apple.com/us/app/freeotp-authenticator/id872559395
- F-droid : https://f-droid.org/packages/org.fedorahosted.freeotp

3. Create an Application
4. Get your API for that Application

## Quick Start

### Making a Payment

```javascript
const { EcoCashPayment } = require("ecocash-payment-sdk");

// Initialize the payment client
const paymentClient = new EcoCashPayment({
  apiKey: "your-api-key-here",
  environment: "sandbox", // or 'live'
});

// Make a payment
const result = await paymentClient.makePayment({
  customerEcocashPhoneNumber: "2637XXXXXXXX",
  amount: 10.5,
  description: "Payment for services",
  currency: "USD",
});

if (result.success) {
  console.log("✅ Payment successful! Reference:", result.reference);
  console.log("Status:", result.status);
} else {
  console.error("❌ Payment failed:", result.error);
}
```

### Requesting a Refund

```javascript
const { EcoCashRefund } = require("ecocash-payment-sdk");

const refundClient = new EcoCashRefund({
  apiKey: "your-api-key-here",
  environment: "sandbox",
});

const refundResult = await refundClient.requestRefund({
  originalEcocashTransactionReference: "transaction-reference-here",
  refundCorrelator: "REF123456789",
  sourceMobileNumber: "2637XXXXXXXX",
  amount: 10.5,
  clientName: "Client Name",
  currency: "USD",
  reasonForRefund: "Customer requested refund",
});
```

### Looking Up a Transaction

```javascript
const { EcoCashTransaction } = require("ecocash-payment-sdk");

const transactionClient = new EcoCashTransaction({
  apiKey: "your-api-key-here",
  environment: "sandbox",
});

const lookupResult = await transactionClient.lookupTransaction({
  sourceMobileNumber: "2637XXXXXXXX",
  sourceReference: "transaction-reference-here",
});

if (lookupResult.success) {
  console.log("Transaction status:", lookupResult.data.status);
}
```

## API Reference

### EcoCashPayment

#### constructor(config: EcoCashConfig)

Creates a new EcoCashPayment instance.

**Configuration options:**

- `apiKey`: Your EcoCash API key (required - Get it from https://developers.ecocash.co.zw/)
- `environment`: 'sandbox' or 'live' (required)
- `baseURL`: Custom base URL (optional)
- `autoGenerateReference`: Whether to auto-generate source references (default: true)

#### makePayment(paymentRequest: EcoCashPaymentRequest): Promise<PaymentResult>

Makes a payment request.

**Payment request parameters:**

- `customerEcocashPhoneNumber`: Customer's EcoCash phone number (required)
- `amount`: Payment amount (required)
- `description`: Payment description (required)
- `currency`: Currency code, e.g., 'USD' (required)
- `sourceReference`: Optional custom reference (auto-generated if not provided)

#### quickPayment(phoneNumber: string, amount: number, description: string, currency?: string): Promise<PaymentResult>

Makes a payment with minimal parameters.

#### setApiKey(apiKey: string): void

Updates the API key.

#### setEnvironment(environment: 'sandbox' | 'live'): void

Updates the environment.

#### setAutoGenerateReference(autoGenerate: boolean): void

Toggles automatic reference generation.

### EcoCashRefund

#### requestRefund(refundRequest: EcoCashRefundRequest): Promise<PaymentResult>

Requests a refund for a previous transaction.

**Refund request parameters:**

- `originalEcocashTransactionReference`: Original transaction reference (required)
- `refundCorrelator`: Unique refund identifier (required)
- `sourceMobileNumber`: Customer's phone number (required)
- `amount`: Refund amount (required)
- `clientName`: Your business name (required)
- `currency`: Currency code (required)
- `reasonForRefund`: Reason for the refund (required)

### EcoCashTransaction

#### lookupTransaction(lookupRequest: EcoCashTransactionLookupRequest): Promise<PaymentResult>

Looks up the status of a transaction.

**Lookup request parameters:**

- `sourceMobileNumber`: Customer's phone number (required)
- `sourceReference`: Transaction reference (required)

#### quickLookup(sourceReference: string, sourceMobileNumber?: string): Promise<PaymentResult>

Quick lookup by reference only.

## Response Format

All methods return a consistent `PaymentResult` object:

```typescript
{
  success: boolean;      // Whether the operation was successful
  data?: any;           // Response data from API (on success)
  error?: string;       // Error message (on failure)
  reference?: string;   // Transaction reference
  status?: string;      // Transaction status
}
```

## Error Handling

```javascript
try {
  const result = await paymentClient.makePayment({
    customerEcocashPhoneNumber: "2637XXXXXXXX",
    amount: 10.5,
    description: "Payment for services",
    currency: "USD",
  });

  if (!result.success) {
    console.error("Operation failed:", result.error);
  }
} catch (error) {
  console.error("Unexpected error:", error.message);
}
```

## Sandbox Testing

For sandbox testing, use these test credentials:

- **Test phone numbers**: Use any valid Zimbabwean number format (e.g., '2637XXXXXXXX')
- **Test PIN codes**:
  - "0000"
  - "1234"
  - "9999"
- **Test amounts**: Use small amounts (e.g., 1.00, 2.50)

## Common Usage Patterns

### Complete Payment Flow

```javascript
const { EcoCashPayment, EcoCashTransaction } = require("ecocash-payment-sdk");

async function processPayment(phoneNumber, amount, description) {
  const paymentClient = new EcoCashPayment({
    apiKey: "your-api-key",
    environment: "sandbox",
  });

  const transactionClient = new EcoCashTransaction({
    apiKey: "your-api-key",
    environment: "sandbox",
  });

  // Step 1: Make payment
  const paymentResult = await paymentClient.makePayment({
    customerEcocashPhoneNumber: phoneNumber,
    amount: amount,
    description: description,
    currency: "USD",
  });

  if (!paymentResult.success) {
    throw new Error(`Payment failed: ${paymentResult.error}`);
  }

  // Step 2: Verify transaction status
  await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

  const verificationResult = await transactionClient.lookupTransaction({
    sourceMobileNumber: phoneNumber,
    sourceReference: paymentResult.reference,
  });

  return verificationResult;
}
```

## License

MIT

## Support

For issues and questions, please create an issue on our [GitHub repository](https://github.com/Unfiltered-On-GH/Ecocash-Payment-SDK-JS/issues).

## Changelog

### 1.0.4

- Support for payments, refunds, and transaction lookups
- Sandbox and live environment support
- TypeScript definitions included

---

**Note**: This SDK is unofficial and not affiliated with EcoCash. Always refer to the official EcoCash API documentation for the most up-to-date information.
