# Postcode API Automation Suite

## Overview

Automation suite for testing Zippopotam.us API using Playwright Test.

## Tech Stack

- Playwright Test
- TypeScript
- AJV (schema validation)

```sh

```

## Test Coverage

- Valid US postcode retrieval
- Valid GB postcode retrieval
- Invalid postcode handling
- Invalid endpoint handling
- JSON schema validation (contract testing)
- Basic response time validation

## Design Approach

- Client abstraction layer for API calls
- Separation of test data, schema, and test logic
- Combination of functional + contract testing

## Framework Choice

Playwright Test was selected because it provides a lightweight test runner with excellent support for REST API testing through its built-in APIRequestContext. This removes the need for additional HTTP libraries while providing assertions, reporting and parallel execution.

## How to Run

npm install
npm test

## Key Assumptions

- API is public and unauthenticated
- Only US and GB are required per backlog
- API returns stable JSON structure

## Notes

The backlog specifies support for US and Great Britain only. During exploratory testing I verified the public API behaviour and aligned the automated tests with the live responses returned by the service. Any differences between the documented requirements and the live API would be raised with the Product Owner for clarification.