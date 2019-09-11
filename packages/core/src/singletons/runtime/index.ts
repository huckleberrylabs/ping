export type IRuntime = "browser" | "node";

export const RUNTIME: IRuntime =
  typeof process === "object" ? "node" : "browser";
