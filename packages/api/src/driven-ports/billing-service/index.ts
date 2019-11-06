// @ts-ignore
import * as iots from "io-ts";
// @ts-ignore
import { Option } from "fp-ts/lib/Option";

import Stripe, { errors } from "stripe";
import { Either, left, right } from "fp-ts/lib/Either";
import {
  PersonName,
  NonEmptyString,
  Errors,
  SMSClient,
  EmailClient,
  UUID,
} from "@huckleberryai/core";
import { Interfaces } from "@huckleberryai/ping";
import { AlertPhone } from "../../config";

const StripeError = (error: errors.StripeError) => {
  /*
* = not available in stripe package / typings
*   - none - validation_error
    - none - api_connection_error - StripeConnectionError
    - 400 - invalid_request_error - StripeInvalidRequestError
    - 401 – authentication_error – StripeAuthenticationError
*   - 402 - xxx - xxx (Request Failed)
    - 403 – ??? – StripePermissionError
*   - 404 - none - none (Not Found)
    - 409 - idempotency_error - StripeIdempotencyError
    - 429 – rate_limit_error – StripeRateLimitError
    - ??? - card_error - StripeCardError
*   - ??? - invalid_grant - StripeInvalidGrantError (doesnt exist in typings) (bad code, token, apikey mode)
    - 5xx - api_error - StripeAPIError
    - none - none - StripeSignatureVerificationError
  */
  if (error instanceof errors.StripeConnectionError) return error;
  if (error instanceof errors.StripeInvalidRequestError) return error;
  if (error instanceof errors.StripeAuthenticationError) return error;
  if (error instanceof errors.StripePermissionError) return error;
  if (error instanceof errors.StripeIdempotencyError) return error;
  if (error instanceof errors.StripeRateLimitError) return error;
  if (error instanceof errors.StripeCardError) return error;
  if (error instanceof errors.StripeAPIError) return error;
  if (error instanceof errors.StripeSignatureVerificationError) return error;
  return error;
};

export const C = (
  client: Stripe,
  sms: SMSClient,
  email: EmailClient
): Interfaces.BillingService => ({
  createAccount: async (
    params
  ): Promise<Either<Errors.Adapter.T, NonEmptyString.T>> => {
    try {
      const customer = await client.customers.create(
        {
          email: params.email,
          description: params.accountName,
          name: PersonName.FirstLast(params.userName),
          payment_method: params.paymentMethod,
          invoice_settings: {
            default_payment_method: params.paymentMethod,
          },
        },
        { idempotency_key: `idem:customer:${params.idemKey}` }
      );
      return right(customer.id as NonEmptyString.T);
    } catch (err) {
      const error = StripeError(err);
      console.log(
        `${error.type} with http status ${error.statusCode}
        and code ${error.code}:
        ${error.message} `
      );
      sms(
        `Stripe Account Creation Failed: ${error.type} with http status ${
          error.statusCode
        }
        and code ${error.code}: ${error.message}. The customers details: ${
          params.email
        }, ${PersonName.FirstLast(params.userName)}` as NonEmptyString.T,
        AlertPhone
      );
      return left(Errors.Adapter.C());
    }
  },
  addSeat: async (
    idemKey: UUID.T,
    stripeCustomer: NonEmptyString.T,
    plan: NonEmptyString.T
  ): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      const customer = await client.customers.retrieve(stripeCustomer);
      const item = customer.subscriptions.data.map(subscription =>
        subscription.items.data.filter(item => item.plan.id === plan)
      )[0][0];
      if (item) {
        await client.subscriptionItems.update(
          item.id,
          {
            quantity: item.quantity ? item.quantity + 1 : 1,
          },
          { idempotency_key: `idem:add-seat:${idemKey}` }
        );
      } else {
        await client.subscriptions.create(
          {
            prorate: true,
            trial_from_plan: true,
            customer: stripeCustomer,
            items: [
              {
                plan: plan,
                quantity: 1,
              },
            ],
          },
          { idempotency_key: `idem:add-seat:${idemKey}` }
        );
      }
      return right(null);
    } catch (error) {
      console.log(error);
      return left(Errors.Adapter.C());
    }
  },
  removeSeat: async (
    idemKey: UUID.T,
    stripeCustomer: NonEmptyString.T,
    plan: NonEmptyString.T
  ): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      const customer = await client.customers.retrieve(stripeCustomer);
      const item = customer.subscriptions.data.map(subscription =>
        subscription.items.data.filter(item => item.plan.id === plan)
      )[0][0];
      if (item) {
        if (item.quantity && item.quantity > 1) {
          await client.subscriptionItems.update(
            item.id,
            {
              quantity: item.quantity - 1,
            },
            { idempotency_key: `idem:add-seat:${idemKey}` }
          );
        } else {
          await client.subscriptionItems.del(item.id, {
            idempotency_key: `idem:add-seat:${idemKey}`,
          });
        }
      }
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
});
