import { Either } from "fp-ts/lib/Either";
import { Errors, Phone, Country, PhoneWithCountry, UUID } from "../values";
import { Message } from "../messaging";
import { NumberPairing } from "../sms";

export interface ISMSService {
  send: (
    to: PhoneWithCountry.T,
    message: Message.Model.T
  ) => Promise<Either<Errors.Adapter.T, null>>;
  deallocateNumberPairingsByConversation(
    conversation: UUID.T
  ): Promise<Either<Errors.Adapter.T, null>>;
}

export interface INumberPairingRepository {
  getByToAndFrom(
    to: Phone.T,
    from: Phone.T
  ): Promise<
    Either<Errors.Adapter.T | Errors.NotFound.T, NumberPairing.Model.T>
  >;
  getByTo(
    to: Phone.T
  ): Promise<Either<Errors.Adapter.T, NumberPairing.Model.T[]>>;
  deleteByConversaton(
    conversation: UUID.T
  ): Promise<Either<Errors.Adapter.T, null>>;
  save(pairing: NumberPairing.Model.T): Promise<Either<Errors.Adapter.T, null>>;
}

export interface INumberRepository {
  getByCountry(
    country: Country.T
  ): Promise<Either<Errors.Adapter.T, Phone.T[]>>;
  save(number: PhoneWithCountry.T): Promise<Either<Errors.Adapter.T, null>>;
}
