import { left, right, isRight, isLeft } from "fp-ts/lib/Either";
import { RedisClient } from "redis";
import { INumberRepository } from "../../../interfaces";
import { NameSpaceCaseString, Errors, Phone, Country } from "../../../values";

export const Name = "sms:repository:number" as NameSpaceCaseString.T;

export const C = (redis: RedisClient): INumberRepository => ({
  getByCountry: async country =>
    new Promise(resolve =>
      redis.smembers(
        Name + ":country:" + Country.Encode(country),
        (err, set) => {
          if (err) {
            resolve(
              left(
                Errors.Adapter.C(
                  Name,
                  `getByCountry: ${err.message}`,
                  "A database error occured, please try again later or contact support."
                )
              )
            );
          } else {
            const decode = set.map(Phone.Decode);
            if (decode.some(isLeft)) {
              resolve(
                left(
                  Errors.Adapter.C(
                    Name,
                    `getByCountry: ${country} has ${
                      decode.filter(isLeft).length
                    } decode errors`,
                    "A database error occured, please try again later or contact support."
                  )
                )
              );
            } else {
              resolve(
                right(
                  set
                    .map(Phone.Decode)
                    .filter(isRight)
                    .map(e => e.right)
                )
              );
            }
          }
        }
      )
    ),
  save: async phone =>
    new Promise(resolve =>
      redis.sadd(
        Name + ":country:" + Country.Encode(phone.country),
        Phone.Encode(phone.number),
        err =>
          resolve(
            err
              ? left(
                  Errors.Adapter.C(
                    Name,
                    `save: ${err.message}`,
                    `Server error, please try again later or contact support.`
                  )
                )
              : right(null)
          )
      )
    ),
});
