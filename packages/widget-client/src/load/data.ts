import { UUID, IsUUID } from "@huckleberryai/core";
import {
  IWidgetSettings,
  IsWidgetSettings,
  WidgetGetSettingsQuery,
} from "@huckleberryai/widget";
import { getElementById } from "./helpers";
import { IPostEvent } from "../api";

export const GetWidgetSettings = (post: IPostEvent) => (
  widget: UUID,
  corr: UUID,
  parent: UUID,
  agent: UUID | undefined
) => async () => {
  const ORIGIN_ID = "";
  const settingsResult = await post<IWidgetSettings>(
    WidgetGetSettingsQuery(widget, ORIGIN_ID, corr, parent, agent)
  );
  if (!IsWidgetSettings(settingsResult.data)) return null;
  return settingsResult.data;
};

export const GetWidgetID = (insertScriptID: string): UUID | Error => {
  try {
    const script = getElementById(insertScriptID);
    const urlString = script.getAttribute("src");
    if (!urlString) return new Error("script src attribute missing");
    const a = document.createElement("a");
    a.href = urlString;
    const url = new URL(a.href);
    const id = url.searchParams.get("widget_id");
    if (!IsUUID(id)) return new Error("widget id was not provided");
    return id;
  } catch (error) {
    return new Error(error);
  }
};
