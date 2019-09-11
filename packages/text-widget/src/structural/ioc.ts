import "reflect-metadata";
import { Container } from "inversify";
import {
  TextSerializerModule,
  TextDeserializerModule,
} from "@huckleberryai/text/src/structural";
import {
  CoreSerializerModule,
  CoreDeserializerModule,
} from "@huckleberryai/core/src/structural";

const IoC = new Container();
IoC.load(
  CoreSerializerModule,
  CoreDeserializerModule,
  TextSerializerModule,
  TextDeserializerModule
);

export { IoC };
