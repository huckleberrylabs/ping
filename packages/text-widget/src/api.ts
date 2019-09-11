import axios, { AxiosResponse } from "axios";
import {
  IResult,
  Result,
  ResultName,
  IEvent,
  IData,
  ISerializedData,
  MessageName,
  IStatusCode,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  ENV,
} from "@huckleberryai/core";
import { API_ENDPOINT, EVENTS_ENDPOINT } from "@huckleberryai/text";
import { serializer, deserializer } from "./structural";

/** will never throw an error */
export async function postEvent<ReturnType extends IData>(
  event: IEvent
): Promise<IResult<ReturnType | string>> {
  if (ENV === "development") {
    // TODO: handle development mode
    throw new Error("not implemented yet");
  } else {
    // serialize the event
    let serializedEvent: ISerializedData;
    try {
      serializedEvent = serializer(event, event.type);
    } catch (error) {
      // the event cannot be serialized during runtime, probably because the correct serializer is missing in the ioc container
      return Result(
        error.toString(),
        MessageName,
        BAD_REQUEST,
        event.origin,
        event.corr,
        event.id
      );
    }
    // send the event
    let res: AxiosResponse<any>;
    try {
      res = await axios.post(API_ENDPOINT + EVENTS_ENDPOINT, serializedEvent, {
        validateStatus: () => true,
      });
    } catch (error) {
      if (error.response) {
        // the request was made and the server responded with a status code that falls out of the range of validateStatus
        return Result(
          "this should never happen. validateStatus should return true.",
          MessageName,
          INTERNAL_SERVER_ERROR,
          event.origin,
          event.corr,
          event.id
        );
      } else {
        // the request was made but no response was received or something happened in setting up the request that triggered an error
        return Result(
          error.toString(),
          MessageName,
          INTERNAL_SERVER_ERROR,
          event.origin,
          event.corr,
          event.id
        );
      }
    }
    // deserialize the response
    try {
      return deserializer<IResult<ReturnType>>(res.data, ResultName);
    } catch (error) {
      // the response received cannot be deserialized by the client, probably because the correct deserializer is missing in the ioc container
      return Result(
        error.toString(),
        MessageName,
        <IStatusCode>res.status,
        event.origin,
        event.corr,
        event.id
      );
    }
  }
}

/** will throw an error if the event is not serializable during runtime */
export async function beaconEvent(event: IEvent): Promise<void> {
  if (ENV === "development") {
    // TODO: handle development mode
    throw new Error("not implemented yet");
  } else {
    navigator.sendBeacon(
      API_ENDPOINT + EVENTS_ENDPOINT,
      JSON.stringify(serializer(event, event.type))
    );
  }
}
