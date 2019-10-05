import { UUID, IsUUID, IsError } from "@huckleberryai/core";
import { ILogger } from "@huckleberryai/log";
import { WebAnalyticsClientLoadedEvent } from "@huckleberryai/web-analytics";
import { WidgetGetSettingsQueryType } from "@huckleberryai/widget";
import { IPostEvent } from "../api";
import {
  WidgetClientElementIDs,
  GetWidgetClientElementsFromIDs,
} from "./elements";
import { insertCSS, generateCSS } from "./css";
import { insertHTML, generateHTML } from "./html";
import { addEventListeners, onUnloadEvent } from "./listeners";
import { GetWidgetSettings } from "./data";

export const LoadWidget = (log: ILogger, post: IPostEvent) => (
  eventsEndpoint: string
) => (
  widget: UUID | Error,
  origin: UUID,
  corr: UUID,
  agent?: UUID | undefined
) => async () => {
  const clientLoadedEvent = WebAnalyticsClientLoadedEvent(
    IsUUID(widget) ? widget : null,
    origin,
    corr,
    undefined,
    agent
  );
  const parent = clientLoadedEvent.id;
  log(
    `loaded successfully`,
    ["info", "widget-client", clientLoadedEvent.type],
    origin,
    corr,
    parent
  );
  const loadedResult = await post(clientLoadedEvent); // TODO return Error
  if (IsError(loadedResult)) {
    log(
      `api offline:::${eventsEndpoint}:::${loadedResult.status}:::${loadedResult.data}`, // TODO provide context
      ["error", "widget-client", clientLoadedEvent.type],
      origin,
      corr,
      parent
    );
    return;
  }
  log(
    `api online`,
    ["info", "widget-client", clientLoadedEvent.type],
    origin,
    corr,
    parent
  );
  window.addEventListener(
    "unload",
    onUnloadEvent(IsUUID(widget) ? widget : null, corr, parent, agent)
  );
  if (!IsUUID(widget)) {
    log(
      `widget_id not retrieved:::${widget.message}`,
      ["error", "widget-client"],
      origin,
      corr,
      parent
    );
    return;
  }
  log(`widget_id retrieved`, ["info", "widget-client"], origin, corr, parent);
  const settings = await GetWidgetSettings(post)(widget, corr, parent, agent)(); // TODO return Error
  if (!settings) {
    log(
      "settings not retrieved", // TODO provide context
      ["error", "widget-client", WidgetGetSettingsQueryType],
      origin,
      corr,
      parent
    );
    return;
  }
  log("settings retrieved", ["info", "widget-client"], origin, corr, parent);
  if (!settings.enabled) {
    log("widget disabled", ["info", "widget-client"], origin, corr, parent);
    return;
  }
  const elementIDs = WidgetClientElementIDs();
  insertCSS(generateCSS(elementIDs)(settings));
  log("css inserted", ["info", "widget-client"], origin, corr, parent);
  insertHTML(generateHTML(elementIDs));
  log("html inserted", ["info", "widget-client"], origin, corr, parent);
  const elements = GetWidgetClientElementsFromIDs(elementIDs);
  log("elements loaded", ["info", "widget-client"], origin, corr, parent);
  addEventListeners(post)(elements);
  log("listeners loaded", ["info", "widget-client"], origin, corr, parent);
  log("initialized", ["info", "widget-client"], origin, corr, parent);
};
