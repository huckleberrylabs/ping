import { RUNTIME } from "../runtime";

type IENV = "development" | "test" | "staging" | "production";

// default to development
let ENV: IENV = "development";

if (RUNTIME === "node") {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test" &&
    process.env.NODE_ENV !== "staging" &&
    process.env.NODE_ENV !== "production"
  ) {
    throw new Error(`unknown NODE_ENV: ${process.env.NODE_ENV} `);
  } else {
    ENV = <IENV>process.env.NODE_ENV.valueOf();
  }
} else if (RUNTIME === "browser") {
  const ENV_SCRIPT_ID: string = "huckleberry-core-env-script";
  const script = document.getElementById(ENV_SCRIPT_ID);
  if (!script) {
    ENV = "production";
  } else {
    const urlString = script.getAttribute("src");
    if (!urlString) {
      throw new Error("huckleberry-core-env-script src attribute missing");
    }
    const a = document.createElement("a");
    a.href = urlString;
    const url = new URL(a.href);
    const envString = url.searchParams.get("env");
    if (!envString) {
      throw new Error("env must be provided in huckleberry-core-env-script");
    }
    ENV = <IENV>envString;
  }
} else {
  throw new Error(`unknown runtime: ${RUNTIME}`);
}

export { ENV };
