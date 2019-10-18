// @ts-ignore
import * as iots from "io-ts";
import twilio from "twilio";
import { left, right } from "fp-ts/lib/Either";
import { Phone, Errors } from "@huckleberryai/core";

export const C = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  const phone_number = process.env.TWILIO_PHONE_NUMBER;
  if (sid && auth_token && Phone.Is(phone_number))
    return right(twilio(sid, auth_token));
  return left(Errors.Environment.C());
};
