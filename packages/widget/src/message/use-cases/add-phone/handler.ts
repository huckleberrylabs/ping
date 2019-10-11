import { IDispatch } from "@huckleberryai/core";
import { Command } from "./command";
import { Event } from "./event";

export const Handler = (dispatch: IDispatch) => (command: Command) => {
  const event = Event(command);
  dispatch(event);
};
