# Ping

## Strictly UI TODO

- account settings clean up style
- billing show current card
- billing view / download invoice

* routing
* registration
* create-widget

## Connect to Backend

- SendLoginEmail
- GetAccountIDByCookie
- Login
- Logout
- Update Account Login
- Update Billing Info
- View/Download Invoices
- Cancel Account
- View Widgets
- View Conversations
- View Contacts
- View Conversation Detail
- Registration
- Create a Widget

## Notes on Updating Billing

- Changing Org name changes name on stripe
- Changing Address changes address on stripe
- Changing Billing email changes email on stripe
- Changing Payment Method is done in tandem with other billing changes

## Other UI Implementation

- Show free trial status / invalid payment status
- Contact Support
- Use Places AutoComplete for Billing Address Updates
- Install instructions

## Widget Analytics

- visit vs open vs send this week / month / year
- Widget ID via url
-

## Next Release

- SMS proxy conversations
- New Identity and Access Management System

- View conversation/message history
- View contacts

- No CC required, updated registration flow
- Customize button animation, X/Y offset, button text controls
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

## client dependencies from core

- Config InsertScriptID / GetEndpoint / SecretDeveloperMessage
- UUID T / C / Is
- Errors T / Decode / C
- StatusCodes

- Color IsLight
- Phone C
- PersonName C
- TimeStamp C
- NonEmptyString Decode / Is

- Routes
- Command C / Encode

- Widget.Settings.Model T / Decode
- Widget.Values.Message T
- Log C, Logger C, ILogger

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

### UI

- Use Shadow DOM
- Fix Bruces issue
- Replace PhoneField with PhoneWithCountryField
- Ask for CountryCode in Client instead of getting it from Widget
- Admin color picker bottoms out
- Admin collapsable drawer and center app on mobile
- Admin center loading icons

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
