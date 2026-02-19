# Digital Wallet Automation Framework

This repository contains the automated test suite for the Digital Wallet Technical Assessment, encompassing both Web UI and API automation within a unified Playwright and TypeScript framework.

## Architecture Overview
* **Web UI Tests:** Implemented using a strict Page Object Model (POM) architecture to ensure maintainability, stable locators, and zero hardcoded waits.
* **API Tests:** Utilizes an organized API service layer with reusable request handling and strict TypeScript typing for schema validation.
* **Business Logic:** Incorporates a simulated Digital Wallet utility to validate complex balance deduction scenarios, including boundaries and negative logic.

## Prerequisites
* Node.js (v16 or higher)
* npm (Node Package Manager)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <your-github-repo-url>
   cd digital-wallet-automation