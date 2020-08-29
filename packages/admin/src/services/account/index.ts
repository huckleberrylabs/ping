import { left, isLeft, right, Either } from "fp-ts/lib/Either";
import axios from "axios";
import { Observable } from "../../observable";
import { AuthService } from "../auth";
import {
  Config,
  IAM,
  Customers,
  UUID,
  Errors,
  StatusCode,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";

export enum AccountStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
}

export const Name = "services:account" as NameSpaceCaseString.T;
export class AccountService {
  readonly state = new Observable<
    IAM.Account.Model.T | Errors.T | AccountStates
  >(AccountStates.UNINITIALIZED);
  constructor(private authService: AuthService) {}
  async get(): Promise<Either<Errors.T, IAM.Account.Model.T>> {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._get(id);
    return left(Errors.Unauthenticated.C(Name, "get"));
  }
  private async _get(
    id: UUID.T
  ): Promise<Either<Errors.T, IAM.Account.Model.T>> {
    this.state.set(AccountStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(IAM.Account.UseCases.GetByID.Route),
        IAM.Account.UseCases.GetByID.Query.Encode(
          IAM.Account.UseCases.GetByID.Query.C(id)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const accountMaybe = IAM.Account.Model.Decode(res.data);
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
    command: IAM.Account.UseCases.Update.Command.T
  ): Promise<Either<Errors.T, null>> {
    this.state.set(AccountStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(IAM.Account.UseCases.Update.Route),
        IAM.Account.UseCases.Update.Command.Encode(command),
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
  async deregister(): Promise<Either<Errors.T, null>> {
    this.state.set(AccountStates.LOADING);
    try {
      const id = this.authService.state.get();
      if (!UUID.Is(id))
        return left(Errors.Adapter.C(Name, "not logged in", "Not Logged In."));
      const res = await axios.post(
        Config.GetEndpoint(Customers.UseCases.Deregister.Route),
        Customers.UseCases.Deregister.Command.Encode(
          Customers.UseCases.Deregister.Command.C(id)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        await this.get();
        await this.authService.logout();
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
