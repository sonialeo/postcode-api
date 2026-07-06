import { test, expect } from '@playwright/test';
import { PostcodeClient } from '../clients/postcodeClient';
import { testData } from '../test-data/postcodes';
import { postcodeSchema } from '../schemas/postcode.schema';
import { validateSchema } from '../utils/ajvValidator';

test.describe('Zippopotam.us Postcode API', () => {
  let client: PostcodeClient;

  test.beforeEach(async ({ request }) => {
    client = new PostcodeClient(request);
  });

  // -----------------------------
  // POSITIVE TESTS (US + GB)
  // -----------------------------

  const countries = [
    {
      country: 'us',
      postcode: testData.us.validPostcode,
      expectedCountry: testData.us.country
    },
    {
      country: 'gb',
      postcode: testData.gb.validPostcode,
      expectedCountry: testData.gb.country
    }
  ];

  for (const data of countries) {
    test(`Validate ${data.country.toUpperCase()} postcode returns correct data`, async () => {
      const response = await client.getPostcode(data.country, data.postcode);

      expect(response.status()).toBe(200);

      const body = await response.json();

      // Core business validations
      expect(body.country).toBe(data.expectedCountry);
      expect(body['post code']).toBe(data.postcode);
      expect(body.places).toBeDefined();
      expect(body.places.length).toBeGreaterThan(0);

      // Validate first place structure
      const place = body.places[0];
      expect(place['place name']).toBeTruthy();
      expect(place.state).toBeTruthy();
      expect(place.latitude).toBeTruthy();
      expect(place.longitude).toBeTruthy();
    });
  }

  // -----------------------------
  // NEGATIVE TESTS
  // -----------------------------

  test('Returns 404 for invalid US postcode', async () => {
    const response = await client.getPostcode('us', 'INVALID');

    expect(response.status()).toBe(404);
  });

  test('Returns 404 for invalid GB postcode', async () => {
    const response = await client.getPostcode('gb', 'INVALID');

    expect(response.status()).toBe(404);
  });

  test('Returns 404 for invalid endpoint', async ({ request }) => {
    const response = await request.get('https://api.zippopotam.us/invalid-endpoint');

    expect(response.status()).toBe(404);
  });

  // -----------------------------
  // CONTRACT TEST (SCHEMA VALIDATION)
  // -----------------------------

  test('Response matches postcode schema (US)', async () => {
    const response = await client.getPostcode('us', '90210');

    expect(response.status()).toBe(200);

    const body = await response.json();

    const isValid = validateSchema(postcodeSchema, body);

    expect(isValid).toBe(true);
  });

  test('Response matches postcode schema (GB)', async () => {
    const response = await client.getPostcode('gb', testData.gb.validPostcode);

    expect(response.status()).toBe(200);

    const body = await response.json();

    const isValid = validateSchema(postcodeSchema, body);

    expect(isValid).toBe(true);
  });

  // -----------------------------
  // PERFORMANCE SMOKE TEST
  // -----------------------------

  test('Response time should be under 2 seconds (US postcode)', async () => {
    const start = Date.now();

    const response = await client.getPostcode('us', '90210');

    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);
  });
});