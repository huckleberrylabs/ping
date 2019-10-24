import { isLeft } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import { AccountRepository } from "../../../../interfaces";
import * as Query from "../query";

export const Handler = (repo: AccountRepository) => async (query: Query.T) => {
  // TODO IsAuthorized
  const accountMaybe = await repo.get(query.account);
  if (isLeft(accountMaybe)) {
    switch (accountMaybe.left.type) {
      case "core:error:not-found":
        return Results.NotFound.C(query);
      case "core:error:adapter":
      default:
        return Results.Error.C(query);
    }
  }
  const account = accountMaybe.right;
  return Results.OKWithData.C(query, account, account.type);
};
