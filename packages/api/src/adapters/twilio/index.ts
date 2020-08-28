import twilio from "twilio";
import { left, right, Either } from "fp-ts/lib/Either";
import {
  Errors,
  ITwilio,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";

export const Name = "adapters:twilio" as NameSpaceCaseString.T;
export const C = (): Either<
  Errors.Adapter.T | Errors.Environment.T,
  ITwilio
> => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  if (!sid)
    return left(Errors.Environment.C(Name, `TWILIO_ACCOUNT_SID is missing`));
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  if (!auth_token)
    return left(Errors.Environment.C(Name, `TWILIO_AUTH_TOKEN is missing`));
  try {
    // @ts-ignore
    const client: twilio.Twilio & {
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
    } = twilio(sid, auth_token);
    client.TWILIO_ACCOUNT_SID = sid;
    client.TWILIO_AUTH_TOKEN = sid;
    return right(client);
  } catch (error) {
    return left(Errors.Environment.C(Name, `Constructor: ${error.message}`));
  }
};
