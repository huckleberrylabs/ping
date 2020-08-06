## Strictly UI TODO

- routing
- registration
- create-widget

## Connect to Backend

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
- Use Places AutoComplete for Billing Address Updates
- Install instructions

## Widget Analytics

- visit vs open vs send this week / month / year
- Widget ID via url

## Next Release

- SMS proxy conversations
- New Identity and Access Management System

- View conversation/message history
- View contacts

- No CC required, updated registration flow
- Customize button animation, X/Y offset, button text controls
- View button activity analytics
- General fix for the issue related to bruce's ping

## TODO

### Data Integrity

- Add Type property to all Data
- Script to keep Twilio numbers in sync with SMSNumberRepo
- Cron Job to remove expired jwt tokens from invalidtokenrepo
- Move to PostGreSQL

### Organization

- Include a message in Errors and log them consistently on creation
- Remove all Console Logs
- Include Message In Error
- Log Errors on Creation Everywhere
- Rename "Maybe" variables
- Create a mapping function for errors to http response
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
- Creating a Conversation View and Providing a URL to the Conversation

### SMS

- Handler error when a new number is bought, but it wasn't successfully persisted to Number Repo.
- A chron job in messaging to emit a Conversation Terminated Event.
- A Subscriber in SMS to listen to ConversationTerminatedEvent and deallocateNumberPairingsByConversation.
- Give Preference to Numbers with same area code
- Deallocate/Cycle Phone Numbers
- Status Callback
- SMS Account Model to track costs
- Add other Channels

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
- Update Packages
- Update GSuite Email Setup
- Update Google Business Listing with [Huckleberrylabs.ca](http://huckleberrylabs.ca) website
- Figure out how to do lerna publish and git push together
- Throttling
- Access Filtering
- Monitoring
- Event Correlation
