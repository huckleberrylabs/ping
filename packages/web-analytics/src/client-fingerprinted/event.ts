import {
  IEvent,
  Event,
  UUID,
  IsNonNullObject,
  IsEvent,
  IsUUID,
} from "@huckleberryai/core";
import { FingerPrint, IsFingerPrint } from "./models";

const ClientFingerPrintedEventType = "client-fingerprinted-event";

export interface IClientFingerPrintedEvent extends IEvent {
  widget: UUID | null;
  fingerprint: FingerPrint;
}

export const ClientFingerPrintedEvent = (
  fingerprint: FingerPrint,
  widget: UUID | null,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IClientFingerPrintedEvent => {
  const event = Event(
    ClientFingerPrintedEventType,
    origin,
    corr,
    parent,
    agent
  );
  return {
    ...event,
    widget,
    fingerprint,
  };
};

export const IsClientFingerPrintedEvent = (
  input: unknown
): input is IClientFingerPrintedEvent =>
  IsNonNullObject(input) &&
  IsEvent(input) &&
  input.type === ClientFingerPrintedEventType &&
  (IsUUID(input.widget) || input.widget === null) &&
  IsFingerPrint(input.fingerprint);
