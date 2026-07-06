```gherkin
Feature: Retrieve postcode information

  As a third-party developer
  I want to retrieve postcode information
  So that I can validate postcode details for supported countries

  Background:
     Given the postcode API base URL is "https://api.zippopotam.us"
    And the postcode API is available

  Scenario Outline: Retrieve postcode information for a valid postcode
    When I request postcode "<postcode>" for country "<country>"
    Then the response status should be 200
    And the country should be "<expectedCountry>"
    And the postcode should be "<postcode>"
    And at least one place should be returned

    Examples:
      | country | postcode  | expectedCountry |
      | us      | 90210     | United States   |
      | gb      | AB10      | Great Britain   |

  Scenario Outline: Invalid postcode returns 404
    When I request postcode "<postcode>" for country "<country>"
    Then the response status should be 404

    Examples:
      | country | postcode |
      | us      | INVALID  |
      | gb      | INVALID  |

  Scenario: Invalid endpoint returns 404
    When I request an endpoint that does not exist
    Then the response status should be 404

  Scenario: Response body should match the postcode API contract
    When I request postcode "90210" for country "us"
    Then the response status should be 200
    And the response should match the postcode schema
```
