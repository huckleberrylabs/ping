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
} from "@huckleberrylabs/ping-core";

export enum MessageStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
  IDLE = "Idle",
}

export const Name = "services:message" as NameSpaceCaseString.T;

export class MessageService {
  readonly map = new Observable<Map<UUID.T, Messaging.Message.Model.T>>(
    new Map()
  );
  readonly state = new Observable<Errors.T | MessageStates>(
    MessageStates.UNINITIALIZED
  );
  constructor(private authService: AuthService) {}
  async getByAccount(): Promise<Either<Errors.T, Messaging.Message.Model.T[]>> {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._getByAccount(id);
    return left(Errors.Unauthenticated.C(Name, "getByAccount"));
  }
  private async _getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.T, Messaging.Message.Model.T[]>> {
    this.state.set(MessageStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Message.UseCases.GetByAccount.Route),
        Messaging.Message.UseCases.GetByAccount.Query.Encode(
          Messaging.Message.UseCases.GetByAccount.Query.C(account)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        if (Array.isArray(res.data)) {
          const messagesMaybe = res.data.map(Messaging.Message.Model.Decode);
          if (messagesMaybe.some(isLeft)) {
            const error = Errors.Adapter.C(
              Name,
              `_getByAccount: ${account} has ${
                messagesMaybe.filter(isLeft).length
              } decode errors`,
              "A server error occured, please try again later or contact support."
            );
            this.state.set(error);
            return left(error);
          } else {
            const messages = messagesMaybe
              .filter(isRight)
              .map((message) => message.right);
            this.map.set(new Map(messages.map((w) => [w.id, w])));
            this.state.set(MessageStates.IDLE);
            return right(messages);
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
}
