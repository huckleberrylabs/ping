import * as iots from "io-ts";
import { LogEventCodec } from "../event";

export const LogCodec = iots.array(LogEventCodec);

export type Log = iots.TypeOf<typeof LogCodec>;

export const Log = (): Log => [];
