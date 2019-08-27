import { isDev } from "../../config";

type LOG_LEVELS = "info" | "debug" | "error" | "critical";

export const logger = (level: LOG_LEVELS, data: any) => {
  if (isDev) {
    console.log(`${new Date().toISOString()} ${level} ${JSON.stringify(data)}`);
  } else {
    // persist logs to our infrastructure
  }
};
