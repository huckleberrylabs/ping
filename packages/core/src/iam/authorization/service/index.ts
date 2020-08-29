import { isLeft, left } from "fp-ts/lib/Either";
import {
  IAuthorizationService,
  IAccessPolicyRepository,
} from "../../../interfaces";
import { Errors, NameSpaceCaseString } from "../../../values";

export const Name = "authorization:service" as NameSpaceCaseString.T;

export const C = (repo: IAccessPolicyRepository): IAuthorizationService => {
  return {
    check: async params => {
      const existsMaybe = await repo.exists(params);
      if (
        isLeft(existsMaybe) &&
        existsMaybe.left.type === Errors.NotFound.Name
      ) {
        return left(Errors.Unauthorized.C(Name, "policy not found"));
      }
      return existsMaybe;
    },
    grant: async params => repo.add(params),
    revoke: async params => repo.remove(params),
  };
};
