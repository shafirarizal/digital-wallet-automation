# Digital Wallet & Payment Gateway Automation Framework

[cite_start]This repository contains the advanced automated test suite encompassing both Web UI and API automation within a unified Playwright and TypeScript framework[cite: 6, 7, 8, 37, 38, 39]. It is designed to validate End-to-End (E2E) E-commerce workflows, Digital Wallet balances, Payment Gateway logic, and API Fraud Detection.

## Architecture Overview
* [cite_start]**Web UI Tests:** Implemented using a strict Page Object Model (POM) architecture to ensure maintainability, stable locators, and zero hardcoded waits[cite: 52, 53, 56, 134].
* [cite_start]**Data-Driven Testing (DDT):** Externalized JSON test data to loop through multiple valid and invalid payment scenarios efficiently[cite: 19, 135].
* [cite_start]**API Tests:** Utilizes an organized API service layer with reusable request handling and strict TypeScript typing for schema validation[cite: 64, 67, 68].
* [cite_start]**Business Logic:** Incorporates simulated Digital Wallet utilities and Payment Gateway boundary validations (card number, expiry, amount thresholds)[cite: 18, 61, 84].

## Key Features Validated
### Web UI (Demoblaze)
* [cite_start]**Dynamic E2E Purchasing:** Automates user registration, login, dynamic price extraction, and cart validation[cite: 13, 14, 15].
* [cite_start]**Payment Gateway Validation:** Validates credit card limits, missing fields, and amount threshold boundaries[cite: 18].
* [cite_start]**Transaction Integrity:** Verifies order confirmations and ensures no duplicate transactions occur[cite: 17, 49].

### API (DummyJSON)
* [cite_start]**Order Creation & Schema Validation:** Validates nested JSON structures and standard HTTP status codes[cite: 22, 23].
* [cite_start]**Performance SLAs:** Enforces strict response time assertions (e.g., `< 2000ms`) on critical endpoints[cite: 23, 65].
* [cite_start]**Fraud Detection Simulation:** Custom framework-level logic to intercept and flag transactions exceeding monetary thresholds or containing suspicious keywords[cite: 24].

##  Prerequisites
* Node.js (v16 or higher)
* npm (Node Package Manager)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd digital-wallet-automation

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd digital-wallet-automation

# Install dependencies and Playwright browsers:
   npm install
   npx playwright install

# Execution Instructions
   Tests can be executed directly from the command line using custom NPM scripts.

# Run the entire suite (UI + API):
   npm run test
   Run targeted test suites:

npm run test:ui          # Runs all Web UI tests
npm run test:api         # Runs all API and Fraud tests
npm run test:ui:payment  # Runs only the Payment Gateway scenarios

# Reporting & Execution Results
The framework automatically generates an HTML report and captures screenshots on failure.

# To view the HTML report after a test run:
npm run report


# Execution Proof
 ![Terminal_Execution](image-2.png)


# HTML Test Report:
![TestReport_1](image.png)
![TestReport_2](image-1.png)