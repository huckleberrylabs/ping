import { IDispatch } from "@huckleberryai/core";
import { Event } from "./event";

export const Handler = (dispatch: IDispatch) => (event: Event) =>
  dispatch(event);
