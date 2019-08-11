import { Event, ID, staticImplements, IEventStatic } from "@huckleberry/core";
import { FingerPrint } from "./models";

const FingerPrintEventType = Symbol.for("FingerPrintEvent");
@staticImplements<IEventStatic>()
export class FingerPrintEvent extends Event {
  public fingerPrint: FingerPrint;
  constructor(
    fingerPrint: FingerPrint,
    nodeID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(nodeID, corrID, parentID);
    this.fingerPrint = fingerPrint;
  }
  public get type(): symbol {
    return FingerPrintEventType;
  }
  public static get type(): symbol {
    return FingerPrintEventType;
  }
}
