import { isLeft, right } from "fp-ts/lib/Either";
import { UUID, HTTP } from "@huckleberryai/core";
import { UseCases, Logging, FingerPrint } from "../client";
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
  const url = HTTP.EndpointFromEvent(event);
  if (isLeft(url)) return url;
  HTTP.Beacon(url.right, UseCases.Loaded.Event.Codec.encode(event));

  // Logging
  const log = Logging.Log.C();
  const logger = Logging.Logger.C(log, corr);

  // Fingerprint
  const fingerprint =
    options.fingerPrint && options.fingerPrint.enabled
      ? await FingerPrint.Generate()
      : undefined;

  const unload = () => {
    const command = UseCases.Unloaded.Command.C(
      log,
      fingerprint,
      app,
      corr,
      parent
    );
    const url = HTTP.EndpointFromEvent(command);
    if (isLeft(url)) return url;
    return right(
      HTTP.Beacon(url.right, UseCases.Unloaded.Command.Codec.encode(command))
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
