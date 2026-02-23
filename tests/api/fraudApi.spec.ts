import { test, expect } from '@playwright/test';

test.describe('API Validation - Order Creation & Fraud Detection', () => {
    // API Under Test
    const baseURL = 'https://dummyjson.com'; 

    test('Should create a new order, validate structure, and check response time (< 2000ms)', async ({ request }) => {
        const startTime = Date.now();
        
        // Create a new order using POST request
        const response = await request.post(`${baseURL}/carts/add`, {
            data: {
                userId: 1,
                products: [
                    { id: 1, quantity: 2 },
                    { id: 2, quantity: 1 }
                ]
            }
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Verify response time is within acceptable threshold (< 2000ms)
        expect(responseTime, `Response time was ${responseTime}ms, exceeding the 2000ms SLA.`).toBeLessThan(2000);

        // Validate response status code
        expect(response.status()).toBe(201); // DummyJSON returns 201 for resource creation

        const responseBody = await response.json();

        // Validate response structure
        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('products');
        expect(responseBody).toHaveProperty('total');
        expect(responseBody.userId).toBe(1);
    });

    test('Fraud Detection: Should flag transactions exceeding high amount threshold', async ({ request }) => {
        // Simulating a purchase with an unusually high quantity to trigger fraud logic
        const response = await request.post(`${baseURL}/carts/add`, {
            data: {
                userId: 1,
                products: [
                    { id: 1, quantity: 9999 } // Unusually high quantity to force a massive total
                ]
            }
        });

        // Dummy API will still accept it, so we validate the framework logic locally
        expect(response.status()).toBe(201); 
        const responseBody = await response.json();

        // Implement fraud detection logic (e.g., high amount threshold)
        const fraudThresholdLimit = 50000; // Example limit: $50,000
        const isFraudulent = responseBody.total > fraudThresholdLimit;

        // In a real gateway, this API would return a 403. Since it's a dummy API, 
        // we assert that our framework successfully identified the transaction as fraudulent.
        expect(isFraudulent, 'Transaction flagged for fraud: Amount exceeds threshold limit').toBe(true);
    });

    test('Negative Scenario: Should reject invalid payload and missing fields', async ({ request }) => {
        // Validate negative scenarios such as invalid payload or missing fields
        const response = await request.post(`${baseURL}/carts/add`, {
            data: {
                // Deliberately missing the required 'userId' field
                products: [
                    { id: 1, quantity: 1 }
                ]
            }
        });

        // Expect a 400 Bad Request due to the missing required fields
        expect(response.status()).toBe(400); 
        
        const responseBody = await response.json();
        // Validate that the API returns an actual error structure, not just a blank failure
        expect(responseBody).toHaveProperty('message'); 
    });
});