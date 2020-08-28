import Stripe from "stripe";
import { Either, left, right } from "fp-ts/lib/Either";
import { NonEmptyString, Errors, NameSpaceCaseString, Env } from "../../values";
import { IBillingService } from "../../interfaces";
import { PromoCode } from "../values";

/* const StripeError = (error: errors.StripeError) => {
  
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
}; */

export const Name = "billing:service" as NameSpaceCaseString.T;

export const C = (client: Stripe): IBillingService => ({
  createAccount: async (
    params
  ): Promise<Either<Errors.Adapter.T, NonEmptyString.T>> => {
    try {
      const ProductionPlan = "plan_GqR7YANPMgUe0h" as NonEmptyString.T;
      const DevPlan = "plan_GqR9gjrsaG4vNV" as NonEmptyString.T;
      const plan = Env.Get() === "production" ? ProductionPlan : DevPlan;
      const customer = await client.customers.create(
        {
          email: params.email,
          payment_method: params.paymentMethod,
          invoice_settings: {
            default_payment_method: params.paymentMethod,
          },
          coupon: params.promoCode
            ? PromoCode.ToCoupon[params.promoCode].couponID
            : undefined,
        },
        { idempotency_key: `idem:customer:${params.idemKey}` }
      );
      await client.subscriptions.create(
        {
          prorate: true,
          trial_from_plan: false,
          trial_period_days: 30,
          customer: customer.id,
          items: [
            {
              plan: plan,
              quantity: 1,
            },
          ],
        },
        { idempotency_key: `idem:add-seat:${params.idemKey}` }
      );
      return right(customer.id as NonEmptyString.T);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `stripe returned ${error.type} with http status ${error.statusCode} and code ${error.code}: ${error.message}`,
          "Billing account could not be created, please try again later or contact support."
        )
      );
    }
  },
  closeAccount: async ({ idemKey, customer }) => {
    try {
      await client.customers.del(customer, {
        idempotency_key: `idem:customer:${idemKey}`,
      });
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `stripe returned ${error.type} with http status ${error.statusCode} and code ${error.code}: ${error.message}`,
          "Could not cancel account due to billing issue, please contact support."
        )
      );
    }
  },
});
