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
import { UUID, Errors } from "@huckleberrylabs/core";
import { Widget, Interfaces } from "@huckleberrylabs/ping";
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

export const C = (
  log: Interfaces.Logger,
  sdk: Interfaces.PublicSDK,
  sdk2: SDK.T
) => (widget: Widget.T) =>
  pipe(
    ElementIDs(),
    ids => {
      InsertCSS(GenerateCSS(ids)(widget));
      log("info", "css inserted", ["widget-client"]);
      InsertHTML(GenerateHTML(ids)(widget));
      log("info", "html inserted", ["widget-client"]);
      return Elements(ids);
    },
    map(elems => {
      AddEventListeners(elems, sdk, sdk2);
      log("info", "listeners loaded", ["widget-client"]);
      log("info", "initialized", ["widget-client"]);
    })
  );
