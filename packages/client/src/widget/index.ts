import { pipe } from "fp-ts/lib/pipeable";
import {
  map,
  left,
  flatten,
  right,
  fromOption,
  Either,
  chain,
} from "fp-ts/lib/Either";
import {
  UUID,
  Errors,
  Widget,
  Logger,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";
import * as SDK from "../sdk";
import { GetElementById } from "./helpers";
import { ElementIDs, Elements } from "./elements";
import { GenerateCSS } from "./css";
import { InsertHTML, GenerateHTML } from "./html";
import { AddEventListeners } from "./listeners";

export const Name = "widget" as NameSpaceCaseString.T;

export const GetID = (
  insertScriptID: string
): Either<Errors.Environment.T, UUID.T> =>
  pipe(
    fromOption(() => Errors.Environment.C(Name, "script html tag missing"))(
      GetElementById(insertScriptID)
    ),
    map(script => script.getAttribute("src")),
    chain(urlOrNull =>
      urlOrNull
        ? right(urlOrNull)
        : left(Errors.Environment.C(Name, "script src attribute missing"))
    ),
    map(urlString => {
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const id = url.searchParams.get("widget_id");
      return UUID.Is(id)
        ? right(id)
        : left(Errors.Environment.C(Name, "script widget id missing"));
    }),
    flatten
  );

export const C = (sdk: SDK.T) => (widgetSettings: Widget.Settings.Model.T) =>
  pipe(
    ElementIDs(),
    ids => {
      InsertHTML(
        GenerateHTML(ids)(widgetSettings)(GenerateCSS(ids)(widgetSettings))
      );
      Logger(Name, "info", "html inserted");
      Logger(Name, "info", "css inserted");
      return Elements(ids);
    },
    map(elems => {
      AddEventListeners(elems, widgetSettings, sdk);
      Logger(Name, "info", "listeners loaded");
      Logger(Name, "info", "initialized");
    })
  );
