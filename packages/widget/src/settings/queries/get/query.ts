import * as iots from "io-ts";
import { Either } from "fp-ts/lib/Either";
import { Type, UUID } from "@huckleberryai/core";
import { WidgetEventCodec, WidgetEvent } from "../../../base/event";

export interface WidgetGetSettingsQuery extends WidgetEvent {}

export const QueryType = "widget:settings:get-by-id-query" as Type;

export const QueryCodec = WidgetEventCodec;

export type Query = iots.TypeOf<typeof QueryCodec>;

export const Query: (
  widget: UUID,
  corr?: UUID,
  parent?: UUID
) => Either<Error, Query> = WidgetEvent(QueryType);
