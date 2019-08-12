import { ID } from "../id";

let CONTEXT_ID;

if (process && process.env && process.env.CONTEXT_ID) {
  // API
  CONTEXT_ID = new ID(process.env.CONTEXT_ID);
} else {
  // Browser
  CONTEXT_ID = new ID("28953194-88b1-4d25-b921-7168538d759f");
}

export { CONTEXT_ID };
