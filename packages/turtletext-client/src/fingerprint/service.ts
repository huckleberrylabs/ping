import axios from "axios";
import { API_URL, CORR_ID, PARENT_ID } from "../config";
import { FingerPrintFactory } from "./factory";
import { FingerPrintEvent } from "./events";

const EVENTS_ENDPOINT = API_URL + "finger-prints/events";

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
