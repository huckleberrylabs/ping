import { EventBusFactory } from "@huckleberryai/core";
import { IoCContainer } from "../ioc-container";

export const EventBus = EventBusFactory(IoCContainer);
