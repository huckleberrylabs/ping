import moment, { Moment } from "moment";
import { WithSerialize } from "../interfaces";

export class TimeStamp implements WithSerialize {
  private _timestamp: Moment;
  constructor(ISOString?: string) {
    if (ISOString) {
      this._timestamp = moment(ISOString);
    } else {
      this._timestamp = moment();
    }
  }
  toString() {
    return this._timestamp.toISOString();
  }
  toJSON() {
    return this.toString();
  }
}
