import { ENV } from "../env";

export const getAPIEndpoint = (): string => {
  if (ENV === "production") return "https://api.huckleberry.app";
  if (ENV === "staging") return "https://staging.huckleberry.app";
  if (ENV === "development") return "http://localhost:8000";
  if (ENV === "test") return "http://localhost:8000";
  throw new Error("Invalid ENV");
};

export const API_ENDPOINT = getAPIEndpoint();

export const EVENTS_ENDPOINT = "/events";
