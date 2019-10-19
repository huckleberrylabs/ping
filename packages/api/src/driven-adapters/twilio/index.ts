// @ts-ignore
import * as iots from "io-ts";
// @ts-ignore
import { Option } from "fp-ts/lib/Option";
import twilio from "twilio";
import { left, right, Either } from "fp-ts/lib/Either";
import { Phone, Errors } from "@huckleberryai/core";

export type T = twilio.Twilio;

export const C = (): Either<Errors.Adapter.T | Errors.Environment.T, T> => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  const phone_number = process.env.TWILIO_PHONE_NUMBER;
  if (sid && auth_token && Phone.Is(phone_number)) {
    try {
      return right(twilio(sid, auth_token));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  }
  return left(Errors.Environment.C());
};
