import {test, expect}  from "@playwright/test";
import { PostcodeClient } from "../clients/postcodeClient";
import { testData } from "../test-data/postcodes";
import { postcodeSchema } from "../schemas/postcode.schema";
import { validateSchema } from "../utils/ajvValidator";


test.describe('Zippopotam.us Postcode API', () =>{
    let client:PostcodeClient;
    test.beforeEach(({request})=>{
        client = new PostcodeClient(request);
    });

// Happy Path

test('Validate US postcode returns correct data', async() =>{
    const response = await client.getPostcode('us', testData.us.validPostcode)
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.country).toBe(testData.us.country);
    expect(body['post code']).toBe(testData.us.validPostcode);
    expect(body['country abbreviation']).toBe(testData.us.countryAbbreviation);
    
});
test('Validate GB postcode returns correct data', async() =>{
    const response = await client.getPostcode('gb', testData.gb.validPostcode)
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.country).toBe(testData.gb.country);
    expect(body['post code']).toBe(testData.gb.validPostcode);
    expect(body['country abbreviation']).toBe(testData.gb.countryAbbreviation);
    });

// Negative Tests

test('System rejects unsupported country', async() =>{
    const response = await client.getPostcode('fr', '99999');
    expect(response.status()).toBe(404);
});

test('System rejects invalid postcode formats', async() =>{
    const response = await client.getPostcode('us', 'INVALID');
    expect(response.status()).toBe(404);
});

test('System handles invalid postcode input', async() =>{
    const response = await client.getPostcode('us', '00000');
    expect(response.status()).toBe(404);
});


//Non Functional Test
test('Response time is under 2 seconds', async() =>{
    const start = Date.now();
    const response = await client.getPostcode("us", "90210");
    const duration = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);
    });

    test('Response matches JSON schema', async() =>{
     const response = await client.getPostcode('us', '90210');
     expect(response.status()).toBe(200);
     const body = await response.json();
     expect(validateSchema(postcodeSchema, body)).toBe(true);
    });

});
