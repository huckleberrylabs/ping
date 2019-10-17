import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import { KebabCaseString, Event } from "@huckleberryai/core";
import { IWebAnalyticsRepository } from "@huckleberryai/web-analytics";
import { FireStore } from "../../driven-adapters";
import { add, get, getByProperty } from "../base";
import { Container } from "../../driving-ports";

export const WebAnalyticsRepository = (store: FireStore.T) => (
  collection: KebabCaseString.T
): IWebAnalyticsRepository => ({
  add: (event: Event.T) =>
    pipe(
      Container(event.type),
      map(map => add(store)(collection)(event.id, map.codec.encode(event)))
    ),
  get: get(store)(collection),
  getByCorrID: getByProperty(store)(collection)("corr"),
});
