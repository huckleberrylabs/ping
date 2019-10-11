import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import { UUID, Beacon, EndpointFromEvent } from "@huckleberryai/core";
import { Loaded, Unloaded, Log, Logger, FingerPrint } from "../client";
import { Logger as ILogger } from "../interfaces";
import { AttachToWindow } from "./window";

/**
 * @param log.attachToWindow
 * defaults to enabled
 * @param fingerPrint.enabled
 * defaults to disabled
 * @param setUnloadListener
 * defaults to enabled
 */
export type Options = {
  log?: {
    attachToWindow?: boolean;
  };
  fingerPrint?: {
    enabled?: boolean;
  };
  setUnloadListener?: boolean;
};

const DefaultOptions: Options = {
  log: { attachToWindow: true },
  fingerPrint: { enabled: false },
  setUnloadListener: true,
};

export type SDK = {
  log: ILogger;
  unload: () => void;
};

export const SDK = (options: Options = DefaultOptions) => async (
  app?: UUID,
  corr?: UUID,
  parent?: UUID
): Promise<SDK> => {
  // Loaded
  pipe(
    Loaded.Event(app, corr, parent),
    event =>
      pipe(
        EndpointFromEvent(event),
        map(url => Beacon(url, Loaded.EventCodec.encode(event)))
      )
  );

  // Logging
  const log = Log();
  const logger: ILogger = (level, message, tags, parent) =>
    Logger(log)(level, message, tags, corr, parent);

  // Fingerprint
  const fingerprint =
    options.fingerPrint && options.fingerPrint.enabled
      ? await FingerPrint()
      : undefined;

  const unload = () =>
    pipe(
      Unloaded.Event(log, fingerprint, app, corr, parent),
      event =>
        pipe(
          EndpointFromEvent(event),
          map(url => Beacon(url, Loaded.EventCodec.encode(event)))
        )
    );

  if (options.log && options.log.attachToWindow) AttachToWindow(log, logger);

  // auto-set unload event listener
  if (options.setUnloadListener) {
    window.addEventListener("unload", () => unload());
  }
  return {
    log: logger,
    unload,
  };
};
