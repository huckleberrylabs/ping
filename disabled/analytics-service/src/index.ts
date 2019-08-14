import { CONTEXT_ID, ID, IEventHandler } from "@huckleberry/core";
import { FingerPrintEvent } from "@huckleberry/analytics";

export const FingerPrintEventHandler: IEventHandler<FingerPrintEvent> = {
  type: FingerPrintEvent.type,
  nodeID: new ID(),
  contextID: CONTEXT_ID,
  async handle(event: FingerPrintEvent): Promise<void> {},
};
