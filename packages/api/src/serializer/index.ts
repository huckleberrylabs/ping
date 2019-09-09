import { SerializerFactory } from "@huckleberryai/core";
import { IoCContainer } from "../ioc-container";

export const Serializer = SerializerFactory(IoCContainer);
