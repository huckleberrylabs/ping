import { NowRequest } from "@now/node";
import { Event, ID, Type, TimeStamp } from "@huckleberry/core";

export class HTTPAccessEvent extends Event {
  method?: string;
  url?: string;
  headers: string[];
  body: any;
  constructor(req: NowRequest, originID: ID) {
    const corrIDString = req.query["corr_id"];
    let corrID = undefined;
    if (typeof corrIDString === "string") {
      corrID = new ID(corrIDString);
    }
    const parentIDString = req.query["parent_id"];
    let parentID = undefined;
    if (typeof parentIDString === "string") {
      parentID = new ID(parentIDString);
    }
    super(originID, corrID, parentID);
    this.method = req.method;
    this.url = req.url;
    this.headers = req.rawHeaders;
    this.body = req.body;
  }
  public get type() {
    return HTTPAccessEvent.type;
  }
  public static get type() {
    return new Type("HTTPAccessEvent");
  }
  public static fromJSON(json: any): HTTPAccessEvent {
    const emulatedReq = json;
    emulatedReq.query = {
      corr_id: json.corrID,
      parent_id: json.parentID,
    };
    const event = new HTTPAccessEvent(emulatedReq, new ID(json.originID));
    event.id = new ID(json.id);
    event.timestamp = new TimeStamp(json.timestamp);
    event.contextID = new ID(json.contextID);
    return event;
  }
}
