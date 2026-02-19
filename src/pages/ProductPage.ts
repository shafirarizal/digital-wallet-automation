import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productPrice = page.locator('.price-container');
    this.addToCartButton = page.locator('text="Add to cart"');
  }

  async getDynamicPrice(): Promise<number> {
    const priceText = await this.productPrice.innerText();
    const numericString = priceText.replace(/[^0-9]/g, '');
    return parseInt(numericString, 10);
  }

  async addToCart() {
    this.page.once('dialog', dialog => dialog.accept());
    await this.addToCartButton.click();
  }
}