"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EcoCashPayment_1 = require("./EcoCashPayment");
const EcoCashTransaction_1 = require("./EcoCashTransaction");
const EcoCashRefund_1 = require("./EcoCashRefund");
// Test configuration
const config = {
    apiKey: "IxPMsN8xsZCHkBgWcy1UZ4hhOKmc-Y1-", // Sandbox key from docs
    environment: "sandbox",
    autoGenerateReference: true,
};
// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function testEcoCashSDK() {
    var _a;
    console.log("=== Testing EcoCash Payment SDK ===\n");
    const paymentClient = new EcoCashPayment_1.EcoCashPayment(config);
    const transactionClient = new EcoCashTransaction_1.EcoCashTransaction(config);
    const refundClient = new EcoCashRefund_1.EcoCashRefund(config);
    let paymentReference;
    try {
        // Test 1: Make a payment
        console.log("1. Testing payment...");
        const paymentResult = await paymentClient.makePayment({
            customerEcocashPhoneNumber: "263773403139",
            amount: 1.0,
            description: "Test payment from SDK",
            currency: "USD",
        });
        if (paymentResult.success) {
            console.log("✅ Payment successful!");
            console.log("Reference:", paymentResult.reference);
            console.log("Status:", paymentResult.status);
            console.log("Full response:", JSON.stringify(paymentResult.data, null, 2));
            paymentReference = paymentResult.reference;
            // Wait 30 seconds before next test
            console.log("\n⏳ Waiting 30 seconds before transaction lookup...");
            await delay(30000);
            // Test 2: Look up the transaction
            console.log("\n2. Testing transaction lookup...");
            if (paymentReference) {
                const lookupResult = await transactionClient.lookupTransaction({
                    sourceMobileNumber: "263773403139",
                    sourceReference: paymentReference,
                });
                if (lookupResult.success) {
                    console.log("✅ Lookup successful!");
                    console.log("Transaction status:", (_a = lookupResult.data) === null || _a === void 0 ? void 0 : _a.status);
                    console.log("Full response:", JSON.stringify(lookupResult.data, null, 2));
                }
                else {
                    console.log("❌ Lookup failed:", lookupResult.error);
                    console.log("Full response:", JSON.stringify(lookupResult, null, 2));
                }
            }
            // Wait 30 seconds before refund test
            console.log("\n⏳ Waiting 30 seconds before refund test...");
            await delay(30000);
            // Test 3: Test refund (if we have a reference)
            console.log("\n3. Testing refund...");
            if (paymentReference) {
                const refundResult = await refundClient.requestRefund({
                    originalEcocashTransactionReference: paymentReference,
                    refundCorrelator: `REFUND-${Date.now()}`,
                    sourceMobileNumber: "263773403139",
                    amount: 1.0,
                    clientName: "Test Merchant",
                    currency: "USD",
                    reasonForRefund: "Test refund from SDK",
                });
                if (refundResult.success) {
                    console.log("✅ Refund successful!");
                    console.log("Refund status:", refundResult.status);
                    console.log("Full response:", JSON.stringify(refundResult.data, null, 2));
                }
                else {
                    console.log("❌ Refund failed:", refundResult.error);
                    console.log("Full response:", JSON.stringify(refundResult, null, 2));
                }
            }
            else {
                console.log("❌ Cannot test refund - no payment reference available");
            }
        }
        else {
            console.log("❌ Payment failed:", paymentResult.error);
            console.log("Full response:", JSON.stringify(paymentResult, null, 2));
        }
    }
    catch (error) {
        console.log("❌ Error:", error.message);
        console.log("Stack:", error.stack);
    }
    console.log("\n=== Testing complete ===");
}
// Run the tests
testEcoCashSDK().catch((error) => {
    console.error("Unhandled error:", error);
});
