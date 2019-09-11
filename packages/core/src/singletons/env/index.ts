import { RUNTIME } from "../runtime";

type IENV = "development" | "staging" | "production";

// default to development
let ENV: IENV = "development";

if (RUNTIME === "node") {
  ENV = <IENV>process.env.NODE_ENV;
} else if (RUNTIME === "browser") {
} else {
  throw new Error("runtime is unknown");
}

export { ENV };
