import sendGrid from "@sendgrid/mail";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import { ResponseError } from "@sendgrid/helpers/classes";
import { left, right, Either } from "fp-ts/lib/Either";
import { Errors, ISendGrid } from "@huckleberrylabs/ping-core";

export const C = (): Either<Errors.Environment.T, ISendGrid> => {
  const key = process.env.SENDGRID_API_KEY;
  if (key) {
    try {
      sendGrid.setApiKey(key);
      return right(async (data: MailDataRequired) => {
        try {
          await sendGrid.send(data);
          return right(null);
        } catch (err) {
          const error = err as ResponseError;
          if (error.code === 429 || error.code >= 500) {
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              await sendGrid.send(data);
              return right(null);
            } catch (error) {
              return left(Errors.Adapter.C());
            }
          }
          return left(Errors.Adapter.C());
        }
      });
    } catch (error) {
      return left(Errors.Environment.C());
    }
  }
  return left(Errors.Environment.C());
};
