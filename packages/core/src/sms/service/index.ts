import { left, right, isLeft } from "fp-ts/lib/Either";
import {
  ITwilio,
  ISMSService,
  INumberPairingRepository,
  INumberRepository,
} from "../../interfaces";
import { Errors } from "../../values";
import { isSome } from "fp-ts/lib/Option";
import * as NumberPairing from "../number-pairing";

export const C = (
  client: ITwilio,
  numberRepo: INumberRepository,
  pairingRepo: INumberPairingRepository
): ISMSService => ({
  send: async (to, message) => {
    try {
      console.log("SMS SEND");
      // Cannot send a message through this channel without a conversation already created
      if (!isSome(message.conversation)) return left(Errors.Validation.C());
      const conversation = message.conversation.value;
      console.log(conversation);

      // Get all existing pairings by receiving phone number
      const pairingsMaybe = await pairingRepo.getByTo(to.phone);
      console.log(pairingsMaybe);
      if (isLeft(pairingsMaybe)) return pairingsMaybe;
      const candidatePairings = pairingsMaybe.right;

      let pairing;

      // If a pairing exists for the conversation, use it
      if (candidatePairings.some(pair => pair.conversation === conversation)) {
        pairing = candidatePairings.filter(
          pair => pair.conversation === conversation
        )[0];
      } else {
        // Get all existing numbers by country
        const numbersMaybe = await numberRepo.getByCountry(to.country);
        console.log(numbersMaybe);
        // Return if another error
        if (isLeft(numbersMaybe)) return numbersMaybe;
        const numbers = numbersMaybe.right;

        // Filter out by existing pairings
        const candidateNumbers = numbers.filter(
          num => !candidatePairings.some(pair => pair.from === num)
        );

        let from = candidateNumbers[0];

        // If there is no number, buy one.
        if (candidateNumbers.length === 0) {
          // TODONOW Buy Number. assign to "from" and save number to Repo
          /* client
            .availablePhoneNumbers(client.TWILIO_ACCOUNT_SID)
            .local.list({ smsEnabled: true }); */
          return left(Errors.Adapter.C());
        }

        // Create a new Pairing
        pairing = NumberPairing.Model.C(
          message.account,
          conversation,
          to.phone,
          from
        );

        // Save the new pairing
        const savedMaybe = await pairingRepo.save(pairing);
        console.log(savedMaybe);
        if (isLeft(savedMaybe)) return left(Errors.Adapter.C());
      }

      // Send the Message
      await client.messages.create({
        body: message.content,
        to: pairing.to,
        from: pairing.from,
      });

      return right(null);
    } catch (error) {
      console.log(error);
      return left(Errors.Adapter.C());
    }
  },
  deallocateNumberPairingsByConversation: async conversation => {
    return pairingRepo.deleteByConversaton(conversation);
  },
});
