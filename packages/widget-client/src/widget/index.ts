import { pipe } from "fp-ts/lib/pipeable";
import {
  map,
  left,
  flatten,
  right,
  fromOption,
  Either,
} from "fp-ts/lib/Either";
import { UUID, IsUUID } from "@huckleberryai/core";
import { Logger } from "@huckleberryai/log";
import { WidgetSettings } from "@huckleberryai/widget";
import { GetElementById } from "./helpers";
import { ElementIDs, Elements } from "./elements";
import { InsertCSS, GenerateCSS } from "./css";
import { InsertHTML, GenerateHTML } from "./html";
import { AddEventListeners } from "./listeners";

export const GetWidgetID = (insertScriptID: string): Either<Error, UUID> =>
  pipe(
    fromOption(() => new Error("element not found"))(
      GetElementById(insertScriptID)
    ),
    map(script => script.getAttribute("src")),
    map(urlOrNull =>
      urlOrNull
        ? right(urlOrNull)
        : left(new Error("script src attribute missing"))
    ),
    flatten,
    map(urlString => {
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const id = url.searchParams.get("widget_id");
      return IsUUID(id)
        ? right(id)
        : left(new Error("widget id was not provided"));
    }),
    flatten
  );

export const InitializeWidget = (log: Logger) => (
  settings: WidgetSettings,
  corr: UUID,
  parent: UUID
) =>
  pipe(
    ElementIDs(),
    ids => {
      InsertCSS(GenerateCSS(ids)(settings));
      log("info", "css inserted", ["widget-client"], corr, parent);
      InsertHTML(GenerateHTML(ids));
      log("info", "html inserted", ["widget-client"], corr, parent);
      return Elements(ids);
    },
    map(elems => {
      AddEventListeners(elems);
      log("info", "listeners loaded", ["widget-client"], corr, parent);
      log("info", "initialized", ["widget-client"], corr, parent);
    })
  );
