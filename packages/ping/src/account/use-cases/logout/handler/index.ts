import { Results } from "@huckleberryai/core";
import { AccountRepository } from "../../../../interfaces";
import * as Command from "../command";

export const Handler = (repo: AccountRepository) => async (
  command: Command.T
) => {
  return Results.OK.C(command);
  // TODO store logout event
};
