import { Observable } from "../../observable";
import { Either, right } from "fp-ts/lib/Either";

export class AuthService {
  readonly loading = new Observable(true);
  readonly isLoggedIn = new Observable(false);
  readonly accountID = new Observable<string | undefined>(undefined);
  constructor() {
    this.getAccountID();
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
