// @ts-ignore
import * as iots from "io-ts";
// @ts-ignore
import { Option } from "fp-ts/lib/Option";

import twilio from "twilio";
import { left, right, Either } from "fp-ts/lib/Either";
import { Errors } from "@huckleberryai/core";

export type T = twilio.Twilio;

export const C = (): Either<Errors.Adapter.T | Errors.Environment.T, T> => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  const messaging_service_sid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  if (sid && auth_token && messaging_service_sid) {
    try {
      return right(twilio(sid, auth_token));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  }
  return left(Errors.Environment.C());
};
