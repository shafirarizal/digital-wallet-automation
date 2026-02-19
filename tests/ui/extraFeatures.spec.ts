import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Digital Wallet - Additional UI Coverage', () => {

  test('Negative Authentication - Invalid Login Credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.openLoginModal();
    
    await page.locator('#loginusername').fill('fake_user_999999');
    await page.locator('#loginpassword').fill('wrongpassword');
    
    const alertPromise = page.waitForEvent('dialog');
    await page.locator('button:has-text("Log in")').click();
    
    const dialog = await alertPromise;
    expect(dialog.message()).toContain('User does not exist.'); 
    await dialog.accept(); 
  });

  test('Category Navigation - Filter Laptops', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    
    await page.locator('a.list-group-item:has-text("Laptops")').click();
    
    const macbook = page.locator('.hrefch', { hasText: 'MacBook air' });
    await expect(macbook).toBeVisible();
  });

});