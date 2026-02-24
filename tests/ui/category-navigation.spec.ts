import { test, expect } from '@playwright/test';

test.describe('Category Navigation & Product Filtering', () => {

    test.beforeEach(async ({ page }) => {
        // Start fresh on the homepage
        await page.goto('https://www.demoblaze.com/');
    });

    test('Filter Laptops Category and Validate Products Update', async ({ page }) => {
        // 1. Click on the Laptops category and wait for the backend to send the filtered data
        await Promise.all([
            page.waitForResponse(response => response.url().includes('bycat') && response.status() === 200),
            page.locator('a#itemc:has-text("Laptops")').click()
        ]);

        // 2. Assert that a known laptop appears (e.g., Sony vaio i5)
        const laptopItem = page.locator('.card-title a:has-text("Sony vaio i5")');
        await laptopItem.waitFor({ state: 'visible' });
        await expect(laptopItem).toBeVisible();

        // 3. Assert that a phone does NOT appear anymore (e.g., Samsung galaxy s6)
        const phoneItem = page.locator('.card-title a:has-text("Samsung galaxy s6")');
        await expect(phoneItem).toBeHidden();
    });
});