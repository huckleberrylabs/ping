import { IDispatch } from "@huckleberryai/core";
import * as Event from "./event";

export const Handler = (dispatch: IDispatch) => async (event: Event.T) => {
  await Promise.all(event.log.map(event => dispatch(event)));
  dispatch(Event.Normalize(event));
};
