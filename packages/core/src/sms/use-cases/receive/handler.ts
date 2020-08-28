import { isLeft, Either, left } from "fp-ts/lib/Either";
import { Message } from "../../../messaging";
import { Errors, UUID } from "../../../values";
import {
  INumberPairingRepository,
  IMessagingService,
  IContactRepository,
  IChannelRepository,
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
  channelRepo: IChannelRepository,
  messaging: IMessagingService
): IHandler => async command => {
  // Get pairing
  const pairingMaybe = await pairingRepo.getByPhones(
    command.from,
    command.twilio
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

  // Get Channel
  const channelsMaybe = await channelRepo.getByAccount(pairing.account);
  if (isLeft(channelsMaybe)) return channelsMaybe;
  const channel = channelsMaybe.right.filter(
    channel => channel.kind === "sms"
  )[0];
  if (!channel)
    return left(
      Errors.Adapter.C(
        Command.Name,
        `No channel exists in sms-receive use case`,
        `Channel not found.`
      )
    );

  // Create the Message
  const message: Message.Model.T = {
    type: Message.Model.Name,
    id: UUID.C(),
    timestamp: command.timestamp,
    content: command.content,
    from: contact.id,
    account: pairing.account,
    channel: channel.id,
    conversation: some(pairing.conversation),
    meta: {},
  };

  // Send the Message
  return messaging.sendMessage(message);
};
