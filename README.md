# Ping

## TODO

3. Finish new Account + Registration models
   1. Contact
   2. Router
   3. Widget + Channel
   4. Auth
   5. Billing
   6. Account
4. Clean up Billing / Email Service

- [Ping.buzz](http://ping.buzz) Certificate
- Update Packages
- Update GSuite Email Setup
- Update Google Business Listing with [Huckleberrylabs.ca](http://huckleberrylabs.ca) website
- Figure out how to do lerna publish and git push together

- Add All Countries to Country (and in Front End, use a common Object)
- Create a PhoneWithCountry Value
- Replace PhoneField with PhoneWithCountryField
- Ask for CountryCode in Client instead of getting it from Widget
- Remove Phone and Country from Widget Models and Place it in a new Entity:

- AUTH: Make Entity and Type Optional for IAuthorizationService (and remove short circuit from Widget:Create)
- AUTH: Create Roles as Groups of Policies (Widget:Create)
- AUTH: Complete Deactivate for Account
- Rename Names

## FUTURE

- Switch to KeyDB
- rename SMS Number and NumberPairing Models

- Throttling
- Access Filtering
- Monitoring
- C/Q and Event Correlation
- Admin: color picker bottoms out
- Admin: collapsable drawer and center app on mobile
- Admin: center loading icons

## Stack

- Language: Typescript + NodeJS
- Front-end Framework: React
- Testing Framework: Jest
- Integrated Continuous Test Runner: WallabyJS
- Serverless Continuous Deployment: Netlify
- Monorepo Package Management: Lerna

## Development Environment

### Setup

- NodeJS + NPM
- Git
- Visual Studio Code
- The following Plugins for Visual Studio

  - GitLens
  - Wallaby.js
  - Quokka.js
  - Prettier
  - TSLint
  - ESLint
  - StyleLint
  - GraphQL for VSCode

If you would like a GUI for Git, I recommend GitKraken.

## Run Project

- Option 1: `npm start` at project root. Variables are loaded from .env file
- Option 2: `now dev` at project root. Variables are loaded from .env file
- Option 3: `npm start` inside a specific package. Variables are loaded from .env file
