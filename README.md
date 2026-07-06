# Postcode API Automation Suite

## Overview
Automation suite for testing Zippopotam.us API using Playwright Test.

## Tech Stack
- Playwright Test
- TypeScript
- AJV (schema validation)

## Test Coverage
- Valid US and GB postcode retrieval
- Invalid postcode handling
- Unsupported country handling
- JSON schema validation (contract testing)

## Design Approach
- Client abstraction layer for API calls
- Separation of test data, schema, and test logic
- Combination of functional + contract testing

## How to Run
npm install
npm test

## Key Assumptions
- API is public and unauthenticated
- Only US and GB are required per backlog
- API returns stable JSON structure

## Notes
API supports more countries than specified in backlog, which may indicate a requirement mismatch.