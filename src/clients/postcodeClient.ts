import { APIRequestContext } from '@playwright/test';

export class PostcodeClient {
  constructor(private request: APIRequestContext) {}

  async getPostcode(country: string, postcode: string) {
    return await this.request.get(`/${country}/${postcode}`);
  }
}