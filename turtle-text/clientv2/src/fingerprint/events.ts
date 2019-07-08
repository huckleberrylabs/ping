import { Event } from "../base";
import { FingerPrint } from "./models";

const FingerPrintEventType = Symbol("FingerPrintEvent");
export class FingerPrintEvent extends Event {
  public fingerPrint: FingerPrint;
  constructor(
    nodeID: string,
    corrID: string | undefined,
    parentID: string | undefined,
    appID: string,
    fingerPrint: FingerPrint
  ) {
    super(nodeID, corrID, parentID, appID);
    this.fingerPrint = fingerPrint;
  }
  public get type(): symbol {
    return FingerPrintEventType;
  }
  public static get type(): symbol {
    return FingerPrintEventType;
  }
}
