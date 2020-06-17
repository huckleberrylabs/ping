import { HTTP, UUID, TimeStamp } from "@huckleberrylabs/core";

export type T = {
  Widget: {
    Tracking: {
      Load: () => void;
      Unload: () => void;
      Open: () => void;
      Close: () => void;
    };
  };
};

export const C = (widget: UUID.T): T => ({
  Widget: {
    Tracking: {
      Load: () => {
        navigator.sendBeacon(
          HTTP.GetEndpoint("/v1/widgets/tracking/load"),
          JSON.stringify({
            id: UUID.C(),
            timestamp: TimeStamp.C(),
            type: "widget:tracking:load",
            widget,
          })
        );
      },
      Unload: () => {
        navigator.sendBeacon(
          HTTP.GetEndpoint("/v1/widgets/tracking/unload"),
          JSON.stringify({
            id: UUID.C(),
            timestamp: TimeStamp.C(),
            type: "widget:tracking:unload",
            widget,
          })
        );
      },
      Open: () => {
        navigator.sendBeacon(
          HTTP.GetEndpoint("/v1/widgets/tracking/open"),
          JSON.stringify({
            id: UUID.C(),
            timestamp: TimeStamp.C(),
            type: "widget:tracking:open",
            widget,
          })
        );
      },
      Close: () => {
        navigator.sendBeacon(
          HTTP.GetEndpoint("/v1/widgets/tracking/close"),
          JSON.stringify({
            id: UUID.C(),
            timestamp: TimeStamp.C(),
            type: "widget:tracking:close",
            widget,
          })
        );
      },
    },
  },
});
