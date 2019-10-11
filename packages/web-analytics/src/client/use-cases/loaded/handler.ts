import { IDispatch } from "@huckleberryai/core";
import * as Event from "./event";

export const Handler = (dispatch: IDispatch) => (event: Event.T) =>
  dispatch(event);
