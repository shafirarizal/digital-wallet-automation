import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiService {
  private request: APIRequestContext;
  private baseUrl: string = process.env.API_BASE_URL || 'https://dummyjson.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createUser(userData: object): Promise<{ response: APIResponse; duration: number }> {
    const startTime = Date.now();
    const response = await this.request.post(`${this.baseUrl}/users/add`, {
      data: userData,
    });
    const duration = Date.now() - startTime;
    return { response, duration };
  }

  async getProducts(): Promise<{ response: APIResponse; duration: number }> {
    const startTime = Date.now();
    const response = await this.request.get(`${this.baseUrl}/products`);
    const duration = Date.now() - startTime;
    return { response, duration };
  }

  async getProductsWithLimit(limit: number): Promise<{ response: APIResponse; duration: number }> {
    const startTime = Date.now();
    const response = await this.request.get(`${this.baseUrl}/products?limit=${limit}`);
    const duration = Date.now() - startTime;
    return { response, duration };
  }
}