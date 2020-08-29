import Stripe from "stripe";
import { Either, left, right } from "fp-ts/lib/Either";
import { Errors } from "../../../values";

import * as Command from "./command";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.Adapter.T | Errors.Validation.T | Errors.NotFound.T, null>
>;

export default (client: Stripe): IHandler => async command => {
  try {
    // @ts-ignore
    const session = await client.billingPortal.sessions.create({
      customer: command.customer,
      return_url: "https://example.com/account",
    });
    return right(session);
  } catch (error) {
    return left(
      Errors.Adapter.C(
        Command.Name,
        `stripe returned ${error.type} with http status ${error.statusCode} and code ${error.code}: ${error.message}`,
        "Could not open billing portal at this time, please try again later."
      )
    );
  }
};
