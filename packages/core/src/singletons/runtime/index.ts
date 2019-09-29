export type IRuntime = "browser" | "node";

let RUNTIME: IRuntime;

if (typeof process === "object" && typeof window === "undefined") {
  RUNTIME = "node";
} else if (typeof process === "undefined" && typeof window === "object") {
  RUNTIME = "browser";
} else {
  throw new Error(
    `unknown runtime: (process: ${typeof process}), (window: ${typeof window})`
  );
}

export { RUNTIME };
