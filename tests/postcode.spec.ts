import {test, expect, request}  from "@playwright/test";
import { ApiClient } from "../pages/apiClient";
import Ajv from 'ajv';
import { postcodeSchema } from "../schemas/postcodeSchema";

test.describe('Zippopotam API tests', () =>{
    let api:ApiClient;
    test.beforeEach(({request})=>{
        api = new ApiClient(request);
    });

// Happy Path

test('Retrieve valid US Postcode', async() =>{
    const response = await api.getPostcode('us', '90210');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.country).toBe('United States');
    expect(body['country abbreviation']).toBe('US');
    expect(body.places.length).toBeGreaterThan(0);
});
test('Retrieve valid GB Postcode', async() =>{
    const response = await api.getPostcode('gb', 'AB10');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.country).toBe('Great Britain');
    expect(body['country abbreviation']).toBe('GB');
    expect(body.places.length).toBeGreaterThan(0);  
    });

// Negative Test
test('Unsupported country returns 404', async() =>{
    const response = await api.getPostcode('fr', '99999');
    expect(response.status()).toBe(404);
});

test('Non existent postcode returns 404', async() =>{
    const response = await api.getPostcode('us', '00000');
    expect(response.status()).toBe(404);
});

//Non Functional Test
test('Response time is under 2s', async() =>{
    const start = Date.now();
    const response = await api.getPostcode('us', '90210');
    const duration = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(2000);
    });

    test('Response matches JSON schema', async() =>{
     const response = await api.getPostcode('us', '90210');
     expect(response.status()).toBe(200);
     const body = await response.json();
     const ajv = new Ajv();
     const validate = ajv.compile(postcodeSchema);
     expect(validate(body)).toBe(true);  
    });

});
