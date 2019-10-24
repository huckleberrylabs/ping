import * as iots from "io-ts";
import * as Event from "../../../event";
import * as Command from "../command";

export const Name = "ping:message:sent";

export const Codec = iots.intersection(
  [iots.type({ type: iots.literal(Name) }), Event.Codec],
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (command: Command.T): T => ({
  ...command,
  type: Name,
});

export const Is = Codec.is;
