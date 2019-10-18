import { isLeft, right } from "fp-ts/lib/Either";
import { UUID, Beacon, EndpointFromEvent } from "@huckleberryai/core";
import { UseCases, Logging, FingerPrint } from "../client";
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
type Options = {
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

export default (options: Options = DefaultOptions) => async (
  app?: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
) => {
  const event = UseCases.Loaded.Event.C(app, corr, parent);
  const url = EndpointFromEvent(event);
  if (isLeft(url)) return url;
  Beacon(url.right, UseCases.Loaded.Event.Codec.encode(event));

  // Logging
  const log = Logging.Log.C();
  const logger: ILogger = (level, message, tags, parent) =>
    Logging.Logger.C(log)(level, message, tags, corr, parent);

  // Fingerprint
  const fingerprint =
    options.fingerPrint && options.fingerPrint.enabled
      ? await FingerPrint.Generate()
      : undefined;

  const unload = () => {
    const event = UseCases.Unloaded.Event.C(
      log,
      fingerprint,
      app,
      corr,
      parent
    );
    const url = EndpointFromEvent(event);
    if (isLeft(url)) return url;
    return right(
      Beacon(url.right, UseCases.Unloaded.Event.Codec.encode(event))
    );
  };

  if (options.log && options.log.attachToWindow) AttachToWindow(log, logger);

  // auto-set unload event listener
  if (options.setUnloadListener) {
    window.addEventListener("unload", () => unload());
  }
  return right({
    log: logger,
    unload,
  });
};
