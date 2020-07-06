## TODO

- Handler error when a new number is bought, but it wasn't successfully persisted to Number Repo.
- A chron job in messaging to emit a Conversation Terminated Event.
- A Subscriber in SMS to listen to ConversationTerminatedEvent and deallocateNumberPairingsByConversation.
- Give Preference to Numbers with same area code
- Deallocate/Cycle Phone Numbers
- Status Callback
- SMS Account Model to track costs
- Add other Channels

## Twilio Docs

https://www.twilio.com/docs/usage
https://www.twilio.com/docs/iam
https://www.twilio.com/docs/phone-numbers
https://www.twilio.com/docs/sms
https://www.twilio.com/docs/chat
