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
import { UUID, Errors, Widget, ILogger } from "@huckleberrylabs/ping-core";
import * as SDK from "../sdk";
import { GetElementById } from "./helpers";
import { ElementIDs, Elements } from "./elements";
import { InsertCSS, GenerateCSS } from "./css";
import { InsertHTML, GenerateHTML } from "./html";
import { AddEventListeners } from "./listeners";

export const GetID = (
  insertScriptID: string
): Either<Errors.Environment.T, UUID.T> =>
  pipe(
    fromOption(() => Errors.Environment.C())(GetElementById(insertScriptID)),
    map(script => script.getAttribute("src")),
    chain(urlOrNull =>
      urlOrNull ? right(urlOrNull) : left(Errors.Environment.C())
    ),
    map(urlString => {
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const id = url.searchParams.get("widget_id");
      return UUID.Is(id) ? right(id) : left(Errors.Environment.C());
    }),
    flatten
  );

export const C = (log: ILogger, sdk: SDK.T) => (
  widgetSettings: Widget.Settings.Model.T
) =>
  pipe(
    ElementIDs(),
    ids => {
      InsertCSS(GenerateCSS(ids)(widgetSettings));
      log("info", "css inserted", ["widget-client"]);
      InsertHTML(GenerateHTML(ids)(widgetSettings));
      log("info", "html inserted", ["widget-client"]);
      return Elements(ids);
    },
    map(elems => {
      AddEventListeners(elems, widgetSettings, sdk);
      log("info", "listeners loaded", ["widget-client"]);
      log("info", "initialized", ["widget-client"]);
    })
  );
