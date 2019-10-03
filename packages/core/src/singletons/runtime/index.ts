export type IRuntime = "browser" | "node";

const getRuntime = (): IRuntime => {
  if (typeof window === "undefined") return "node";
  if (typeof window === "object") return "browser";
  throw new Error(`unknown runtime: (window: ${typeof window})`);
};

export const RUNTIME = getRuntime();
