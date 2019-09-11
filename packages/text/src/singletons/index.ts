import { ENV } from "@huckleberryai/core";

let API_ENDPOINT: string;

if (ENV === "production") {
  API_ENDPOINT = "https://api.huckleberry.app";
} else if (ENV === "staging") {
  API_ENDPOINT = "https://staging.huckleberry.app";
} else if (ENV === "development") {
  API_ENDPOINT = "http://localhost:8000";
} else if (ENV === "test") {
  API_ENDPOINT = "http://localhost:8000";
} else {
  throw new Error("unknown env");
}

export { API_ENDPOINT };

export const EVENTS_ENDPOINT = "/events";
