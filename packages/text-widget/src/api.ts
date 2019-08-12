import axios from "axios";
import { IEvent, IResult, Result, Query, ID } from "@huckleberryai/core";
import {
  EVENTS_ENDPOINT,
  TextWidgetSettings,
  TextWidgetSettingsQuery,
} from "@huckleberryai/text";

const IS_DEVELOPMENT = true;

export async function postEvent(event: IEvent): Promise<IResult | void> {
  if (IS_DEVELOPMENT) {
    if (event instanceof Query) {
      return new Result(
        new TextWidgetSettings("+16472951647"),
        new ID(),
        new ID(),
        new ID(),
        TextWidgetSettingsQuery.type
      );
    } else {
      return;
    }
  } else {
    const res = await axios.post(
      EVENTS_ENDPOINT,
      JSON.parse(JSON.stringify(event))
    );
    if (res.status >= 200 && res.status < 300) {
      if (res.data) {
        return Result.fromJSON(res.data);
      }
    } else {
      throw new Error(res.data);
    }
  }
}
