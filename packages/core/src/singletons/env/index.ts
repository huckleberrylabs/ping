import { RUNTIME } from "../runtime";
import { log } from "../log";
import { UUID } from "../../value-objects";

type IENV = "development" | "test" | "staging" | "production";

// default to development
let ENV: IENV = "development";

if (RUNTIME === "node") {
  ENV = <IENV>process.env.NODE_ENV;
} else if (RUNTIME === "browser") {
  // retrieve widget id
  ENV = ((): IENV => {
    const ORIGIN_ID = UUID("c857c895-40b7-41ca-ae27-a04e34274298");
    try {
      const ENV_SCRIPT_ID: string = "huckleberry-core-env-script";
      const script = document.getElementById(ENV_SCRIPT_ID);
      if (!script) {
        throw new Error("script is missing");
      }
      const urlString = script.getAttribute("src");
      if (!urlString) {
        throw new Error("script src attribute missing");
      }
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const envString = url.searchParams.get("env");
      if (!envString) {
        throw new Error("env must be provided");
      }
      log.add(
        `env retrieved successfully: ${envString} `,
        ["info", "core"],
        ORIGIN_ID
      );
      return <IENV>envString;
    } catch (error) {
      const message = "env could not be retrieved";
      log.add(message, ["error", "core"], ORIGIN_ID);
      throw new Error(message);
    }
  })();
} else {
  throw new Error("runtime is unknown");
}

export { ENV };
