import * as iots from "io-ts";
import { LIST } from "./list";

export { LIST };
export const Codec = iots.record(iots.string, iots.boolean);
export type T = iots.TypeOf<typeof Codec>;

// https://robinlinus.github.io/socialmedia-leak/
export const Detect = async (): Promise<T> => {
  const accounts: T = {};
  Object.entries(LIST).map(async ([key, value]) => {
    const img = document.createElement("img");
    img.referrerPolicy = "no-referrer";
    img.src = value;
    img.onload = () => {
      accounts[key] = true;
    };
    img.onerror = () => {
      accounts[key] = false;
    };
  });
  return new Promise(resolve => {
    setTimeout(() => resolve(accounts), 2000);
  });
};
