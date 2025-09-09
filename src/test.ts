import { EcoCashPayment } from "./EcoCashPayment";
import { EcoCashTransaction } from "./EcoCashTransaction";
import { EcoCashRefund } from "./EcoCashRefund";

// Test configuration
const config = {
  apiKey: process.env.ECOCASH_API_KEY || "your-ecocash-api-key", // API FROM THE ECOCASH DEVELOPERS PORTAL
  environment: "sandbox" as const,
  autoGenerateReference: true,
};

const customerEcocashPhoneNumber = "2637XXXXXXXX"; // Replace with a valid EcoCash number for testing

// Delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function testEcoCashSDK() {
  console.log("=== Testing EcoCash Payment SDK ===\n");

  const paymentClient = new EcoCashPayment(config);
  const transactionClient = new EcoCashTransaction(config);
  const refundClient = new EcoCashRefund(config);

  let paymentReference: string | undefined;

  try {
    // Test 1: Make a payment
    console.log("1. Testing payment...");
    const paymentResult = await paymentClient.makePayment({
      customerEcocashPhoneNumber: customerEcocashPhoneNumber,
      amount: 1.0,
      description: "Test payment from SDK",
      currency: "USD",
    });

    if (paymentResult.success) {
      console.log("✅ Payment Request successfully sent!");
      console.log("Reference:", paymentResult.reference);
      console.log("Status:", paymentResult.status);
      console.log(
        "Full response:",
        JSON.stringify(paymentResult.data, null, 2)
      );
      paymentReference = paymentResult.reference;

      // Wait 30 seconds before next test
      console.log("\n⏳ Waiting 30 seconds before transaction lookup...");
      await delay(30000);

      // Test 2: Look up the transaction
      console.log("\n2. Testing transaction lookup...");
      if (paymentReference) {
        const lookupResult = await transactionClient.lookupTransaction({
          sourceMobileNumber: customerEcocashPhoneNumber,
          sourceReference: paymentReference,
        });

        if (lookupResult.success) {
          console.log("✅ Lookup successful!");
          console.log("Transaction status:", lookupResult.data?.status);
          console.log(
            "Full response:",
            JSON.stringify(lookupResult.data, null, 2)
          );
        } else {
          console.log("❌ Lookup failed:", lookupResult.error);
          console.log("Full response:", JSON.stringify(lookupResult, null, 2));
        }
      }

      // Wait 30 seconds before refund test
      console.log("\n⏳ Waiting 30 seconds before refund test...");
      await delay(30000);

      // Test 3: Test refund
      console.log("\n3. Testing refund...");
      if (paymentReference) {
        const refundResult = await refundClient.requestRefund({
          originalEcocashTransactionReference: paymentReference,
          refundCorrelator: `REFUND-${Date.now()}`,
          sourceMobileNumber: customerEcocashPhoneNumber,
          amount: 1.0,
          clientName: "Test Merchant",
          currency: "USD",
          reasonForRefund: "Test refund from SDK",
        });

        if (refundResult.success) {
          console.log("✅ Refund successful!");
          console.log("Refund status:", refundResult.status);
          console.log(
            "Full response:",
            JSON.stringify(refundResult.data, null, 2)
          );
        } else {
          console.log("❌ Refund failed:", refundResult.error);
          console.log("Full response:", JSON.stringify(refundResult, null, 2));
        }
      } else {
        console.log("❌ Cannot test refund - no payment reference available");
      }
    } else {
      console.log("❌ Payment failed:", paymentResult.error);
      console.log("Full response:", JSON.stringify(paymentResult, null, 2));
    }
  } catch (error: any) {
    console.log("❌ Error:", error.message);
    console.log("Stack:", error.stack);
  }

  console.log("\n=== Testing complete ===");
}

// Run the tests
testEcoCashSDK().catch((error) => {
  console.error("Unhandled error:", error);
});
