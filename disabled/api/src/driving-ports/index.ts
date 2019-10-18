import WebAnalytics from "@huckleberryai/web-analytics";
// import Widget from "@huckleberryai/widget";

export const Container = {
  [WebAnalytics.Client.UseCases.Loaded.Event
    .Name]: WebAnalytics.Client.UseCases.Loaded.Handler(),

  [WebAnalytics.Client.UseCases.Unloaded.Event
    .Name]: WebAnalytics.Client.UseCases.Unloaded.Handler(),

  [WebAnalytics.Server.UseCases.HTTPAccess.Event
    .Name]: WebAnalytics.Client.UseCases.Unloaded.Handler(),
};

export const HandlerMap = (container: typeof Container) => {
  return {
    [WebAnalytics.Client.UseCases.Loaded.Event.Name]:
      container[WebAnalytics.Client.UseCases.Loaded.Event.Name],
  };
};

/* 
export const Contain = new Map<Type.T, { codec: iots.Any; handler: Handler }>([
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
 */
