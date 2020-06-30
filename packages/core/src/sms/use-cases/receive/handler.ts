import { isLeft, Either } from "fp-ts/lib/Either";
import { Message } from "../../../messaging";
import { Errors, UUID } from "../../../values";
import {
  INumberPairingRepository,
  IMessagingService,
  IContactRepository,
} from "../../../interfaces";
import * as Command from "./command";
import { some } from "fp-ts/lib/Option";

export type IHandler = (
  command: Command.T
) => Promise<
  Either<Errors.NotFound.T | Errors.Validation.T | Errors.Adapter.T, null>
>;

export default (
  pairingRepo: INumberPairingRepository,
  contactRepo: IContactRepository,
  messaging: IMessagingService
): IHandler => async command => {
  // TODO figure out what to do with the Channel ID
  const channelID = "b904d8c3-1238-4286-a63a-18866d3cbf3f" as UUID.T;

  // Get pairing
  const pairingMaybe = await pairingRepo.getByToAndFrom(
    command.to,
    command.from
  );
  if (isLeft(pairingMaybe)) return pairingMaybe;
  const pairing = pairingMaybe.right;

  // Get contact by phone
  const contactMaybe = await contactRepo.getByPhone(
    pairing.account,
    pairing.to
  );
  if (isLeft(contactMaybe)) return contactMaybe;
  const contact = contactMaybe.right;

  // Create the Message
  const message: Message.Model.T = {
    id: UUID.C(),
    timestamp: command.timestamp,
    content: command.content,
    from: contact.id,
    account: pairing.account,
    channel: channelID,
    conversation: some(pairing.conversation),
  };

  // Send the Message
  return messaging.sendMessage(message);
};
