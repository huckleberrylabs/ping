import { Event } from "@huckleberry/core";

const TextAppLoadedEventType = Symbol.for("TextAppLoadedEvent");
export class AppLoadedEvent extends Event {
  public get type(): symbol {
    return TextAppLoadedEventType;
  }
  public static get type(): symbol {
    return TextAppLoadedEventType;
  }
}
