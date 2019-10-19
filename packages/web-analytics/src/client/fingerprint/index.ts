import * as iots from "io-ts";
import * as Geo from "./geo";
import * as Device from "./device";
import * as Network from "./network";
import * as Browser from "./browser";
import * as Accounts from "./accounts";

export { Geo, Device, Network, Browser, Accounts };

export const Name = "web-analytics:client:fingerprint";

export const Codec = iots.type(
  {
    geo: Geo.Codec,
    device: Device.Codec,
    network: Network.Codec,
    browser: Browser.Codec,
    accounts: Accounts.Codec,
  },
  Name
);
export type T = iots.TypeOf<typeof Codec>;

export const Generate = async (): Promise<T> => ({
  geo: Geo.Detect(),
  device: await Device.Detect(),
  network: await Network.Detect(),
  browser: await Browser.Detect(),
  accounts: await Accounts.Detect(),
});
