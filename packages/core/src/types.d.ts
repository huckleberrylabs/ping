import { UUID } from "./values";

declare global {
  namespace Express {
    export interface Request {
      authenticatedID?: UUID.T;
    }
  }
}
