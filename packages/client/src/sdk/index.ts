import axios from "axios";
import {
  Config,
  UUID,
  Errors,
  Widget,
  StatusCode,
} from "@huckleberrylabs/ping-core";
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
      switch (res.status) {
        case StatusCode.BAD_REQUEST:
          const badrequest = Errors.Parsing.Codec.decode(res.data);
          if (isLeft(badrequest)) return left(Errors.Parsing.C());
          return left(badrequest.right);
        case StatusCode.FORBIDDEN:
          const unauthorized = Errors.Unauthorized.Codec.decode(res.data);
          if (isLeft(unauthorized)) return left(Errors.Parsing.C());
          return left(unauthorized.right);
        case StatusCode.INTERNAL_SERVER_ERROR:
          const serverError = Errors.Adapter.Codec.decode(res.data);
          if (isLeft(serverError)) return left(Errors.Parsing.C());
          return left(serverError.right);
        case StatusCode.NOT_FOUND:
          const notFound = Errors.NotFound.Codec.decode(res.data);
          if (isLeft(notFound)) return left(Errors.Parsing.C());
          return left(notFound.right);
        case StatusCode.OK:
          const widgetMaybe = Widget.Settings.Model.Codec.decode(res.data);
          if (isLeft(widgetMaybe)) return left(Errors.Parsing.C());
          return widgetMaybe;
        default:
          return left(Errors.Adapter.C());
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
        return res.status !== 200 ? left(Errors.Adapter.C()) : right(null); // TODO create mapping function between status codes and Errors
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
