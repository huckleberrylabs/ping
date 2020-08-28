import axios from "axios";
import { Observable } from "../../observable";
import { Either, right, left, isLeft } from "fp-ts/lib/Either";
import {
  IAM,
  Config,
  EmailAddress,
  Errors,
  NonEmptyString,
  UUID,
  StatusCode,
  NameSpaceCaseString,
} from "@huckleberrylabs/ping-core";

export enum AuthStates {
  UNINITIALIZED = "Uninitialized",
  UNAUTHENTICATED = "Unauthenticated",
  LOADING = "Loading",
}

export const Name = "services:auth" as NameSpaceCaseString.T;
export class AuthService {
  readonly state = new Observable<AuthStates | UUID.T>(
    AuthStates.UNINITIALIZED
  );
  async sendLoginEmail(email: EmailAddress.T): Promise<Either<Errors.T, null>> {
    try {
      const res = await axios.post(
        Config.GetEndpoint(IAM.Authentication.UseCases.SendLoginEmail.Route),
        IAM.Authentication.UseCases.SendLoginEmail.Command.Encode(
          IAM.Authentication.UseCases.SendLoginEmail.Command.C(email)
        ),
        { withCredentials: true, validateStatus: () => true }
      );
      return res.status === StatusCode.OK
        ? right(null)
        : left(this.onAPIError(Errors.FromStatusCode(res.status, res.data)));
    } catch (err) {
      const error = Errors.Adapter.C(Name, `sendLoginEmail ${err.message}`);
      return left(error);
    }
  }
  async loginWithToken(
    token: NonEmptyString.T
  ): Promise<Either<Errors.T, null>> {
    try {
      this.state.set(AuthStates.LOADING);
      const res = await axios.post(
        Config.GetEndpoint(IAM.Authentication.UseCases.LoginWithToken.Route),
        IAM.Authentication.UseCases.LoginWithToken.Command.Encode(
          IAM.Authentication.UseCases.LoginWithToken.Command.C(token)
        ),
        { withCredentials: true, validateStatus: () => true }
      );
      if (res.status === StatusCode.OK) {
        const idMaybe = UUID.Decode(res.data);
        if (isLeft(idMaybe)) {
          this.state.set(AuthStates.UNAUTHENTICATED);
          return idMaybe;
        } else {
          const id = idMaybe.right;
          this.state.set(id);
          return right(null);
        }
      } else {
        this.state.set(AuthStates.UNAUTHENTICATED);
        return left(
          this.onAPIError(Errors.FromStatusCode(res.status, res.data))
        );
      }
    } catch (err) {
      this.state.set(AuthStates.UNAUTHENTICATED);
      const error = Errors.Adapter.C(Name, `loginWithToken ${err.message}`);
      return left(error);
    }
  }
  async logout(): Promise<Either<Errors.T, null>> {
    try {
      const id = this.state.get();
      if (!UUID.Is(id)) {
        this.state.set(AuthStates.UNAUTHENTICATED);
        return right(null);
      }
      this.state.set(AuthStates.LOADING);
      const res = await axios.post(
        Config.GetEndpoint(IAM.Authentication.UseCases.Logout.Route),
        IAM.Authentication.UseCases.Logout.Command.Encode(
          IAM.Authentication.UseCases.Logout.Command.C(id)
        ),
        { withCredentials: true, validateStatus: () => true }
      );
      this.state.set(AuthStates.UNAUTHENTICATED);
      return res.status === StatusCode.OK
        ? right(null)
        : left(this.onAPIError(Errors.FromStatusCode(res.status, res.data)));
    } catch (err) {
      this.state.set(AuthStates.UNAUTHENTICATED);
      const error = Errors.Adapter.C(Name, `logout ${err.message}`);
      return left(error);
    }
  }
  async getAccountID(): Promise<Either<Errors.T, UUID.T>> {
    try {
      this.state.set(AuthStates.LOADING);
      const res = await axios.post(
        Config.GetEndpoint(
          IAM.Authentication.UseCases.GetAccountIDByCookie.Route
        ),
        IAM.Authentication.UseCases.GetAccountIDByCookie.Query.Encode(
          IAM.Authentication.UseCases.GetAccountIDByCookie.Query.C()
        ),
        { withCredentials: true, validateStatus: () => true }
      );
      if (res.status === StatusCode.OK) {
        const idMaybe = UUID.Decode(res.data);
        if (isLeft(idMaybe)) {
          this.state.set(AuthStates.UNAUTHENTICATED);
          return idMaybe;
        } else {
          const id = idMaybe.right;
          this.state.set(id);
          return right(id);
        }
      } else {
        this.state.set(AuthStates.UNAUTHENTICATED);
        return left(
          this.onAPIError(Errors.FromStatusCode(res.status, res.data))
        );
      }
    } catch (err) {
      this.state.set(AuthStates.UNAUTHENTICATED);
      const error = Errors.Adapter.C(Name, `getAccountID ${err.message}`);
      return left(error);
    }
  }
  onAPIError(err: Errors.T): Errors.T {
    if (Errors.Unauthenticated.Is(err)) this.logout();
    return err;
  }
}
