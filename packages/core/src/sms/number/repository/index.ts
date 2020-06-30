import { left, right, isRight } from "fp-ts/lib/Either";
import { RedisClient } from "redis";
import { INumberRepository } from "../../../interfaces";
import { NameSpaceCaseString, Errors, Phone, Country } from "../../../values";

export const Name = "sms:repository:number" as NameSpaceCaseString.T;

export const C = (redis: RedisClient): INumberRepository => ({
  getByCountry: async country =>
    new Promise(resolve =>
      redis.smembers(
        Name + ":country:" + Country.Codec.encode(country),
        (err, set) => {
          if (err) resolve(left(Errors.Adapter.C()));
          else
            resolve(
              right(
                set
                  .map(Phone.Codec.decode)
                  .filter(isRight) // TODO notify if there is a left
                  .map(e => e.right)
              )
            );
        }
      )
    ),
  save: async number =>
    new Promise(resolve =>
      redis.sadd(
        Name + ":country:" + Country.Codec.encode(number.country),
        Phone.Codec.encode(number.phone),
        err => resolve(err ? left(Errors.Adapter.C()) : right(null))
      )
    ),
});
