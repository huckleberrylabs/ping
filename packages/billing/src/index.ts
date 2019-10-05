import "reflect-metadata";
export * from "./ioc";

/*  
Sections to Study:
Payments
Billing
Webhooks

Phase 1:
- Use Stripe Checkout

Phase 2:
- Build custom signup flow with "react-stripe-elements"
*/

import Stripe from "stripe";

export const secretApiKey: string =
  "sk_test_JgcFuDH8grNsHvZy3TbR0564001PPBzryV";
export const publicApiKey: string =
  "pk_test_yoFeO5x15PPlisJIQdFgoWbG005bjq8KtN";

const stripe = new Stripe(secretApiKey);

/* CREATE SUBSCRIPTION */

// Step 1: Server Side
stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  subscription_data: {
    items: [
      {
        plan: "plan_123",
      },
    ],
    trial_period_days: 14,
  },
  success_url:
    "https://text.huckleberry.com/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://text.huckleberry.com/cancel",
});
/* 
Step 2: Client Side
stripe.redirectToCheckout({
  client_reference_id: USERID
  sessionId: "" // from server
}).then(function (result) {
  // fails due to a browser or network error, display error message to your customer using `result.error.message`.
}); 
*/

/* 
Step 3: Retrieve Session Server Side

Option 1: webhook checkout.session.completed
Option 2: success_url
*/

/* UPDATE SUBSCRIPTION */

// Step 1: Server Side
stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "setup",
  setup_intent_data: {
    metadata: {
      customer_id: "cus_FOsk5sbh3ZQpAU",
      subscription_id: "sub_8epEF0PuRhmltU",
    },
  },
  customer: "cus_123",
  success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://example.com/cancel",
});

// Step 2 Client side same as above

// Step 3 Retrieve Session same as above, Get Setup_Intent, attach paymentMethod to customer, customer, payment_intent, and subscription info avail

/* 

Default Payment Method 
    Set it as the Customer’s invoice_settings.default_payment_method
    Set it as the Subscription’s default_payment_method
*/

/* 

Product – Texting Widget

Plan – Variations on Product

nickname
amount (cents/pence)
currency (3-letter iso)
interval (unit)
interval_count number of unit
product (id)
usage_type licensed
billing_scheme per_unit

Customer – "Account"

Subscription – Customer is Subscribed to a Plan


*/
