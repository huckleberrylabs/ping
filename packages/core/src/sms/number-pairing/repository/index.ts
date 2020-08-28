import { right, left, isLeft, isRight } from "fp-ts/lib/Either";
import { RedisClient } from "redis";
import { INumberPairingRepository } from "../../../interfaces";
import { NameSpaceCaseString, Phone, Errors, UUID } from "../../../values";
import * as Model from "../model";

export const Name = "sms:repository:number-pairing" as NameSpaceCaseString.T;

const Key = (to: Phone.T, twilio: Phone.T) =>
  Name + ":pair:" + Phone.Encode(to) + ":" + Phone.Encode(twilio);

export const C = (redis: RedisClient): INumberPairingRepository => ({
  getByPhones: async (to, twilio) =>
    new Promise(resolve =>
      redis.get(Key(to, twilio), (err, serialized) => {
        if (err)
          resolve(
            left(
              Errors.Adapter.C(
                Name,
                `getByPhones: ${err.message}`,
                "A database error occured, please try again later or contact support."
              )
            )
          );
        else if (serialized === null)
          resolve(
            left(
              Errors.NotFound.C(
                Name,
                `getByPhones: to ${to} twilio ${twilio}`,
                "Number pairing not found."
              )
            )
          );
        else {
          const pairingMaybe = Model.Decode(JSON.parse(serialized));
          if (isLeft(pairingMaybe)) {
            resolve(
              left(
                Errors.Adapter.C(
                  Name,
                  `get: to ${to} twilio ${twilio}`,
                  "A database error occured, please try again later or contact support."
                )
              )
            );
          } else {
            resolve(pairingMaybe);
          }
        }
      })
    ),
  getByTo: async to =>
    new Promise(resolve =>
      redis.smembers(Name + ":to:" + Phone.Encode(to), (err, set) => {
        if (err)
          resolve(
            left(
              Errors.Adapter.C(
                Name,
                `getByTo: ${err.message}`,
                "A database error occured, please try again later or contact support."
              )
            )
          );
        else if (set.length === 0) resolve(right([]));
        else
          redis.mget(set, (err, entries) => {
            if (err) {
              resolve(
                left(
                  Errors.Adapter.C(
                    Name,
                    `getByTo: ${err.message}`,
                    "A database error occured, please try again later or contact support."
                  )
                )
              );
            } else {
              const decode = entries.map(e => JSON.parse(e)).map(Model.Decode);
              if (decode.some(isLeft)) {
                resolve(
                  left(
                    Errors.Adapter.C(
                      Name,
                      `getByPhone: ${to} has ${
                        decode.filter(isLeft).length
                      } decode errors`,
                      "A database error occured, please try again later or contact support."
                    )
                  )
                );
              } else {
                resolve(right(decode.filter(isRight).map(e => e.right)));
              }
            }
          });
      })
    ),
  save: async pairing =>
    new Promise(resolve =>
      redis
        .multi()
        .set(
          Key(pairing.to, pairing.from),
          JSON.stringify(Model.Encode(pairing))
        )
        .sadd(
          Name + ":to:" + Phone.Encode(pairing.to),
          Key(pairing.to, pairing.from)
        )
        .sadd(
          Name + ":conversation:" + UUID.Encode(pairing.conversation),
          Key(pairing.to, pairing.from)
        )
        .exec(err =>
          resolve(
            err
              ? left(
                  Errors.Adapter.C(
                    Name,
                    `save: ${err.message}`,
                    "A database error occured, please try again later or contact support."
                  )
                )
              : right(null)
          )
        )
    ),
  // TODO delete the conversation index as well, using WATCH
  deleteByConversaton: async conversation =>
    new Promise(resolve =>
      // Get all the pairing keys from the converation index
      redis.smembers(
        Name + ":conversation:" + UUID.Encode(conversation),
        (err, set) => {
          if (err)
            resolve(
              left(
                Errors.Adapter.C(
                  Name,
                  `deleteByConversation: ${err.message}`,
                  "A database error occured, please try again later or contact support."
                )
              )
            );
          else {
            // Create a map of all :to: indicies and their intersection the :conversation: index
            const toIndex: { [k: string]: string[] } = {};
            for (let i = 0; i < set.length; i++) {
              const key = set[i];
              const to = key.split(":")[4]; // sms:repository:number-pairing:pair:TO_PHONE(this one):FROM_PHONE
              if (to === undefined) {
                resolve(
                  left(
                    Errors.Adapter.C(
                      Name,
                      "deleteByConversaton: possibly changed the format of the keys without updating the line of code above",
                      "A database error occured, please try again later or contact support."
                    )
                  )
                );
                return;
              }
              const toKey = Name + ":to:" + to;
              if (toIndex[toKey] === undefined) {
                toIndex[toKey] = [];
              }
              toIndex[toKey].push(key);
            }
            // Atomic transaction
            const multi = redis.multi();
            // Delete all pairings
            multi.del(set);
            // Remove all pairing keys from :to: indicies
            Object.keys(toIndex).forEach(toKey =>
              multi.srem(toKey, toIndex[toKey])
            );
            // Remove all pairing keys from :conversation: index
            multi.srem(
              Name + ":conversation:" + UUID.Encode(conversation),
              set
            );
            multi.exec(err => {
              if (err)
                resolve(
                  left(
                    Errors.Adapter.C(
                      Name,
                      `deleteByConversation: ${err.message}`,
                      "A database error occured, please try again later or contact support."
                    )
                  )
                );
              else resolve(right(null));
            });
          }
        }
      )
    ),
});
