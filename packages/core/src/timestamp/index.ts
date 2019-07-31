import moment from "moment";

export class TimeStamp {
  constructor() {
    return moment().toISOString();
  }
}
