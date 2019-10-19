import { pipe } from "fp-ts/lib/pipeable";
import {
  map,
  left,
  flatten,
  right,
  fromOption,
  Either,
} from "fp-ts/lib/Either";
import { UUID, Errors } from "@huckleberryai/core";
import WebAnalytics from "@huckleberryai/web-analytics";
import { Settings } from "@huckleberryai/widget";
import { GetElementById } from "./helpers";
import { ElementIDs, Elements } from "./elements";
import { InsertCSS, GenerateCSS } from "./css";
import { InsertHTML, GenerateHTML } from "./html";
import { AddEventListeners } from "./listeners";

export const GetWidgetID = (insertScriptID: string): Either<Error, UUID.T> =>
  pipe(
    fromOption(() => new Errors.Environment("element not found"))(
      GetElementById(insertScriptID)
    ),
    map(script => script.getAttribute("src")),
    map(urlOrNull =>
      urlOrNull
        ? right(urlOrNull)
        : left(new Errors.Environment("script src attribute missing"))
    ),
    flatten,
    map(urlString => {
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const id = url.searchParams.get("widget_id");
      return UUID.Is(id)
        ? right(id)
        : left(new Errors.Environment("widget id was not provided"));
    }),
    flatten
  );

export const InitializeWidget = (log: WebAnalytics.Interfaces.Logger) => (
  settings: Settings.T
) =>
  pipe(
    ElementIDs(),
    ids => {
      InsertCSS(GenerateCSS(ids)(settings));
      log("info", "css inserted", ["widget-client"]);
      InsertHTML(GenerateHTML(ids));
      log("info", "html inserted", ["widget-client"]);
      return Elements(ids);
    },
    map(elems => {
      AddEventListeners(elems);
      log("info", "listeners loaded", ["widget-client"]);
      log("info", "initialized", ["widget-client"]);
    })
  );
