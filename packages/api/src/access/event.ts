import { IncomingHttpHeaders } from "http";
import { Request } from "express";
import { Event } from "@huckleberry/core";

const HTTPAccessEventType = Symbol("HTTPAccessEvent");
export class HTTPAccessEvent extends Event {
  ip: string;
  method: string;
  url: string;
  sessionID?: string;
  cookies: string;
  headers: IncomingHttpHeaders;
  body: any;
  constructor(nodeID: string, req: Request) {
    super(nodeID, req.query["corr"], req.query["prvt"]);
    this.ip = req.ip;
    this.method = req.method;
    this.url = req.originalUrl;
    this.sessionID = req.sessionID; // possibly remove
    this.cookies = req.cookies; // possibly remove
    this.headers = req.headers;
    this.body = req.body;
  }
  public get type(): symbol {
    return HTTPAccessEventType;
  }
  public static get type(): symbol {
    return HTTPAccessEventType;
  }
}
