import axios from "axios";
import {
  Config,
  UUID,
  Errors,
  Widget,
  Analytics,
  StatusCode,
} from "@huckleberrylabs/ping-core";
import { Either, left, isLeft } from "fp-ts/lib/Either";

export type T = {
  Widget: {
    GetByID: () => Promise<Either<Errors.T, Widget.PublicModel.T>>;
    Send: (message: Widget.Message.Model.T) => Promise<Either<Errors.T, null>>;
  };
  Analytics: {
    AddEvent: (action: UUID.T) => void;
  };
};

export const C = (widget: UUID.T): T => ({
  Widget: {
    GetByID: async () => {
      try {
        const res = await axios.post(
          Config.GetEndpoint(Widget.UseCases.GetByID.Route),
          Widget.UseCases.GetByID.Query.Codec.encode(
            Widget.UseCases.GetByID.Query.C(widget)
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
            const widgetMaybe = Widget.PublicModel.Codec.decode(res.data);
            if (isLeft(widgetMaybe)) return left(Errors.Parsing.C());
            return widgetMaybe;
          default:
            return left(Errors.Adapter.C());
        }
      } catch (error) {
        return left(Errors.Adapter.C());
      }
    },
    Send: async message => {
      return left(Errors.Adapter.C());
    },
  },
  Analytics: {
    AddEvent: (action: UUID.T) => {
      navigator.sendBeacon(
        Config.GetEndpoint(Analytics.UseCases.AddEvent.Route),
        JSON.stringify(
          Analytics.UseCases.AddEvent.Command.Codec.encode(
            Analytics.UseCases.AddEvent.Command.C(widget, action)
          )
        )
      );
    },
  },
});
