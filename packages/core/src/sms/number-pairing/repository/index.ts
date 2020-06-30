import { right, left, isLeft, isRight } from "fp-ts/lib/Either";
import { RedisClient } from "redis";
import { INumberPairingRepository } from "../../../interfaces";
import { NameSpaceCaseString, Phone, Errors, UUID } from "../../../values";
import * as Model from "../model";

export const Name = "sms:repository:number-pairing" as NameSpaceCaseString.T;

const Key = (to: Phone.T, from: Phone.T) =>
  Name + ":pair:" + Phone.Codec.encode(to) + ":" + Phone.Codec.encode(from);

export const C = (redis: RedisClient): INumberPairingRepository => ({
  getByToAndFrom: async (to, from) =>
    new Promise(resolve =>
      redis.get(Key(to, from), (err, serialized) => {
        if (err) resolve(left(Errors.Adapter.C()));
        else if (serialized === null) resolve(left(Errors.NotFound.C()));
        else {
          const pairingMaybe = Model.Codec.decode(JSON.parse(serialized));
          if (isLeft(pairingMaybe)) resolve(left(Errors.Adapter.C()));
          else resolve(pairingMaybe);
        }
      })
    ),
  getByTo: async to =>
    new Promise(resolve =>
      redis.smembers(Name + ":to:" + Phone.Codec.encode(to), (err, set) => {
        if (err) resolve(left(Errors.Adapter.C()));
        else
          redis.mget(set, (err, set) => {
            if (err) resolve(left(Errors.Adapter.C()));
            else
              resolve(
                right(
                  set
                    .filter(e => e !== null)
                    .map(e => JSON.parse(e))
                    .map(Model.Codec.decode)
                    .filter(isRight) // TODO notify if there is a left
                    .map(e => e.right)
                )
              );
          });
      })
    ),
  save: async pairing =>
    new Promise(resolve =>
      redis
        .multi()
        .set(
          Key(pairing.to, pairing.from),
          JSON.stringify(Model.Codec.encode(pairing))
        )
        .sadd(
          Name + ":to:" + Phone.Codec.encode(pairing.to),
          Key(pairing.to, pairing.from)
        )
        .sadd(
          Name + ":conversation:" + UUID.Codec.encode(pairing.conversation),
          Key(pairing.to, pairing.from)
        )
        .exec(err => resolve(err ? left(Errors.Adapter.C()) : right(null)))
    ),
  // TODO delete the conversation as well, using WATCH
  deleteByConversaton: async conversation =>
    new Promise(resolve =>
      // Get all the pairing keys from the converation index
      redis.smembers(
        Name + ":conversation:" + UUID.Codec.encode(conversation),
        (err, set) => {
          if (err) resolve(left(Errors.Adapter.C()));
          else {
            // Create a map of all :to: indicies and their intersection the :conversation: index
            const toIndex: { [k: string]: string[] } = {};
            for (let i = 0; i < set.length; i++) {
              const key = set[i];
              const to = key.split(":")[4]; // sms:repository:number-pairing:pair:TO_PHONE(this one):FROM_PHONE
              if (to === undefined) {
                // This means we changed the format of the keys without updating the line of code above
                resolve(left(Errors.Adapter.C()));
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
              Name + ":conversation:" + UUID.Codec.encode(conversation),
              set
            );
            multi.exec(err => {
              if (err) resolve(left(Errors.Adapter.C()));
              else resolve(right(null));
            });
          }
        }
      )
    ),
});
