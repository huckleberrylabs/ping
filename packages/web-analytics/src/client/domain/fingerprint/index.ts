import * as iots from "io-ts";
import { GeoCodec, Geo } from "./geo";
import { DeviceCodec, Device } from "./device";
import { NetworkCodec, Network } from "./network";
import { BrowserCodec, Browser } from "./browser";
import { AccountsCodec, Accounts } from "./accounts";

export const FingerPrintCodec = iots.type({
  geo: GeoCodec,
  device: DeviceCodec,
  network: NetworkCodec,
  browser: BrowserCodec,
  accounts: AccountsCodec,
});
export type FingerPrint = iots.TypeOf<typeof FingerPrintCodec>;

export const FingerPrint = async (): Promise<FingerPrint> => ({
  geo: Geo(),
  device: await Device(),
  network: await Network(),
  browser: await Browser(),
  accounts: await Accounts(),
});
