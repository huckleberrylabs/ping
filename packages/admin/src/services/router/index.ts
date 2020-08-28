import { Either, left, right, isLeft } from "fp-ts/lib/Either";
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

export enum RouterStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
  IDLE = "Idle",
}

export const Name = "services:router" as NameSpaceCaseString.T;

export class RouterService {
  readonly state = new Observable<
    Messaging.Router.Model.T | Errors.T | RouterStates
  >(RouterStates.UNINITIALIZED);
  constructor(private authService: AuthService) {}
  async get(): Promise<Either<Errors.T, Messaging.Router.Model.T>> {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._get(id);
    return left(Errors.Unauthenticated.C(Name, "get"));
  }
  private async _get(
    id: UUID.T
  ): Promise<Either<Errors.T, Messaging.Router.Model.T>> {
    this.state.set(RouterStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Router.UseCases.GetByID.Route),
        Messaging.Router.UseCases.GetByID.Query.Encode(
          Messaging.Router.UseCases.GetByID.Query.C(id)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const accountMaybe = Messaging.Router.Model.Decode(res.data);
        if (isLeft(accountMaybe)) {
          return accountMaybe;
        } else {
          const account = accountMaybe.right;
          this.state.set(account);
          return right(account);
        }
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        this.state.set(error);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `_get ${err.message}`);
      this.state.set(error);
      return left(error);
    }
  }
  async update(
    command: Messaging.Router.UseCases.Update.Command.T
  ): Promise<Either<Errors.T, null>> {
    this.state.set(RouterStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Messaging.Router.UseCases.Update.Route),
        Messaging.Router.UseCases.Update.Command.Encode(command),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        await this.get();
        return right(null);
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        this.state.set(error);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `update ${err.message}`);
      this.state.set(error);
      return left(error);
    }
  }
}
