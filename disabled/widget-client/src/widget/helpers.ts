import { fromNullable } from "fp-ts/lib/Option";

export const GetElementById = (id: string) =>
  fromNullable(document.getElementById(id));
