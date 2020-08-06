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
} from "@huckleberrylabs/ping-core";

export class AuthService {
  readonly state = new Observable<"Unauthenticated" | "Loading" | UUID.T>(
    "Unauthenticated"
  );
  constructor() {
    this.getAccountID();
  }
  async sendLoginEmail(email: EmailAddress.T): Promise<Either<Errors.T, null>> {
    try {
      const res = await axios.post(
        Config.GetEndpoint(IAM.Authentication.UseCases.SendLoginEmail.Route),
        IAM.Authentication.UseCases.SendLoginEmail.Command.Codec.encode(
          IAM.Authentication.UseCases.SendLoginEmail.Command.C(email)
        ),
        {
          validateStatus: () => true,
        }
      );
      return res.status === StatusCode.OK
        ? right(null)
        : left(this.onAPIError(Errors.FromStatusCode(res.status, res.data)));
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  }
  async loginWithToken(
    token: NonEmptyString.T
  ): Promise<Either<Errors.T, null>> {
    try {
      this.state.set("Loading");
      const res = await axios.post(
        Config.GetEndpoint(IAM.Authentication.UseCases.LoginWithToken.Route),
        IAM.Authentication.UseCases.LoginWithToken.Command.Codec.encode(
          IAM.Authentication.UseCases.LoginWithToken.Command.C(token)
        ),
        {
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const idMaybe = UUID.Codec.decode(res.data);
        if (isLeft(idMaybe)) return left(Errors.Parsing.C());
        const id = idMaybe.right;
        this.state.set(id);
        return right(null);
      } else {
        this.state.set("Unauthenticated");
        return left(
          this.onAPIError(Errors.FromStatusCode(res.status, res.data))
        );
      }
    } catch (error) {
      this.state.set("Unauthenticated");
      return left(Errors.Adapter.C());
    }
  }
  async logout(): Promise<Either<Errors.T, null>> {
    try {
      const id = this.state.get();
      if (!UUID.Is(id)) {
        this.state.set("Unauthenticated");
        return right(null);
      }
      this.state.set("Loading");
      const res = await axios.post(
        Config.GetEndpoint(IAM.Authentication.UseCases.Logout.Route),
        IAM.Authentication.UseCases.Logout.Command.Codec.encode(
          IAM.Authentication.UseCases.Logout.Command.C(id)
        ),
        {
          validateStatus: () => true,
        }
      );
      this.state.set("Unauthenticated");
      return res.status === StatusCode.OK
        ? right(null)
        : left(this.onAPIError(Errors.FromStatusCode(res.status, res.data)));
    } catch (error) {
      this.state.set("Unauthenticated");
      return left(Errors.Adapter.C());
    }
  }
  private async getAccountID(): Promise<Either<Errors.T, UUID.T>> {
    try {
      this.state.set("Loading");
      const res = await axios.post(
        Config.GetEndpoint(
          IAM.Authentication.UseCases.GetAccountIDByCookie.Route
        ),
        IAM.Authentication.UseCases.GetAccountIDByCookie.Command.Codec.encode(
          IAM.Authentication.UseCases.GetAccountIDByCookie.Command.C()
        ),
        {
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const idMaybe = UUID.Codec.decode(res.data);
        if (isLeft(idMaybe)) return left(Errors.Parsing.C());
        const id = idMaybe.right;
        this.state.set(id);
        return right(id);
      } else {
        this.state.set("Unauthenticated");
        return left(
          this.onAPIError(Errors.FromStatusCode(res.status, res.data))
        );
      }
    } catch (error) {
      this.state.set("Unauthenticated");
      return left(Errors.Adapter.C());
    }
  }
  onAPIError(err: Errors.T): Errors.T {
    if (Errors.Unauthenticated.Is(err)) this.logout();
    return err;
  }
}
