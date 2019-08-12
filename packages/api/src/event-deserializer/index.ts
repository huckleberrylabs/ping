import { Type, IEvent, IEventStatic } from "@huckleberryai/core";
import { EVENT_NAME, IoCContainer } from "../ioc-container";

export function deserialize(json: any): IEvent {
  const typeString = json.type;
  if (!typeString || typeof typeString !== "string") {
    throw new Error(`Invalid Event ${json}: No Type string detected`);
  }
  const type = new Type(typeString);
  try {
    const EventClass = IoCContainer.getNamed<IEventStatic>(
      type.toSymbol(),
      EVENT_NAME
    );
    return EventClass.fromJSON(json);
  } catch (error) {
    throw new Error(
      `Invalid Event ${typeString}: Could not be resolved by IoC Container`
    );
  }
}
