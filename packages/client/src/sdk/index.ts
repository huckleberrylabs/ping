import axios from "axios";
import { Config, UUID, Errors, Widget } from "@huckleberrylabs/ping-core";
import { Either, left, isLeft, right } from "fp-ts/lib/Either";

export type T = {
  GetByID: () => Promise<Either<Errors.T, Widget.Settings.Model.T>>;
  Channel: {
    Send: (message: Widget.Values.Message.T) => Promise<Either<Errors.T, null>>;
  };
  Analytics: {
    AddEvent: (action: UUID.T) => void;
  };
};

export const C = (widget: UUID.T): T => ({
  GetByID: async () => {
    try {
      const res = await axios.post(
        Config.GetEndpoint(Widget.Settings.UseCases.GetByID.Route),
        Widget.Settings.UseCases.GetByID.Query.Codec.encode(
          Widget.Settings.UseCases.GetByID.Query.C(widget)
        ),
        {
          validateStatus: () => true,
        }
      );
      if (res.status === 200) {
        const widgetMaybe = Widget.Settings.Model.Codec.decode(res.data);
        if (isLeft(widgetMaybe)) return left(Errors.Parsing.C());
        return widgetMaybe;
      } else {
        return left(Errors.FromStatusCode(res.status, res.data));
      }
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  Channel: {
    Send: async message => {
      try {
        const res = await axios.post(
          Config.GetEndpoint(Widget.Channel.UseCases.Receive.Route),
          Widget.Channel.UseCases.Receive.Command.Codec.encode(
            Widget.Channel.UseCases.Receive.Command.C(widget, message)
          ),
          {
            validateStatus: () => true,
          }
        );
        return res.status === 200
          ? right(null)
          : left(Errors.FromStatusCode(res.status, res.data));
      } catch (error) {
        return left(Errors.Adapter.C());
      }
    },
  },
  Analytics: {
    AddEvent: (action: UUID.T) => {
      navigator.sendBeacon(
        Config.GetEndpoint(Widget.Analytics.UseCases.AddEvent.Route),
        JSON.stringify(
          Widget.Analytics.UseCases.AddEvent.Command.Codec.encode(
            Widget.Analytics.UseCases.AddEvent.Command.C(widget, action)
          )
        )
      );
    },
  },
});
