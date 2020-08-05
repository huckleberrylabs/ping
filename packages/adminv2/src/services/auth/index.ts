// import axios from "axios";
import { Observable } from "../../observable";
import { Either, right, left } from "fp-ts/lib/Either";
import { EmailAddress, Errors } from "@huckleberrylabs/ping-core/lib/values";
/* import {
  Route,
  Command,
} from "@huckleberrylabs/ping-core/lib/iam/authentication/use-cases/send-login-email"; */

console.log(EmailAddress.Codec);

export class AuthService {
  readonly loading = new Observable(true);
  readonly isLoggedIn = new Observable(false);
  readonly accountID = new Observable<string | undefined>(undefined);
  constructor() {
    this.getAccountID();
  }
  async sendLoginEmail(email: EmailAddress.T): Promise<Either<Errors.T, null>> {
    /*     const res = await axios.post(
      Config.GetEndpoint(Route),
      Command.Codec.encode(Command.C(email)),
      {
        validateStatus: () => true,
      }
    );
    if (res.status === 200) return right(null); */
    return left(Errors.Adapter.C());
  }
  // TODO update return Type
  async loginWithToken(token: string): Promise<Either<null, null>> {
    this.loading.set(true);
    // TODO API Request
    this.isLoggedIn.set(true);
    this.accountID.set("123");
    this.loading.set(false);
    return right(null);
  }
  async logout() {
    this.loading.set(true);
    // TODO API Request
    this.isLoggedIn.set(false);
    this.accountID.set(undefined);
    this.loading.set(false);
  }
  private async getAccountID() {
    this.loading.set(true);
    // TODO API Request
    this.isLoggedIn.set(true);
    this.accountID.set("123");
    this.loading.set(false);
  }
  // TODO update with Error Type
  onAPIError<Err>(err: Err): Err {
    this.logout();
    return err;
  }
}
