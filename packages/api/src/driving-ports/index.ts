import { fromNullable } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, IHandler, Errors } from "@huckleberryai/core";
import WebAnalytics from "@huckleberryai/web-analytics";
import Widget from "@huckleberryai/widget";

const map = new Map<Type.T, { codec: iots.Any; handler: IHandler }>([
  [
    WebAnalytics.Client.UseCases.Loaded.Event.Name,
    {
      codec: WebAnalytics.Client.UseCases.Loaded.Event.Codec,
      handler: WebAnalytics.Client.UseCases.Loaded.Handler(),
    },
  ],
  [
    WebAnalytics.Client.UseCases.Unloaded.Event.Name,
    {
      codec: WebAnalytics.Client.UseCases.Unloaded.Event.Codec,
      handler: WebAnalytics.Client.UseCases.Unloaded.Handler(),
    },
  ],
  [
    WebAnalytics.Server.UseCases.HTTPAccess.Event.Name,
    {
      codec: WebAnalytics.Client.UseCases.Unloaded.Command.Codec,
      handler: WebAnalytics.Client.UseCases.Unloaded.Handler(),
    },
  ],
  [
    Widget.Message.UseCases.AddName.Command.Name,
    {
      codec: Widget.Message.UseCases.AddName.Command.Codec,
      handler: Widget.Message.UseCases.AddName.Handler(),
    },
  ],
  [
    Widget.Message.UseCases.AddPhone.Command.Name,
    {
      codec: Widget.Message.UseCases.AddPhone.Command.Codec,
      handler: Widget.Message.UseCases.AddPhone.Handler(),
    },
  ],
  [
    Widget.Message.UseCases.AddText.Command.Name,
    {
      codec: Widget.Message.UseCases.AddText.Command.Codec,
      handler: Widget.Message.UseCases.AddText.Handler(),
    },
  ],
  [
    Widget.Message.UseCases.Create.Command.Name,
    {
      codec: Widget.Message.UseCases.Create.Command.Codec,
      handler: Widget.Message.UseCases.Create.Handler(),
    },
  ],
  [
    Widget.Message.UseCases.Send.Command.Name,
    {
      codec: Widget.Message.UseCases.Send.Command.Codec,
      handler: Widget.Message.UseCases.Send.Handler()(),
    },
  ],
  [
    Widget.Settings.UseCases.GetByID.Query.Name,
    {
      codec: Widget.Settings.UseCases.GetByID.Query.Codec,
      handler: Widget.Settings.UseCases.GetByID.Query.Handler(),
    },
  ],
]);

export const Container = (type: Type.T) =>
  pipe(
    map.get(type),
    fromNullable(Errors.Adapter.C())
  );
