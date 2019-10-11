import { some, none } from "fp-ts/lib/Option";

export const get = <A>(prop: A) => (prop ? some(prop) : none);
