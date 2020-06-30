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
import { Errors } from "../../values";
import * as Channel from "../channel";
import * as Contact from "../contact";
import * as Conversation from "../conversation";

export const C = (
  messageRepo: IMessageRepository,
  conversationRepo: IConversationRepository,
  contactRepo: IContactRepository,
  channelRepo: IChannelRepository,
  routerRepo: IRouterRepository,
  sms: ISMSService
): IMessagingService => ({
  createChannel: async (account, router, channelID) => {
    const channel: Channel.Model.T = {
      id: channelID,
      router,
      account,
    };
    return channelRepo.add(channel);
  },
  createContact: async params => {
    const contactMaybe = await contactRepo.getByPhone(
      params.account,
      params.phone.phone
    );
    if (isLeft(contactMaybe)) {
      if (contactMaybe.left.type === Errors.NotFound.Name) {
        // TODO include context info on Contact Create
        const contact = Contact.Model.C(
          params.account,
          params.phone,
          params.name
        );
        const savedMaybe = await contactRepo.add(contact);
        if (isLeft(savedMaybe)) return savedMaybe;
        return right(contact.id);
      }
      return contactMaybe;
    }
    const existingContact = contactMaybe.right;
    return right(existingContact.id);
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
        // TODO create a system message and send it back to the same contact, through the same channel
        return left(Errors.Validation.C());
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

    // Add message to conversation
    const messageAddedMaybe = Conversation.Model.AddMessage(convo)(message);
    if (isLeft(messageAddedMaybe)) return messageAddedMaybe;
    convo = messageAddedMaybe.right;

    // Get Channel
    const channelMaybe = await channelRepo.get(message.channel);
    if (isLeft(channelMaybe)) return channelMaybe;
    const channel = channelMaybe.right;

    // Get Router
    const routerMaybe = await routerRepo.get(channel.router);
    if (isLeft(routerMaybe)) return routerMaybe;
    const router = routerMaybe.right;

    if (!convoExists) {
      // Get Router Contact
      const contactMaybe = await contactRepo.get(router.contact);
      if (isLeft(contactMaybe)) return contactMaybe;
      const contact = contactMaybe.right;

      // Add Router Contact if Conversation is Fresh
      const contactAddedMaybe = Conversation.Model.AddContact(convo)(contact);
      if (isLeft(contactAddedMaybe)) return contactAddedMaybe;
      convo = contactAddedMaybe.right;
    }

    // Send message to contacts (except message.from) based on account or channel routingrecipies
    const recipientIDs = convo.contacts.filter(
      contactID => contactID !== message.from
    );

    const recipientsMaybe = await Promise.all(
      recipientIDs.map(contactRepo.get)
    );
    // TODO fix the way messages are sent
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
