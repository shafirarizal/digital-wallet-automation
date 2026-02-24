import { test, expect } from '@playwright/test';

test.describe('Cart Management & CRUD Operations', () => {

    test.beforeEach(async ({ page }) => {
        // Start fresh on the homepage
        await page.goto('https://www.demoblaze.com/');
    });

    test('Delete Item from Cart and Validate Empty State', async ({ page }) => {
        // 1. Select the first item on the homepage and add it to the cart
        const productLink = page.locator('.card-title a').first();
        const expectedProductName = await productLink.innerText();
        await productLink.click();

        page.once('dialog', dialog => dialog.accept());
        
        // Wait for add-to-cart API to finish
        await Promise.all([
            page.waitForResponse(response => response.url().includes('addtocart') && response.status() === 200),
            page.locator('.btn-success').click()
        ]);

        // 2. Navigate to the cart and verify the item is there
        await page.goto('https://www.demoblaze.com/cart.html');
        const productRow = page.locator('tbody tr').first();
        await productRow.waitFor({ state: 'visible' });
        await expect(page.locator(`td:has-text("${expectedProductName}")`)).toBeVisible();

        // 3. Click 'Delete' and synchronize with the backend API
        await Promise.all([
            page.waitForResponse(response => response.url().includes('deleteitem') && response.status() === 200),
            page.locator('a:has-text("Delete")').first().click()
        ]);

        // 4. Assert the cart is completely empty
        // The Demoblaze frontend is a bit slow to remove the HTML node, so we wait for the row to detach
        await productRow.waitFor({ state: 'detached' });
        await expect(page.locator('tbody tr')).toHaveCount(0);
    });
});