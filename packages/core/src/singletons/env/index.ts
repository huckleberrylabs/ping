type IENV = "production" | "development";

let ENV: IENV = "development";

if (process && process.env && process.env.NODE_ENV) {
  // API
  ENV = <IENV>process.env.NODE_ENV;
} else {
  // Browser
  ENV = "production";
}

export { ENV };
