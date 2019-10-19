import * as iots from "io-ts";
import * as GetByID from "./get-by-id";

export type Names = typeof GetByID.Query.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [GetByID.Query.Name, GetByID.Query.Codec],
]);

export { GetByID };
