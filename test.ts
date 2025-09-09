import { EcoCashPayment } from "./src/EcoCashPayment";
import { EcoCashTransaction } from "./src/EcoCashTransaction";

// Test configuration
const config = {
  apiKey: "your-api-key", // Sandbox key from docs
  environment: "sandbox" as const,
  autoGenerateReference: true,
};

async function testEcoCashSDK() {
  console.log("=== Testing EcoCash Payment SDK ===\n");

  const paymentClient = new EcoCashPayment(config);
  const transactionClient = new EcoCashTransaction(config);

  try {
    // Test 1: Make a payment
    console.log("1. Testing payment...");
    const paymentResult = await paymentClient.makePayment({
      customerEcocashPhoneNumber: "263774222475",
      amount: 1.0,
      description: "Test payment from SDK",
      currency: "USD",
    });

    if (paymentResult.success) {
      console.log("✅ Payment successful!");
      console.log("Reference:", paymentResult.reference);
      console.log("Status:", paymentResult.status);

      // Test 2: Look up the transaction
      console.log("\n2. Testing transaction lookup...");
      if (paymentResult.reference) {
        const lookupResult = await transactionClient.lookupTransaction({
          sourceMobileNumber: "263774222475",
          sourceReference: paymentResult.reference,
        });

        if (lookupResult.success) {
          console.log("✅ Lookup successful!");
          console.log("Transaction status:", lookupResult.data?.status);
        } else {
          console.log("❌ Lookup failed:", lookupResult.error);
        }
      }
    } else {
      console.log("❌ Payment failed:", paymentResult.error);
    }
  } catch (error: any) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n=== Testing complete ===");
}

// Run the tests
testEcoCashSDK();
