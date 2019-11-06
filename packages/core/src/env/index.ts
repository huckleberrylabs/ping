import { DefaultEnvironment } from "../config";

export type T = "development" | "test" | "staging" | "production";

export const Is = (input: unknown): input is T =>
  typeof input === "string" &&
  (input === "development" ||
    input === "test" ||
    input === "staging" ||
    input === "production");

export const Get = (): T =>
  Is(process.env.NODE_ENV) ? process.env.NODE_ENV : DefaultEnvironment;
