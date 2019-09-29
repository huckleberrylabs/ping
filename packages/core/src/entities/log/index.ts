import { Type, IsNonNullObject } from "../../value-objects";
import { ILogEvent, IsLogEvent } from "../log-event";

export const LogType = "log";

export interface ILog {
  type: Type;
  log: ILogEvent[];
}

export const Log = (): ILog => ({
  type: LogType,
  log: [],
});

export const IsLog = (input: unknown): input is ILog =>
  IsNonNullObject(input) &&
  input.type === LogType &&
  Array.isArray(input.log) &&
  input.log.every(IsLogEvent);
