# Ping

## Done

## TODO

- Import Core Lib
- Complete GetAccountID Use-Case
- Implement SendLoginEmail API Call
- Implement Auth API Calls
- Cleanup SendLoginEmail View
- Test SendLoginEmail, LoginWithToken, Logout
- Test Routing, Redirects, Authentication, Toasts

## Admin Use Cases

### Account

- Registration
- Cancellation
- Contact Support

### IAM

- Log In
- Log Out
- Update Identity

### Billing

- View Invoices
- Download an Invoice
- Update Payment Method

### Widget

- View All Widgets
- Create a Widget
- Install a Widget
- Destroy a Widget
- Update a Widget's Settings
- View Widget Analytics

## Messaging

- View all Conversations
- View Conversation (with Messages)
- Update Router/Channel Settings
- View Contacts
- Update Contacts

## Next Release

- SMS proxy conversations
- New Identity and Access Management System

- No CC required, updated registration flow
- Customize button animation, X/Y offset, button text controls
- View conversation/message history
- View contacts
- View button activity analytics

- General fix for the issue related to bruce's ping

## Tested Working Endpoints

- /v1/auth/account/register
- /v1/auth/send-login-email
- /v1/auth/login-with-token
- /v1/auth/account/get-by-id
- /v1/auth/account/update
- /v1/auth/logout
- /v1/widget/create
- /v1/widget/update
- /v1/widget/get-by-id
- /v1/widget/analytics/add-event
- /v1/widget/receive
- /v1/messaging/contact/create
- /v1/messaging/contact/update
- /v1/messaging/contact/get-by-id
- /v1/messaging/router/create
- /v1/messaging/router/update
- /v1/messaging/router/get-by-id
- /v1/sms/receive

## TODO

### Data Integrity

- Add Type property to all Data
- Script to keep Twilio numbers in sync with SMSNumberRepo
- Cron Job to remove expired jwt tokens from invalidtokenrepo
- Move to PostGreSQL

### Organization

- Include a message in Errors and log them consistently on creation
- Remove all Console Logs
- Rename "Maybe" variables

- Create a mapping function for errors to http response, and from http response to errors
- Repositories shouldn't be accessed outside of Bounded Context
- Refactor Widget (move usecases from settings to top)
- Rename Names
-

### Domain

- Invariant not enforced anywhere: Account can only have one SMS channel.
- Channel Type should be a value object of its own
- Create SMS Channel on Setup
- SMS Channel Settings Repo?
- What happens if you are messaging yourself? (2 in 1 conversation)
- Mark Contacts as Internal
- Avoiding Number Pairing reuse
- Billing Clean up service
- Email Clean up Service
- Add Phone Creation within PhoneWithCountry Creation (to ensure phone was created with the same country)
- Add All Countries to Country (and in Front End, use a common Object)
- Close Account
- Update Payment

### UI

- Restructure entire Admin app
- Use Shadow DOM
- Fix Bruces issue
- Replace PhoneField with PhoneWithCountryField
- Ask for CountryCode in Client instead of getting it from Widget
- Admin color picker bottoms out
- Admin collapsable drawer and center app on mobile
- Admin center loading icons
- View Invoices

### Other

- Look At Data (attention and interaction quantity/quality)
- Check when SendGrid runs out and add in calendar for downgrade.
- Login Email Case Sensitivity
- [Ping.buzz](http://ping.buzz) Certificate
- Update Packages
- Update GSuite Email Setup
- Update Google Business Listing with [Huckleberrylabs.ca](http://huckleberrylabs.ca) website
- Figure out how to do lerna publish and git push together
- Throttling
- Access Filtering
- Monitoring
- Event Correlation

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
