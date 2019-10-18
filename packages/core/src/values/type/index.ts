import * as iots from "io-ts";
import * as NameSpaceCaseString from "../namespace-case-string";

export const Name = "core:value:type";

export const Codec = iots.string;

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T => NameSpaceCaseString.Is(input);
