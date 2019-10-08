import { UUID, Beacon } from "@huckleberryai/core";
import { Log, Logger } from "@huckleberryai/log";
import { WebAnalyticsClientLoadedEvent } from "../client-loaded";
import { WebAnalyticsClientUnloadedEvent } from "../client-unloaded";
import { FingerPrint } from "../fingerprint";
import { AttachToWindow } from "../window";

/**
 * @param log.attachToWindow
 * defaults to enabled
 * @param fingerPrint.enabled
 * defaults to disabled
 * @param setUnloadListener
 * defaults to enabled
 */
export type WebAnalyticsSDKOptions = {
  log?: {
    attachToWindow?: boolean;
  };
  fingerPrint?: {
    enabled?: boolean;
  };
  setUnloadListener?: boolean;
};

const WebAnalyticsSDKDefaultOptions: WebAnalyticsSDKOptions = {
  log: { attachToWindow: true },
  fingerPrint: { enabled: false },
  setUnloadListener: true,
};

export type WebAnalyticsSDK = {
  log: Logger;
  unload: () => void;
};

export const WebAnalyticsSDK = (
  options: WebAnalyticsSDKOptions = WebAnalyticsSDKDefaultOptions
) => async (
  origin: UUID,
  app: UUID | null = null,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
) => {
  // Loaded
  Beacon(
    "TODO: Add URL",
    WebAnalyticsClientLoadedEvent(app, origin, corr, parent, agent)
  );

  // Logging
  const log = Log();
  const logger = Logger(log);
  if (options.log && options.log.attachToWindow)
    AttachToWindow(log, Logger(log));

  // Fingerprint
  const fingerprint =
    options.fingerPrint && options.fingerPrint.enabled
      ? await FingerPrint()
      : null;

  const unload = () =>
    Beacon(
      "TODO: Add URL",
      WebAnalyticsClientUnloadedEvent(
        log,
        fingerprint,
        app,
        origin,
        corr,
        parent,
        agent
      )
    );
  // auto-set unload event listener
  if (options.setUnloadListener) {
    window.addEventListener("unload", () => unload());
  }
  return {
    log: logger,
    unload: unload,
  };
};
