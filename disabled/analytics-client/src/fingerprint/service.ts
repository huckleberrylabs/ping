import axios from "axios";
import { EVENTS_ENDPOINT, FingerPrintEvent } from "@huckleberry/analytics";
import { CORR_ID, PARENT_ID } from "../constants";
import { FingerPrintFactory } from "./factory";

export class FingerPrintService {
  private factory = new FingerPrintFactory();
  constructor(private appID: string) {}
  async create() {
    const fingerPrint = await this.factory.generate();
    const fingerPrintEvent = new FingerPrintEvent(
      this.nodeID,
      CORR_ID,
      PARENT_ID,
      this.appID,
      fingerPrint
    );
    axios.post(EVENTS_ENDPOINT, fingerPrintEvent);
  }
  get nodeID() {
    return "";
  }
}
