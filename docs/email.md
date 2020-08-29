# Email

## TODO

- webhooks:
  - create
  - created
  - processed
  - dropped
  - delivered
  - deferred
  - bounced
  - reported-as-spam
  - unsubscribed
  - opened
  - replied

## lists

- https://github.com/FGRibreau/mailchecker
- https://knowledge.hubspot.com/articles/kcs_article/forms/what-domains-are-blocked-when-using-the-forms-email-domains-to-block-feature
- https://github.com/willwhite/freemail
- https://github.com/andreis/disposable

## verification

- Check against stored SendGrid Data.
- Domain exists?
- MX records exist?
- Send an email to the address that:
  - is vague
  - elicits a response
  - includes a tracking pixel
  - avoids being marked as spam
- Adds email to email:activity set cache

## Email Refactor

SendEmailCommand, EmailSentEvent, Handler

WebhookController, various Events + Handlers

Handlers => Repository and SendGridClient

EmailService
Email

- EmailAddress (value object)
- EmailClient, EmailTemplate, EmailOptions, Email, EmailAccount (interfaces)
- EmailService (service)
- LoginEmailTemplate (constant)
- getEmailIntro (function)
- NoReplyEmail, SupportEmail (constants)

- Send Emails
- Listen to Events via WebHook
- Subscription, Click, Open Tracking

- Deliverability, Reputation Management, Dedicated IP, Whitelabeling
- Guess email given name and a list of other emails from same domain
- Parse inbound
- Verify & Validate

Whats imported from Ping in Ping-client and Ping-admin?

- PrivateSDK
- PublicSDK (and Interface)
- Widget.T Type
- Config Constant
- PromoCode Value Object
- PingAccount.T and Is()

The SDKs depend on UseCase Commands / Queries as well as Types
