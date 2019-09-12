import { RUNTIME } from "../runtime";

let GLOBAL: { [key: string]: any };

if (RUNTIME === "browser") {
  (<any>window).Huckleberry = {};
  GLOBAL = (<any>window).Huckleberry;
} else if (RUNTIME === "node") {
  (<any>global).Huckleberry = {};
  GLOBAL = (<any>global).Huckleberry;
} else {
  throw new Error(`unknown runtime: ${RUNTIME}`);
}

export { GLOBAL };
