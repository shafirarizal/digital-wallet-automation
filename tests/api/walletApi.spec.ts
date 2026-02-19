import { test, expect } from '@playwright/test';
import { ApiService } from '../../src/api/ApiService';
import { DigitalWallet } from '../../src/utils/wallet';
import { DummyUserResponse, DummyProductResponse } from '../../src/types/apiTypes';

test.describe('Digital Wallet - API & Business Logic Validation', () => {

  test('Create a new user and validate response structure and time', async ({ request }) => {
    const apiService = new ApiService(request);
    
    const newUserPayload = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    };

    const { response, duration } = await apiService.createUser(newUserPayload);
    
    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(2000); 

    const responseBody = (await response.json()) as DummyUserResponse;
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.firstName).toBe(newUserPayload.firstName);
    expect(responseBody.lastName).toBe(newUserPayload.lastName);
    expect(typeof responseBody.age).toBe('number');
  });

  test('Simulate wallet balance and successful fund deduction', () => {
    const wallet = new DigitalWallet(1000); 
    expect(wallet.getBalance()).toBe(1000);

    const newBalance = wallet.deductFunds(250);
    
    expect(newBalance).toBe(750);
    expect(wallet.getBalance()).toBe(750);
  });

  test('Validate negative scenario where deduction exceeds balance', () => {
    const wallet = new DigitalWallet(100); 

    expect(() => {
      wallet.deductFunds(500);
    }).toThrowError('Insufficient funds: Deduction exceeds current balance');
    
    expect(wallet.getBalance()).toBe(100);
  });

  test('Retrieve product list and validate schema, required fields, and response time', async ({ request }) => {
    const apiService = new ApiService(request);
    
    const { response, duration } = await apiService.getProducts();

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);

    const responseBody = (await response.json()) as DummyProductResponse;

    expect(responseBody).toHaveProperty('products');
    expect(Array.isArray(responseBody.products)).toBeTruthy();
    expect(responseBody.products.length).toBeGreaterThan(0);

    const firstProduct = responseBody.products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(typeof firstProduct.id).toBe('number');
    expect(firstProduct).toHaveProperty('title');
    expect(typeof firstProduct.title).toBe('string');
    expect(firstProduct).toHaveProperty('price');
    expect(typeof firstProduct.price).toBe('number');
  });

  test('Simulate wallet boundary scenario - Deduct exact balance', () => {
    const wallet = new DigitalWallet(500); 
    const newBalance = wallet.deductFunds(500);
    
    expect(newBalance).toBe(0);
    expect(wallet.getBalance()).toBe(0);
  });

  test('Retrieve product list with pagination query parameters', async ({ request }) => {
    const apiService = new ApiService(request);
    const limit = 5;
    
    const { response, duration } = await apiService.getProductsWithLimit(limit);

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);

    const responseBody = await response.json();
    
    expect(responseBody.products.length).toBe(limit);
    expect(responseBody.limit).toBe(limit);
  });

});