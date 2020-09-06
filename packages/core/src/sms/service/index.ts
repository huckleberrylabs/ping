import { left, right, isLeft } from "fp-ts/lib/Either";
import {
  ITwilio,
  ISMSService,
  INumberPairingRepository,
  INumberRepository,
} from "../../interfaces";
import { Errors, NameSpaceCaseString, PhoneWithCountry } from "../../values";
import { isSome } from "fp-ts/lib/Option";
import * as NumberPairing from "../number-pairing";
import * as Config from "../../config";
import * as UseCases from "../use-cases";

export const Name = "sms:service" as NameSpaceCaseString.T;

export const C = (
  client: ITwilio,
  numberRepo: INumberRepository,
  pairingRepo: INumberPairingRepository
): ISMSService => ({
  send: async (to, message) => {
    try {
      // Cannot send a message through this channel without a conversation already created
      if (!isSome(message.conversation))
        return left(
          Errors.Validation.C(
            Name,
            "send: message has no conversation.",
            "SMS requires a pre-existing conversation before passing along messages."
          )
        );
      const conversation = message.conversation.value;

      // Get all existing pairings by receiving phone number
      const pairingsMaybe = await pairingRepo.getByTo(to.number);
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
          try {
            const list = await client
              .availablePhoneNumbers(to.country)
              .local.list({ smsEnabled: true });
            const number = list[0].phoneNumber;
            await client.incomingPhoneNumbers.create({
              phoneNumber: number,
              smsUrl: Config.GetEndpoint(UseCases.Receive.Route),
            });
            const phoneMaybe = PhoneWithCountry.C(number, to.country);
            if (isLeft(phoneMaybe)) {
              throw new Error("phone couldn't be parsed");
            }
            const saved = await numberRepo.save(phoneMaybe.right);
            if (isLeft(saved)) return saved;
            from = phoneMaybe.right.number;
          } catch (error) {
            return left(
              Errors.Adapter.C(
                Name,
                `send: couldn't purchase number: ${error.message}`,
                "Server error, please try again later or contact support."
              )
            );
          }
        }

        // Create a new Pairing
        pairing = NumberPairing.Model.C(
          message.account,
          conversation,
          to.number,
          from
        );

        // Save the new pairing
        const savedMaybe = await pairingRepo.save(pairing);
        if (isLeft(savedMaybe))
          return left(
            Errors.Adapter.C(
              Name,
              "send: could not save to pairing repo.",
              "Server error, please try again later or contact support."
            )
          );
      }

      // Send the Message
      await client.messages.create({
        body: message.content,
        to: pairing.to,
        from: pairing.from,
      });

      return right(null);
    } catch (err) {
      return left(
        Errors.Adapter.C(
          Name,
          `send: ${err.message}`,
          "Server error, please try again later or contact support."
        )
      );
    }
  },
  deallocateNumberPairingsByConversation: async conversation => {
    return pairingRepo.deleteByConversaton(conversation);
  },
});
