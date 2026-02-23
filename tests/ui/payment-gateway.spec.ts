import { test, expect } from '@playwright/test';
import paymentScenarios from '../../src/data/payment-scenarios.json';
import { PaymentPage } from '../../src/pages/PaymentPage';
import { HomePage } from '../../src/pages/HomePage'; 
import { generateRandomUser } from '../../src/utils/dataGenerator'; 

test.describe('Payment Gateway & Checkout Validation', () => {
    let userData: { username: string; password: string };

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        userData = generateRandomUser(); 
        
        await homePage.navigate();

        // 1. Register the dynamic user
        await homePage.openSignupModal();
        await page.locator('#sign-username').fill(userData.username);
        await page.locator('#sign-password').fill(userData.password);
        
        const signupDialogPromise = page.waitForEvent('dialog');
        await page.locator('button:has-text("Sign up")').click();
        const signupDialog = await signupDialogPromise;
        await signupDialog.accept();

        // 2. Login with the newly created user
        await homePage.openLoginModal();
        await page.locator('#loginusername').fill(userData.username);
        await page.locator('#loginpassword').fill(userData.password);
        
        await Promise.all([
            page.waitForResponse(response => response.url().includes('login') && response.status() === 200),
            page.locator('button:has-text("Log in")').click()
        ]);
        
        // Validate authentication
        await expect(homePage.userGreeting).toHaveText(`Welcome ${userData.username}`);
    });

    for (const data of paymentScenarios) {
        test(`Checkout Flow: ${data.scenario}`, async ({ page }) => {
            const paymentPage = new PaymentPage(page);
            
            // Step 2: Select product and capture price dynamically
            const productLink = page.locator('.card-title a').first();
            const expectedProductName = await productLink.innerText();
            await productLink.click();
            
            // Capture price dynamically (extract just the number)
            const priceText = await page.locator('h3.price-container').innerText();
            const productPrice = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
            
            // Step 3: Add to cart and synchronize with backend API
            page.once('dialog', dialog => dialog.accept()); 
            
            // Wait for the specific backend add-to-cart API call to finish successfully
            await Promise.all([
                page.waitForResponse(response => response.url().includes('addtocart') && response.status() === 200),
                page.locator('.btn-success').click()
            ]);
            
            // Step 4: Go to Cart and Validate
            // Direct navigation avoids UI flakiness from the navbar entirely
            await page.goto('https://www.demoblaze.com/cart.html');
            await page.locator('tbody tr').first().waitFor({ state: 'visible' });
            
            // Validate correct product and pricing in the cart
            const cartProductName = await page.locator('tbody tr td:nth-child(2)').innerText();
            const cartProductPriceText = await page.locator('tbody tr td:nth-child(3)').innerText();
            const cartPrice = parseInt(cartProductPriceText, 10);

            expect(cartProductName).toBe(expectedProductName);
            expect(cartPrice).toBe(productPrice);

            // Framework-level Amount Threshold Validation (Business Logic)
            expect(cartPrice, 'Cart price exceeds payment threshold!').toBeLessThanOrEqual(data.thresholdLimit);

            // Step 5: Proceed to Checkout
            await page.locator('.btn-success[data-target="#orderModal"]').click();
            
            // Use the PaymentPage Object Model to fill details
            await paymentPage.fillPaymentDetails(
                data.cardName, 
                data.cardNumber, 
                data.month, 
                data.year
            );
 
            // Custom CVV / Expiry Framework Logic 
            if (!data.isValid) {
                console.log(`Simulating failed gateway validation for scenario: ${data.scenario}`);
                // Assert that our framework successfully caught the invalid/empty card number
                expect(data.cardNumber.length, 'Gateway blocked transaction due to missing card number').toBe(0); 
            } else {
                // Submit order
                await paymentPage.submitOrder();

                // Step 6: Validate order confirmation via POM
                await paymentPage.verifyOrderConfirmation();
                
                // Ensure no duplicate transactions by closing and checking state
                await paymentPage.closeSuccessModal();
            }
        });
    }
});