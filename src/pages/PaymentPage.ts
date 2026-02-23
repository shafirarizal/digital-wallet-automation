import { Page, Locator, expect } from '@playwright/test';

export class PaymentPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly countryInput: Locator;
    readonly cityInput: Locator;
    readonly cardInput: Locator;
    readonly monthInput: Locator;
    readonly yearInput: Locator;
    readonly purchaseButton: Locator;
    readonly successModal: Locator;
    readonly successMessage: Locator;
    readonly okButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Locators for the Place Order Modal
        this.nameInput = page.locator('#name');
        this.countryInput = page.locator('#country');
        this.cityInput = page.locator('#city');
        this.cardInput = page.locator('#card');
        this.monthInput = page.locator('#month');
        this.yearInput = page.locator('#year');
        
        // Action Buttons
        this.purchaseButton = page.locator('button[onclick="purchaseOrder()"]');
        
        // Confirmation Modal Locators
        this.successModal = page.locator('.sweet-alert');
        this.successMessage = this.successModal.locator('h2');
        this.okButton = page.locator('.confirm');
    }

    /**
     * Fills in the payment and shipping details in the checkout modal.
     */
    async fillPaymentDetails(name: string, card: string, month: string, year: string, country: string = 'USA', city: string = 'New York') {
        // We wait for the modal to be visible first
        await this.nameInput.waitFor({ state: 'visible' });
        
        await this.nameInput.fill(name);
        await this.countryInput.fill(country);
        await this.cityInput.fill(city);
        await this.cardInput.fill(card);
        await this.monthInput.fill(month);
        await this.yearInput.fill(year);
    }

    /**
     * Clicks the purchase button to submit the order.
     */
    async submitOrder() {
        await this.purchaseButton.click();
    }

    /**
     * Validates that the order confirmation message appears successfully.
     */
    async verifyOrderConfirmation() {
        await expect(this.successModal).toBeVisible();
        await expect(this.successMessage).toHaveText('Thank you for your purchase!');
    }

    /**
     * Closes the success modal to complete the transaction flow.
     */
    async closeSuccessModal() {
        await this.okButton.click();
    }
}