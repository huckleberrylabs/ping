// @ts-ignore
import * as iots from "io-ts";
import { IDispatch } from "@huckleberryai/core";
import * as Command from "./command";
import * as Event from "./event";

export const Handler = (dispatch: IDispatch) => (command: Command.T) => {
  const event = Event.C(command);
  dispatch(event);
};
