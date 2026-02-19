import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signupLink: Locator;
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly userGreeting: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLink = page.locator('#signin2');
    this.loginLink = page.locator('#login2');
    this.cartLink = page.locator('#cartur');
    this.userGreeting = page.locator('#nameofuser');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async openSignupModal() {
    await this.signupLink.click();
  }

  async openLoginModal() {
    await this.loginLink.click();
  }

  async selectProduct(productName: string) {
    const productLocator = this.page.locator('.hrefch', { hasText: productName });
    await productLocator.click();
  }
}