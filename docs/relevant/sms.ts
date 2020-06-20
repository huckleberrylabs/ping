import { Either, left } from "fp-ts/lib/Either";
import {
  UUID,
  Phone,
  TimeStamp,
  NonEmptyString,
  Errors,
} from "../../src/domain/value-objects";
import { IMessage } from "../../src/interfaces";

// Value Object
type TwilioPhone = Phone.T;

// these should stay the same always, and draw from a different number pool than Dynamic Pairings
// Database Model
export type SMSStaticNumberPairing = {
  account: UUID.T;
  conversation: UUID.T;
  contact: Phone.T;
  twilio: TwilioPhone;
  lastActive: TimeStamp.T;
};

/* 
Could be just inside, outside, twilio
However, it is possible that we may want to introduce
group conversations, or Outside-Outside conversations,
or Inside-Inside conversations

avoiding collisions is key, initially we will keep buying numbers
but at some point collisions may be necessary to keep costs down,
so tracking contact type is importance (avoid collisions for Inside over Outside)
and tracking last time the pairing was used is also important
*/
// Database Model
export type SMSDynamicNumberPairing = {
  account: UUID.T;
  conversation: UUID.T;
  contact: Phone.T;
  twilio: TwilioPhone;
  lastActive: TimeStamp.T;
};

/**
 *
 * @param static
 * @param to
 * @param content
 *
 * if no conversation ID, use StaticNumberPairing (i.e. not proxied)
 */
export const send = (
  account: UUID.T,
  to: Phone.T[],
  conversation: UUID.T,
  content: NonEmptyString.T
): Either<Errors.T, null> => {
  return left(Errors.NotImplemented.C());
};

/**
 *
 * @param account
 * @param to
 * @param from
 * @param content
 *
 * using the combination of twilio and contact phone we can look up the conversation ID
 * messages sent that dont have a matching ContactPhone * TwilioPhone pairing are sent with no conversation ID,
 * account is determined by lastActive NumberPairing including this number? or maybe not at all. We will
 * have to gather data to see if this is worth implementing
 *
 */
export const receive = (
  account: UUID.T,
  to: TwilioPhone,
  from: Phone.T,
  content: NonEmptyString.T
): Either<Errors.T, IMessage> => {
  return left(Errors.NotImplemented.C());
};
