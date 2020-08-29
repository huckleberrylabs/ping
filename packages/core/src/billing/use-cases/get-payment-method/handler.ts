import Stripe from "stripe";
import { Either, right, left } from "fp-ts/lib/Either";
import { Errors } from "../../../values";
import * as Query from "./query";
import { PaymentMethod } from "../../values";

export type IHandler = (
  query: Query.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, PaymentMethod.T>>;

export default (client: Stripe): IHandler => async query => {
  try {
    const customer = await client.customers.retrieve(query.customer, {
      expand: ["invoice_settings.default_payment_method"],
    });
    if (customer.invoice_settings?.default_payment_method) {
      const paymentMethod = PaymentMethod.C(
        // @ts-ignore
        customer.invoice_settings?.default_payment_method.card.brand,
        // @ts-ignore
        customer.invoice_settings?.default_payment_method.card.last4
      );
      return right(paymentMethod);
    } else {
      return left(
        Errors.NotFound.C(
          Query.Name,
          "customer.invoice_settings.default_payment_method returned empty",
          "No Payment Method Exists."
        )
      );
    }
  } catch (error) {
    return left(
      Errors.Adapter.C(
        Query.Name,
        `stripe returned ${error.type} with http status ${error.statusCode} and code ${error.code}: ${error.message}`,
        "Payment method info could not be retrieved."
      )
    );
  }
};
