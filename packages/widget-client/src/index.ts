import { UUID, API_ENDPOINT, EVENTS_ENDPOINT } from "@huckleberryai/core";
import { log } from "@huckleberryai/log";
import { postEvent } from "./api";
import { LoadWidget } from "./load";
import { INSERT_SCRIPT_ID } from "./load/elements";
import { GetWidgetID } from "./load/data";

window.addEventListener(
  "load",
  LoadWidget(log, postEvent)(API_ENDPOINT + EVENTS_ENDPOINT)(
    GetWidgetID(INSERT_SCRIPT_ID),
    "02553494-2ee2-43fb-b7e5-826ea0281883",
    UUID()
  ),
  false
);
