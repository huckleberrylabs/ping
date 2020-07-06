# Ping

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

- Add Type property to all Object Data
- Script to keep Twilio numbers in sync with SMSNumberRepo
- Repositories shouldn't be accessed outside of Bounded Context
- Invariant not enforced anywhere: Account can only have one SMS channel.
- Channel Type should be a value object of its own
- Create SMS Channel on Setup
- SMS Channel Settings Repo?
- What happens if you are messaging yourself? (2 in 1 conversation)
- Mark Contacts as Internal

* Add Account AccessPolicy Grants on Creation
* Refactor Widget (move usecases from settings to top)
* Admin: SDK
* Admin: Account Create
* Admin: Account Update
* Admin: App
* Admin: Widget Create add Account ID
* Admin: Remove Phone from Widget Update
* Billing: Clean up service
* Email: Clean up Service
* Move completely off Firebase
* [Ping.buzz](http://ping.buzz) Certificate
* Update Packages
* Update GSuite Email Setup
* Update Google Business Listing with [Huckleberrylabs.ca](http://huckleberrylabs.ca) website
* Figure out how to do lerna publish and git push together
* Add Phone Creation within PhoneWithCountry Creation (to ensure phone was created with the same country)
* Add All Countries to Country (and in Front End, use a common Object)
* Replace PhoneField with PhoneWithCountryField
* Ask for CountryCode in Client instead of getting it from Widget
* Switch to KeyDB
* Cron Job to remove expired jwt tokens from invalidtokenrepo
* Rename Names
* Rename SMS Number and NumberPairing Models
* Throttling
* Access Filtering
* Monitoring
* C/Q and Event Correlation
* Admin: color picker bottoms out
* Admin: collapsable drawer and center app on mobile
* Admin: center loading icons

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
