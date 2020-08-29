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

export enum ConversationStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
  IDLE = "Idle",
}

export const Name = "services:conversation" as NameSpaceCaseString.T;

export class ConversationService {
  readonly map = new Observable<Map<UUID.T, Messaging.Conversation.Model.T>>(
    new Map()
  );
  readonly state = new Observable<Errors.T | ConversationStates>(
    ConversationStates.UNINITIALIZED
  );
  constructor(private authService: AuthService) {}
  async getByAccount(): Promise<
    Either<Errors.T, Messaging.Conversation.Model.T[]>
  > {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._getByAccount(id);
    return left(Errors.Unauthenticated.C(Name, "getByAccount"));
  }
  private async _getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.T, Messaging.Conversation.Model.T[]>> {
    this.state.set(ConversationStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Conversation.UseCases.GetByAccount.Route),
        Messaging.Conversation.UseCases.GetByAccount.Query.Encode(
          Messaging.Conversation.UseCases.GetByAccount.Query.C(account)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        if (Array.isArray(res.data)) {
          const conversationsMaybe = res.data.map(
            Messaging.Conversation.Model.Decode
          );
          if (conversationsMaybe.some(isLeft)) {
            const error = Errors.Adapter.C(
              Name,
              `_getByAccount: ${account} has ${
                conversationsMaybe.filter(isLeft).length
              } decode errors`,
              "A server error occured, please try again later or contact support."
            );
            this.state.set(error);
            return left(error);
          } else {
            const conversations = conversationsMaybe
              .filter(isRight)
              .map((conversation) => conversation.right);
            this.map.set(new Map(conversations.map((w) => [w.id, w])));
            this.state.set(ConversationStates.IDLE);
            return right(conversations);
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
