import { Either, left, right, isLeft, isRight } from "fp-ts/lib/Either";
import axios from "axios";
import { Observable } from "../../observable";
import { AuthService } from "../auth";
import {
  NameSpaceCaseString,
  UUID,
  Messaging,
  Errors,
  StatusCode,
  Config,
  PersonName,
  PhoneWithCountry,
} from "@huckleberrylabs/ping-core";

export enum ContactStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
  IDLE = "Idle",
}

export const Name = "services:contact" as NameSpaceCaseString.T;

export class ContactService {
  readonly map = new Observable<Map<UUID.T, Messaging.Contact.Model.T>>(
    new Map()
  );
  readonly state = new Observable<Errors.T | ContactStates>(
    ContactStates.UNINITIALIZED
  );
  constructor(private authService: AuthService) {}
  async getByAccount(): Promise<Either<Errors.T, Messaging.Contact.Model.T[]>> {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._getByAccount(id);
    return left(Errors.Unauthenticated.C(Name, "getByAccount"));
  }
  private async _getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.T, Messaging.Contact.Model.T[]>> {
    this.state.set(ContactStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Contact.UseCases.GetByAccount.Route),
        Messaging.Contact.UseCases.GetByAccount.Query.Encode(
          Messaging.Contact.UseCases.GetByAccount.Query.C(account)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        if (Array.isArray(res.data)) {
          const contactsMaybe = res.data.map(Messaging.Contact.Model.Decode);
          if (contactsMaybe.some(isLeft)) {
            const error = Errors.Adapter.C(
              Name,
              `_getByAccount: ${account} has ${
                contactsMaybe.filter(isLeft).length
              } decode errors`,
              "A server error occured, please try again later or contact support."
            );
            this.state.set(error);
            return left(error);
          } else {
            const contacts = contactsMaybe
              .filter(isRight)
              .map((contact) => contact.right);
            this.map.set(new Map(contacts.map((w) => [w.id, w])));
            this.state.set(ContactStates.IDLE);
            return right(contacts);
          }
        } else {
          return left(
            Errors.Adapter.C(
              Name,
              `_getByAccount: ${account} unexpected data: ${JSON.stringify(
                res.data
              )} `,
              "A server error occured, please try again later or contact support."
            )
          );
        }
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        this.state.set(error);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `_getByAccount ${err.message}`);
      this.state.set(error);
      return left(error);
    }
  }
  async get(id: UUID.T): Promise<Either<Errors.T, Messaging.Contact.Model.T>> {
    const map = this.map.get();
    const contact = map.get(id);
    if (contact) return right(contact);
    this.state.set(ContactStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Contact.UseCases.GetByID.Route),
        Messaging.Contact.UseCases.GetByID.Query.Encode(
          Messaging.Contact.UseCases.GetByID.Query.C(id)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const contactMaybe = Messaging.Contact.Model.Decode(res.data);
        if (isLeft(contactMaybe)) {
          this.state.set(contactMaybe.left);
          return contactMaybe;
        } else {
          const contact = contactMaybe.right;
          const map = this.map.get();
          map.set(contact.id, contact);
          this.map.set(map);
          this.state.set(ContactStates.IDLE);
          return right(contact);
        }
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        this.state.set(error);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `get ${err.message}`);
      this.state.set(error);
      return left(error);
    }
  }
  async create(
    phone: PhoneWithCountry.T,
    name?: PersonName.T
  ): Promise<Either<Errors.T, UUID.T>> {
    try {
      const accountID = this.authService.state.get();
      if (!UUID.Is(accountID))
        return left(Errors.Unauthenticated.C(Name, "get"));
      const contact = Messaging.Contact.Model.C(accountID, true, phone, name);
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Contact.UseCases.Create.Route),
        Messaging.Contact.UseCases.Create.Command.Encode(
          Messaging.Contact.UseCases.Create.Command.C(contact)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        await this.get(contact.id);
        return right(contact.id);
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `createWidget ${err.message}`);
      return left(error);
    }
  }
}
