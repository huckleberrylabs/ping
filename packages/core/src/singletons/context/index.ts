import { IUUID, UUID } from "../../value-objects/uuid";
import { ENV } from "../env";

let CONTEXT_ID: IUUID;

if (ENV === "development") {
  CONTEXT_ID = UUID("64b265e6-f69a-4dea-8cab-693a06a5c554");
} else if (ENV === "staging") {
  CONTEXT_ID = UUID("645d5709-2b56-4764-88c5-62bc41e01a27");
} else if (ENV === "production") {
  CONTEXT_ID = UUID("57bc81af-49d6-409a-9aaa-a64e10dea4c5");
} else if (ENV === "test") {
  CONTEXT_ID = UUID("364f9e4e-766a-44ac-9f44-2599e1eaa036");
} else {
  throw new Error("environment is unknown");
}

export { CONTEXT_ID };
