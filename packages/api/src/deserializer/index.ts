import { DeserializerFactory } from "@huckleberryai/core";
import { IoCContainer } from "../ioc-container";

export const Deserializer = DeserializerFactory(IoCContainer);
