import {
  ID,
  Type,
  WithDeserialize,
  IResult,
  Result,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { DESERIALIZER_NAME, IoCContainer } from "../ioc-container";

export function deserialize(json: any): IResult {
  const ORIGIN_ID = new ID("6b511d57-99b6-4264-b901-f184b851f378");
  const ResultType = new Type("DeserializeResult");
  const typeString = json.type;
  if (!typeString || typeof typeString !== "string") {
    return new Result(
      `Invalid Entity – No Type string detected: ${json}`,
      BAD_REQUEST,
      ResultType,
      ORIGIN_ID
    );
  }
  const type = new Type(typeString);

  let DeserializerClass: WithDeserialize<any>;
  try {
    DeserializerClass = IoCContainer.getNamed<WithDeserialize<any>>(
      type.toSymbol(),
      DESERIALIZER_NAME
    );
  } catch (error) {
    return new Result(
      `Entity with Type ${typeString} could not be resolved by IoC Container: ${error.toString()}`,
      INTERNAL_SERVER_ERROR,
      ResultType,
      ORIGIN_ID
    );
  }
  return DeserializerClass.fromJSON(json);
}
