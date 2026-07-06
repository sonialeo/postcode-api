import { test, expect } from '@playwright/test';
import { PostcodeClient } from '../src/clients/postcodeClient';
import { testData } from '../src/test-data/postcodes';
import { postcodeSchema } from '../src/schemas/postcode.schema';
import { validateSchema } from '../src/utils/ajvValidator';

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
      expectedCountry: testData.us.country,
      expectedCountryAbbreviation: testData.us.countryAbbreviation
    },
    {
      country: 'gb',
      postcode: testData.gb.validPostcode,
      expectedCountry: testData.gb.country,
      expectedCountryAbbreviation: testData.gb.countryAbbreviation
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
      expect(body['country abbreviation']).toBe(data.expectedCountryAbbreviation);
      
      expect(Array.isArray(body.places)).toBe(true);
      expect(body.places.length).toBeGreaterThan(0);

      // First place validation
     const place = body.places[0];

     expect(typeof place['place name']).toBe('string');
     expect(place['place name'].trim().length).toBeGreaterThan(0);

     expect(typeof place.state).toBe('string');
     expect(place.state.trim().length).toBeGreaterThan(0);

     expect(typeof place.latitude).toBe('string');
     expect(!isNaN(Number(place.latitude))).toBe(true);

     expect(typeof place.longitude).toBe('string');
     expect(!isNaN(Number(place.longitude))).toBe(true);
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
    const response = await client.getPostcode('us', testData.us.validPostcode);
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
    const response = await client.getPostcode('us', testData.us.validPostcode);
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);
  });
});