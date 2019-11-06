import { isLeft } from "fp-ts/lib/Either";
import { Results, Errors } from "@huckleberryai/core";
import { AccountRepository } from "../../../../interfaces";
import * as Query from "../query";

export const Handler = (repo: AccountRepository) => async (query: Query.T) => {
  console.log("Getting Account With ID: ", query.account);
  // TODO IsAuthorized
  const accountMaybe = await repo.get(query.account);
  if (isLeft(accountMaybe)) {
    console.log("couldn't get account: ", accountMaybe.left.type);
    switch (accountMaybe.left.type) {
      case Errors.NotFound.Name:
        return Results.NotFound.C(query);
      default:
        return Results.Error.C(query);
    }
  }
  const account = accountMaybe.right;
  console.log("got account: ", account);
  return Results.OKWithData.C(query, account, account.type);
};
