import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductPage } from '../../src/pages/ProductPage';
import { CartPage } from '../../src/pages/CartPage'; 
import { generateRandomUser } from '../../src/utils/dataGenerator';

test.describe('Digital Wallet - Web UI Checkout Flow', () => {
  const userData = generateRandomUser(); 
  const targetProduct = 'Samsung galaxy s6';
  let capturedPrice: number;

  test('E2E Checkout Workflow', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // 1. Register a new user with dynamic test data [cite: 13]
    await homePage.navigate();
    await homePage.openSignupModal();
    await page.locator('#sign-username').fill(userData.username);
    await page.locator('#sign-password').fill(userData.password);
    
    // Explicitly wait for registration confirmation 
    const signupDialogPromise = page.waitForEvent('dialog');
    await page.locator('button:has-text("Sign up")').click();
    const signupDialog = await signupDialogPromise;
    await signupDialog.accept();

    // 2. Login with created user and verify successful authentication 
    await homePage.openLoginModal();
    await page.locator('#loginusername').fill(userData.username);
    await page.locator('#loginpassword').fill(userData.password);
    
    // Ensure the login API call completes before checking for the greeting 
    await Promise.all([
      page.waitForResponse(response => response.url().includes('login') && response.status() === 200),
      page.locator('button:has-text("Log in")').click()
    ]);
    
    // Validate authentication by waiting for the dynamic greeting [cite: 14, 22]
    await expect(homePage.userGreeting).toHaveText(`Welcome ${userData.username}`);

    // 3. Select a product and capture its price dynamically [cite: 15]
    await homePage.selectProduct(targetProduct);
    capturedPrice = await productPage.getDynamicPrice();
    expect(capturedPrice).toBeGreaterThan(0); 

    // 4. Add product to cart and validate cart contents [cite: 16]
    await productPage.addToCart();
    await homePage.cartLink.click();
    
    // Assert the product is actually in the cart list [cite: 16]
    await expect(page.locator(`td:has-text("${targetProduct}")`)).toBeVisible();
    
    // 5. Place an order and verify confirmation message appears [cite: 17]
    await cartPage.submitOrder(userData.username, '1234567890123456');
    await expect(cartPage.successMessage).toHaveText('Thank you for your purchase!');

    // 6. Validate that no duplicate charges occur [cite: 18]
    const confirmationText = await cartPage.receiptDetails.innerText();
    expect(confirmationText).toContain(`Amount: ${capturedPrice} USD`);

    // 7. Verify cart is empty after successful checkout [cite: 19]
    await cartPage.okButton.click();
    await expect(cartPage.successMessage).toBeHidden();
    
    // Force navigate to home to clear flaky site states 
    await homePage.navigate();
    await homePage.cartLink.click();
    
    // Final check for empty cart [cite: 19]
    await expect(cartPage.cartItemRows).toHaveCount(0);
  });
});