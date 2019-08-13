import { ID } from "../id";
import { Type } from "../type";
import { TimeStamp } from "../timestamp";
import { IResult, IResultStatic, HttpStatusCode } from "../interfaces";
import { CONTEXT_ID } from "../context";
import { staticImplements } from "../helpers";

@staticImplements<IResultStatic>()
export class Result implements IResult {
  public timestamp: TimeStamp;
  public id: ID;
  public originID: ID;
  public corrID: ID;
  public parentID: ID;
  public type: Type;
  public status: HttpStatusCode;
  public data: any;
  private _contextID: ID = CONTEXT_ID;
  constructor(
    data: any,
    status: HttpStatusCode,
    originID: ID,
    corrID: ID,
    parentID: ID,
    type: Type
  ) {
    this.timestamp = new TimeStamp();
    this.id = new ID();
    this.originID = originID;
    this.corrID = corrID;
    this.parentID = parentID;
    this.type = type;
    this.status = status;
    this.data = data;
  }
  public static deserialize(input: string): Result {
    const result = JSON.parse(input);
    return new Result(
      result.data,
      result.status,
      new ID(result.originID),
      new ID(result.corrID),
      new ID(result.parentID),
      new Type(result.type)
    );
  }
  public get contextID() {
    return this._contextID;
  }
  public set contextID(id: ID) {
    this._contextID = id;
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
      data: this.data,
    };
  }
  public static fromJSON(json: any): Result {
    const result = new Result(
      json.data,
      json.status,
      new ID(json.originID),
      new ID(json.corrID),
      new ID(json.parentID),
      new Type(json.type)
    );
    result.id = new ID(json.id);
    result.timestamp = new TimeStamp(json.timestamp);
    result.contextID = new ID(json.contextID);
    return result;
  }
}
