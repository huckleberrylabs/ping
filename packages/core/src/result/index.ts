import { ID } from "../id";
import { TypeName } from "../type-name";
import { TimeStamp } from "../timestamp";
import { Event } from "../event";
import { IResult, IResultStatic } from "../interfaces";
import { staticImplements } from "../helpers";
import { StatusCode } from "../status-codes";

@staticImplements<IResultStatic>()
export class Result extends Event implements IResult {
  public parentID?: ID;
  public type: TypeName;
  public status: StatusCode;
  public data: any;
  constructor(
    data: any,
    status: StatusCode,
    type: TypeName,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(originID, corrID, parentID);
    this.type = type;
    this.status = status;
    this.data = data;
  }
  public get isError() {
    return this.status < 200 || this.status >= 400;
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
      status: this.status,
      isError: this.isError,
      data: this.data,
    };
  }
  public static fromJSON(json: any): Result {
    const result = new Result(
      json.data,
      json.status,
      new TypeName(json.type),
      new ID(json.originID),
      new ID(json.corrID),
      new ID(json.parentID)
    );
    result.id = new ID(json.id);
    result.timestamp = new TimeStamp(json.timestamp);
    result.contextID = new ID(json.contextID);
    return result;
  }
}
