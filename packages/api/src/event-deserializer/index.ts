import { Container } from "inversify";
import { Type, IEvent, IEventStatic } from "@huckleberryai/core";
import { EVENT_NAME, IoCContainer } from "../ioc-container";

class EventDeserializer {
  public constructor(private container: Container) {}
  public deserialize(json: any): IEvent {
    const { typeString } = json;
    if (!typeString || typeof typeString === "string") {
      throw new Error(`Invalid Event ${json}: No Type string detected`);
    }
    const type = new Type(typeString);
    const EventClass = this.container.getNamed<IEventStatic>(
      type.toSymbol(),
      EVENT_NAME
    );
    if (!EventClass) {
      throw new Error(
        `Invalid Event ${typeString}: Could not be resolved by IoC Container`
      );
    }
    return EventClass.fromJSON(json);
  }
}

export const deserializer = new EventDeserializer(IoCContainer);
