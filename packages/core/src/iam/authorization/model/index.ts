import * as iots from "io-ts";
import crypto from "crypto";
import { UUID, NameSpaceCaseString, TimeStamp } from "../../../values";

export const Name = "auth:model:access-policy" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    hash: iots.string,
    timestamp: TimeStamp.Codec,
    account: UUID.Codec,
    entity: UUID.Codec,
    action: NameSpaceCaseString.Codec, // Command or Query
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  account: UUID.T,
  entity: UUID.T,
  action: NameSpaceCaseString.T
): T => ({
  timestamp: TimeStamp.C(),
  hash: Hash(account, entity, action),
  account,
  entity,
  action,
  type: Name,
});

export const Hash = (
  account: UUID.T,
  entity: UUID.T,
  action: NameSpaceCaseString.T
) => {
  const hash = crypto.createHash("sha256");
  hash.update(account.toString() + entity.toString() + action.toString());
  return hash.digest().toString("hex");
};

export const Is = Codec.is;
