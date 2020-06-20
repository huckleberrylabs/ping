import { isLeft, right } from "fp-ts/lib/Either";
import { isSome, some } from "fp-ts/lib/Option";
import {
  IMessagingService,
  IContactRepository,
  IConversationRepository,
} from "../../interfaces";
import { Errors } from "../../values";
import * as Contact from "../contact";
import * as Conversation from "../conversation";

export const C = (
  contactRepo: IContactRepository,
  conversationRepo: IConversationRepository
): IMessagingService => ({
  createContact: async params => {
    // TODO include context info on Contact Create
    const contactMaybe = await contactRepo.getByPhone(params.phone);
    if (isLeft(contactMaybe)) {
      if (contactMaybe.left.type === Errors.NotFound.Name) {
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
    // TODO check account in repo method
    if (existingContact.account !== params.account) {
      const contact = Contact.Model.C(
        params.account,
        params.phone,
        params.name
      );
      const savedMaybe = await contactRepo.add(contact);
      if (isLeft(savedMaybe)) return savedMaybe;
      return right(contact.id);
    }
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

      // TODO Create a new conversation if expired

      // TODO If expired, create a system message and send it back to the same contact, through the same channel
    } else {
      // Create a new conversation
      convo = Conversation.Model.C(message.account);

      // Set message.conversation
      message.conversation = some(convo.id);

      // TODO Add message contact to conversation

      // TODO Add other contact(s) to conversation based on account or channel routingrecipies
    }

    // Add message to conversation
    const addedMaybe = Conversation.Model.AddMessage(convo)(message);
    if (isLeft(addedMaybe)) return addedMaybe;

    // TODO Send message to contacts (except message.from) based on account or channel routingrecipies

    // TODO Save message to the repository

    // Save convo to the repository
    const savedMaybe = convoExists
      ? await conversationRepo.update(convo)
      : await conversationRepo.add(convo);
    if (isLeft(savedMaybe)) return savedMaybe;

    return right(null);
  },
});
