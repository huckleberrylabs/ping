import { UUID, HTTP } from "@huckleberryai/core";
import { SDK } from "../interfaces";
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

type SDKC = (
  options?: Options
) => (app?: UUID.T, corr?: UUID.T, parent?: UUID.T) => SDK;

export const C: SDKC = (options: Options = DefaultOptions) => (
  app?: UUID.T,
  corr?: UUID.T,
  parent?: UUID.T
): SDK => {
  const event = UseCases.Loaded.Event.C(app, corr, parent);
  const url = HTTP.EndpointFromEvent(event);
  HTTP.Beacon(url, UseCases.Loaded.Event.Codec.encode(event));

  // Logging
  const log = Logging.Log.C();
  const logger = Logging.Logger.C(log, corr);

  // Fingerprint
  let fingerprint: FingerPrint.T | undefined = undefined;
  if (options.fingerPrint && options.fingerPrint.enabled) {
    FingerPrint.Generate().then(print => (fingerprint = print));
  }

  const unload = () => {
    const command = UseCases.Unloaded.Command.C(
      log,
      fingerprint,
      app,
      corr,
      parent
    );
    const url = HTTP.EndpointFromEvent(command);
    return HTTP.Beacon(url, UseCases.Unloaded.Command.Codec.encode(command));
  };

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
