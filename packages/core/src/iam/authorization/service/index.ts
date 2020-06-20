import { right, isLeft, left } from "fp-ts/lib/Either";
import {
  IAuthorizationService,
  IAccessPolicyRepository,
} from "../../../interfaces";
import { Errors } from "../../../values";
import * as Model from "../model";

export const C = (repo: IAccessPolicyRepository): IAuthorizationService => {
  return {
    check: async (account, entity, action) => {
      if (account === entity) return right(null);
      const hash = Model.Hash(account, entity, action);
      const existsMaybe = await repo.exists(hash);
      if (
        isLeft(existsMaybe) &&
        existsMaybe.left.type === Errors.NotFound.Name
      ) {
        return left(Errors.Unauthorized.C());
      }
      return existsMaybe;
    },
    grant: async (account, entity, action) => {
      return repo.add(Model.C(account, entity, action));
    },
    revoke: async (account, entity, action) => {
      return repo.remove(Model.Hash(account, entity, action));
    },
  };
};
