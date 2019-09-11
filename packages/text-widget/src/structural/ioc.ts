import "reflect-metadata";
import { Container } from "inversify";
import {
  TextSerializerModule,
  TextDeserializerModule,
} from "@huckleberryai/text";
import {
  CoreSerializerModule,
  CoreDeserializerModule,
} from "@huckleberryai/core";

const IoC = new Container();
IoC.load(
  CoreSerializerModule,
  CoreDeserializerModule,
  TextSerializerModule,
  TextDeserializerModule
);

export { IoC };
