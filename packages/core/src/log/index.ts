import { LogEvent, LOG_LABELS } from "../log-event";
import { ENV } from "../env";
import { ID } from "../id";
import { WithDeserialize, WithSerialize } from "../interfaces";
import { staticImplements } from "../helpers";

@staticImplements<WithDeserialize<Log>>()
export class Log implements WithSerialize {
  public _log: LogEvent[] = [];
  public add(
    message: string,
    labels: LOG_LABELS[],
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ): void {
    const event = new LogEvent(message, labels, originID, corrID, parentID);
    if (ENV === "development") {
      console.log(event.timestamp.toString(), event.labels, event.message);
    }
    this._log.push(event);
  }
  public toJSON() {
    return this._log;
  }
  public static fromJSON(json: any): Log {
    const log = new Log();
    log._log = json;
    return log;
  }
}
