import { IUUID, UUID } from "../uuid";

let CONTEXT_ID: IUUID;

if (process && process.env && process.env.CONTEXT_ID) {
  // API
  CONTEXT_ID = UUID(process.env.CONTEXT_ID);
} else {
  // Browser
  CONTEXT_ID = UUID("28953194-88b1-4d25-b921-7168538d759f");
}

export { CONTEXT_ID };
