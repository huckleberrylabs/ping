import { Event } from "../base";

const AppLoadedEventType = Symbol("AppLoadedEvent");
export class AppLoadedEvent extends Event {
  public get type(): symbol {
    return AppLoadedEventType;
  }
  public static get type(): symbol {
    return AppLoadedEventType;
  }
}
