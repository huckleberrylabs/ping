import "reflect-metadata";
import { Container } from "inversify";
import {
  TextSerializerModule,
  TextDeserializerModule,
} from "@huckleberryai/text/src/structural";

const IoC = new Container();
IoC.load(TextSerializerModule, TextDeserializerModule);

export { IoC };
