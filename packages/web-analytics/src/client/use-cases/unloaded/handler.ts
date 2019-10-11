import { IDispatch } from "@huckleberryai/core";
import { Event, NormalizeEvent } from "./event";

export const Handler = (dispatch: IDispatch) => async (event: Event) => {
  await Promise.all(event.log.map(event => dispatch(event)));
  dispatch(NormalizeEvent(event));
};
