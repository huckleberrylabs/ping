import axios from "axios";
import {
  Config,
  UUID,
  Errors,
  Widget,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";
import { Either, left, isLeft, right } from "fp-ts/lib/Either";

export const Name = "sdk" as NameSpaceCaseString.T;

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
        Widget.Settings.UseCases.GetByID.Query.Encode(
          Widget.Settings.UseCases.GetByID.Query.C(widget)
        ),
        {
          validateStatus: () => true,
        }
      );
      if (res.status === 200) {
        const widgetMaybe = Widget.Settings.Model.Decode(res.data);
        if (isLeft(widgetMaybe)) return widgetMaybe;
        return widgetMaybe;
      } else {
        return left(Errors.FromStatusCode(res.status, res.data));
      }
    } catch (error) {
      return left(Errors.Adapter.C(Name, `GetByID ${error.message}`));
    }
  },
  Channel: {
    Send: async message => {
      try {
        const res = await axios.post(
          Config.GetEndpoint(Widget.Channel.UseCases.Receive.Route),
          Widget.Channel.UseCases.Receive.Command.Encode(
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
        return left(Errors.Adapter.C(Name, `Send ${error.message}`));
      }
    },
  },
  Analytics: {
    AddEvent: (action: UUID.T) => {
      navigator.sendBeacon(
        Config.GetEndpoint(Widget.Analytics.UseCases.AddEvent.Route),
        JSON.stringify(
          Widget.Analytics.UseCases.AddEvent.Command.Encode(
            Widget.Analytics.UseCases.AddEvent.Command.C(widget, action)
          )
        )
      );
    },
  },
});
