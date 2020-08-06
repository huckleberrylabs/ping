import { left, isLeft, right, Either } from "fp-ts/lib/Either";
import axios from "axios";
import { Observable } from "../../observable";
import { AuthService } from "../auth";
import {
  Config,
  IAM,
  UUID,
  Errors,
  StatusCode,
} from "@huckleberrylabs/ping-core";

export class AccountService {
  readonly state = new Observable<
    IAM.Account.Model.T | Errors.T | "Loading" | "Unitialized"
  >("Unitialized");
  constructor(private authService: AuthService) {
    this.authService.state.subscribe((state) => {
      if (UUID.Is(state)) this._get(state);
    });
  }
  async get(): Promise<Either<Errors.T, IAM.Account.Model.T>> {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._get(id);
    return left(Errors.Unauthenticated.C());
  }
  private async _get(
    id: UUID.T
  ): Promise<Either<Errors.T, IAM.Account.Model.T>> {
    this.state.set("Loading");
    try {
      const res = await axios.post(
        Config.GetEndpoint(IAM.Account.UseCases.GetByID.Route),
        IAM.Account.UseCases.GetByID.Query.Codec.encode(
          IAM.Account.UseCases.GetByID.Query.C(id)
        ),
        {
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const accountMaybe = IAM.Account.Model.Codec.decode(res.data);
        if (isLeft(accountMaybe)) {
          return left(Errors.Parsing.C());
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
      const error = Errors.Adapter.C();
      this.state.set(error);
      return left(error);
    }
  }
  async update(
    command: IAM.Account.UseCases.Update.Command.T
  ): Promise<Either<Errors.T, null>> {
    this.state.set("Loading");
    try {
      const res = await axios.post(
        Config.GetEndpoint(IAM.Account.UseCases.Update.Route),
        IAM.Account.UseCases.Update.Command.Codec.encode(command),
        {
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
      const error = Errors.Adapter.C();
      this.state.set(error);
      return left(error);
    }
  }
}
