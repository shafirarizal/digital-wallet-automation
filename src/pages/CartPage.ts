import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly placeOrderButton: Locator;
  readonly nameInput: Locator;
  readonly cardInput: Locator;
  readonly purchaseButton: Locator;
  readonly successMessage: Locator;
  readonly receiptDetails: Locator;
  readonly okButton: Locator;
  readonly cartItemRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.nameInput = page.locator('#name');
    this.cardInput = page.locator('#card');
    this.purchaseButton = page.locator('button:has-text("Purchase")');
    this.successMessage = page.locator('.sweet-alert h2');
    this.receiptDetails = page.locator('.lead.text-muted');
    this.okButton = page.locator('button:has-text("OK")');
    this.cartItemRows = page.locator('#tbodyid tr');
  }

  async submitOrder(name: string, creditCard: string) {
    await this.placeOrderButton.click();
    await this.nameInput.fill(name);
    await this.cardInput.fill(creditCard);
    await this.purchaseButton.click();
  }
}