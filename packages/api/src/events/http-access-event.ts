import { NowRequest } from "@now/node";
import { Event, ID, Type, TimeStamp } from "@huckleberryai/core";

export class HTTPAccessEvent extends Event {
  method?: string;
  url?: string;
  headers: {
    [key: string]: string;
  };
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
    this.headers = {};
    for (let index = 0; index < req.rawHeaders.length - 1; index++) {
      this.headers[req.rawHeaders[index]] = req.rawHeaders[index + 1];
    }
  }
  public get type() {
    return HTTPAccessEvent.type;
  }
  public static get type() {
    return new Type("HTTPAccessEvent");
  }
  public toJSON() {
    return {
      timestamp: this.timestamp,
      id: this.id,
      originID: this.originID,
      corrID: this.corrID,
      parentID: this.parentID,
      contextID: this.contextID,
      type: this.type,
      method: this.method,
      url: this.url,
      headers: this.headers,
    };
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
