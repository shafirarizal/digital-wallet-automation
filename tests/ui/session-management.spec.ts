import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { generateRandomUser } from '../../src/utils/dataGenerator';

test.describe('Session Management & Security', () => {

    test('User Logout Flow and UI State Validation', async ({ page }) => {
        const homePage = new HomePage(page);
        const userData = generateRandomUser();

        await homePage.navigate();

        // 1. Register the dynamic user
        await homePage.openSignupModal();
        await page.locator('#sign-username').fill(userData.username);
        await page.locator('#sign-password').fill(userData.password);
        const signupDialogPromise = page.waitForEvent('dialog');
        await page.locator('button:has-text("Sign up")').click();
        const signupDialog = await signupDialogPromise;
        await signupDialog.accept();

        // 2. Login
        await homePage.openLoginModal();
        await page.locator('#loginusername').fill(userData.username);
        await page.locator('#loginpassword').fill(userData.password);
        
        await Promise.all([
            page.waitForResponse(response => response.url().includes('login') && response.status() === 200),
            page.locator('button:has-text("Log in")').click()
        ]);

        // 3. Verify Logged-In State
        await expect(homePage.userGreeting).toHaveText(`Welcome ${userData.username}`);
        await expect(page.locator('#signin2')).toBeHidden(); // "Sign up" should disappear
        await expect(page.locator('#login2')).toBeHidden();  // "Log in" should disappear

        // 4. Execute Logout
        await page.locator('#logout2').click();

        // 5. Verify Logged-Out State
        await expect(homePage.userGreeting).toBeHidden();
        await expect(page.locator('#signin2')).toBeVisible(); // "Sign up" should return
        await expect(page.locator('#login2')).toBeVisible();  // "Log in" should return
    });
});