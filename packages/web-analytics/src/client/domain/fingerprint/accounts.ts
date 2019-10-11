import * as iots from "io-ts";
import { ACCOUNTS } from "./accounts-list";

export const AccountsCodec = iots.record(iots.string, iots.boolean);
export type Accounts = iots.TypeOf<typeof AccountsCodec>;

// https://robinlinus.github.io/socialmedia-leak/
export const Accounts = async (): Promise<Accounts> => {
  const accounts: Accounts = {};
  Object.entries(ACCOUNTS).map(async ([key, value]) => {
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
