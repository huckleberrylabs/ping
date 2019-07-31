import axios from "axios";
import { ID, Event } from "@huckleberry/core";
import {
  TextAppConfig,
  EVENTS_ENDPOINT,
  CONFIG_ENDPOINT,
} from "@huckleberry/text";

export class API {
  async getConfig(appID: ID): Promise<TextAppConfig> {
    const res = await axios.get(CONFIG_ENDPOINT + appID);
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      throw new Error(res.data);
    }
  }
  async postEvent(event: Event) {
    const res = await axios.post(EVENTS_ENDPOINT, event);
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      throw new Error(res.data);
    }
  }
}
