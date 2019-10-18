import { pipe } from "fp-ts/lib/pipeable";
import { left, right, map } from "fp-ts/lib/Either";
import twilio from "twilio";
import { Phone, NonEmptyString, Errors } from "@huckleberryai/core";

export const TwilioClient = () =>
  pipe(
    {
      sid: process.env.TWILIO_ACCOUNT_SID,
      auth_token: process.env.TWILIO_AUTH_TOKEN,
      phone_number: process.env.TWILIO_PHONE_NUMBER,
    },
    env =>
      env.sid && env.auth_token && Phone.Is(env.phone_number)
        ? right(env)
        : left(new Errors.Environment("twillio")),
    map(env =>
      pipe(
        twilio(env.sid, env.auth_token),
        client => async (body: NonEmptyString.T, to: Phone.T) =>
          await client.messages.create({
            body,
            to,
            from: env.phone_number,
          })
      )
    )
  );
