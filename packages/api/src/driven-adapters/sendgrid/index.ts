// @ts-ignore
import * as iots from "io-ts";
// @ts-ignore
import { Option } from "fp-ts/lib/Option";

import sendGrid from "@sendgrid/mail";
import { MailData } from "@sendgrid/helpers/classes/mail";
import { ResponseError } from "@sendgrid/helpers/classes";
import { left, right, Either } from "fp-ts/lib/Either";
import { Errors } from "@huckleberrylabs/core";

export type T = (data: MailData) => Promise<Either<Errors.Adapter.T, null>>;

export const C = (): Either<Errors.Environment.T, T> => {
  const key = process.env.SENDGRID_API_KEY;
  if (key) {
    try {
      sendGrid.setApiKey(key);
      return right(async (data: MailData) => {
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
