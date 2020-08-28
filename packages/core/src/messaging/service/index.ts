import { isLeft, right, left, isRight } from "fp-ts/lib/Either";
import { isSome, some } from "fp-ts/lib/Option";
import {
  IMessagingService,
  IMessageRepository,
  IConversationRepository,
  IContactRepository,
  IChannelRepository,
  IRouterRepository,
  ISMSService,
} from "../../interfaces";
import {
  Errors,
  PersonName,
  NonEmptyString,
  NameSpaceCaseString,
  UUID,
} from "../../values";
import * as Channel from "../channel";
import * as Contact from "../contact";
import * as Conversation from "../conversation";

export const Name = "messaging:service" as NameSpaceCaseString.T;

export const C = (
  messageRepo: IMessageRepository,
  conversationRepo: IConversationRepository,
  contactRepo: IContactRepository,
  channelRepo: IChannelRepository,
  routerRepo: IRouterRepository,
  sms: ISMSService
): IMessagingService => ({
  createChannel: async (account, channelID, kind) => {
    const channel: Channel.Model.T = {
      type: Channel.Model.Name,
      id: channelID,
      account,
      kind,
    };

    const routerExists = await routerRepo.exists(account);
    if (isLeft(routerExists)) return routerExists;

    if (kind === "sms") {
      const channels = await channelRepo.getByAccount(account);
      if (isLeft(channels)) return channels;

      if (channels.right.filter(channel => channel.kind === "sms").length > 0)
        return left(
          Errors.Validation.C(
            Name,
            "account sms channel already created",
            "Account SMS channel already created."
          )
        );
    }
    return channelRepo.add(channel);
  },
  createContact: async params => {
    const contactMaybe = await contactRepo.getByPhone(
      params.account,
      params.phone.number
    );
    if (isLeft(contactMaybe)) {
      if (contactMaybe.left.type === Errors.NotFound.Name) {
        const contact = Contact.Model.C(
          params.account,
          params.internal,
          params.phone,
          params.name
        );
        const savedMaybe = await contactRepo.add(contact);
        if (isLeft(savedMaybe)) return savedMaybe;
        return right(contact.id);
      }
      return contactMaybe;
    }
    return right(contactMaybe.right.id);
  },
  sendMessage: async message => {
    let convo: Conversation.Model.T;
    const convoExists = isSome(message.conversation);
    if (isSome(message.conversation)) {
      // Retrieve the conversation
      const convoMaybe = await conversationRepo.get(message.conversation.value);
      if (isLeft(convoMaybe)) return convoMaybe;
      convo = convoMaybe.right;
      if (Conversation.Model.IsExpired(convo)) {
        // TODONOW create a system message and send it back to the same contact, through the same channel
        return left(
          Errors.Validation.C(
            Name,
            "sendMessage: conversation expired",
            "This conversation has expired."
          )
        );
      }
    } else {
      // Create a new conversation
      convo = Conversation.Model.C(message.account);

      // Set message.conversation
      message.conversation = some(convo.id);

      // Add message contact to conversation
      const contactMaybe = await contactRepo.get(message.from);
      if (isLeft(contactMaybe)) return contactMaybe;
      const contact = contactMaybe.right;
      const contactAddedMaybe = Conversation.Model.AddContact(convo)(contact);
      if (isLeft(contactAddedMaybe)) return contactAddedMaybe;
      convo = contactAddedMaybe.right;
    }

    // Get Channel
    const channelMaybe = await channelRepo.get(message.channel);
    if (isLeft(channelMaybe)) return channelMaybe;
    const channel = channelMaybe.right;

    // Get Router
    const routerMaybe = await routerRepo.get(channel.account);
    if (isLeft(routerMaybe)) return routerMaybe;
    const router = routerMaybe.right;

    if (!convoExists) {
      // Get Router Contact
      // @ts-ignore
      const contactID = router.routes[channel.id];
      if (!UUID.Is(contactID))
        return left(
          Errors.Validation.C(
            Name,
            "route doesn't exist for this channel",
            "Routing has not been configured for this channel."
          )
        );
      const contactMaybe = await contactRepo.get(contactID);
      if (isLeft(contactMaybe)) return contactMaybe;
      const contact = contactMaybe.right;

      // Add Router Contact if Conversation is Fresh
      const contactAddedMaybe = Conversation.Model.AddContact(convo)(contact);
      if (isLeft(contactAddedMaybe)) return contactAddedMaybe;
      convo = contactAddedMaybe.right;

      // If First Message in Conversation, Modify Content

      // Get Router Contact
      const fromContactMaybe = await contactRepo.get(message.from);
      if (isLeft(fromContactMaybe)) return fromContactMaybe;
      const fromContact = fromContactMaybe.right;

      const printName = (name: PersonName.T) =>
        isSome(name.first) || isSome(name.last)
          ? `${isSome(name.first) ? name.first.value : ""} ${
              isSome(name.last) ? name.last.value : ""
            }`
          : "anonymous";
      message.content = `
        You have a new message from ping:\n    
        ${
          isSome(fromContact.name)
            ? `Name: ${printName(fromContact.name.value)}\n`
            : ""
        }
        Number: ${fromContact.phone.number}\n
        Message:\n
        ${message.content}\n
        ` as NonEmptyString.T;
    }

    // Add message to conversation
    const messageAddedMaybe = Conversation.Model.AddMessage(convo)(message);
    if (isLeft(messageAddedMaybe)) return messageAddedMaybe;
    convo = messageAddedMaybe.right;

    // Send message to contacts (except message.from) based on account or channel routingrecipies
    const recipientIDs = convo.contacts.filter(
      contactID => contactID !== message.from
    );

    const recipientsMaybe = await Promise.all(
      recipientIDs.map(contactRepo.get)
    );
    // TODONOW fix the way messages are sent
    if (recipientsMaybe.some(isLeft)) return recipientsMaybe.filter(isLeft)[0];
    const smsMaybe = await Promise.all(
      recipientsMaybe.map(async recipientMaybe => {
        if (isRight(recipientMaybe)) {
          const recipient = recipientMaybe.right;
          return await sms.send(recipient.phone, message);
        }
        return recipientMaybe;
      })
    );
    if (smsMaybe.some(isLeft)) return smsMaybe.filter(isLeft)[0];

    // Save message to the repository
    const msgSavedMaybe = await messageRepo.add(message);
    if (isLeft(msgSavedMaybe)) return msgSavedMaybe;

    // Save convo to the repository
    const savedMaybe = convoExists
      ? await conversationRepo.update(convo)
      : await conversationRepo.add(convo);
    if (isLeft(savedMaybe)) return savedMaybe;
    return right(null);
  },
});
