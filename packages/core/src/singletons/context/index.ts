import { UUID } from "../../values/uuid";
import { ENV } from "../env";

export const getContext = (): UUID => {
  if (ENV === "development") return "64b265e6-f69a-4dea-8cab-693a06a5c554";
  if (ENV === "staging") return "645d5709-2b56-4764-88c5-62bc41e01a27";
  if (ENV === "production") return "57bc81af-49d6-409a-9aaa-a64e10dea4c5";
  if (ENV === "test") return "364f9e4e-766a-44ac-9f44-2599e1eaa036";
  throw new Error("invalid ENV");
};

export const CONTEXT_ID = getContext();
