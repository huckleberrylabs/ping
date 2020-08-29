import { left, isLeft, right, Either, isRight } from "fp-ts/lib/Either";
import axios from "axios";
import { Observable } from "../../observable";
import { AuthService } from "../auth";
import {
  Config,
  Widget,
  UUID,
  Errors,
  StatusCode,
  NameSpaceCaseString,
  Url,
} from "@huckleberrylabs/ping-core";

export enum WidgetStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
  IDLE = "Idle",
}

export const Name = "services:widget" as NameSpaceCaseString.T;

export class WidgetService {
  readonly map = new Observable<Map<UUID.T, Widget.Settings.Model.T>>(
    new Map()
  );
  readonly state = new Observable<Errors.T | WidgetStates>(
    WidgetStates.UNINITIALIZED
  );
  constructor(private authService: AuthService) {}
  async getByAccount(): Promise<Either<Errors.T, Widget.Settings.Model.T[]>> {
    const id = this.authService.state.get();
    if (UUID.Is(id)) return this._getByAccount(id);
    return left(Errors.Unauthenticated.C(Name, "getByAccount"));
  }
  private async _getByAccount(
    account: UUID.T
  ): Promise<Either<Errors.T, Widget.Settings.Model.T[]>> {
    this.state.set(WidgetStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Widget.Settings.UseCases.GetByAccount.Route),
        Widget.Settings.UseCases.GetByAccount.Query.Encode(
          Widget.Settings.UseCases.GetByAccount.Query.C(account)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        if (Array.isArray(res.data)) {
          const widgetsMaybe = res.data.map(Widget.Settings.Model.Decode);
          if (widgetsMaybe.some(isLeft)) {
            const error = Errors.Adapter.C(
              Name,
              `_getByAccount: ${account} has ${
                widgetsMaybe.filter(isLeft).length
              } decode errors`,
              "A server error occured, please try again later or contact support."
            );
            this.state.set(error);
            return left(error);
          } else {
            const widgets = widgetsMaybe
              .filter(isRight)
              .map((widget) => widget.right);
            this.map.set(new Map(widgets.map((w) => [w.id, w])));
            this.state.set(WidgetStates.IDLE);
            return right(widgets);
          }
        } else {
          const error = Errors.Adapter.C(
            Name,
            `_getByAccount: ${account} unexpected data: ${JSON.stringify(
              res.data
            )} `,
            "A server error occured, please try again later or contact support."
          );
          this.state.set(error);
          return left(error);
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
  async get(id: UUID.T): Promise<Either<Errors.T, Widget.Settings.Model.T>> {
    const map = this.map.get();
    const widget = map.get(id);
    if (widget) return right(widget);
    this.state.set(WidgetStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Widget.Settings.UseCases.GetByID.Route),
        Widget.Settings.UseCases.GetByID.Query.Encode(
          Widget.Settings.UseCases.GetByID.Query.C(id)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const widgetMaybe = Widget.Settings.Model.Decode(res.data);
        if (isLeft(widgetMaybe)) {
          this.state.set(widgetMaybe.left);
          return widgetMaybe;
        } else {
          const widget = widgetMaybe.right;
          const map = this.map.get();
          map.set(widget.id, widget);
          this.map.set(map);
          this.state.set(WidgetStates.IDLE);
          return right(widget);
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
  async updateWidget(
    widget: Widget.Settings.Model.T
  ): Promise<Either<Errors.T, null>> {
    try {
      const res = await axios.post(
        Config.GetEndpoint(Widget.Settings.UseCases.Update.Route),
        Widget.Settings.UseCases.Update.Command.Encode(
          Widget.Settings.UseCases.Update.Command.C(widget)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        await this.get(widget.id);
        return right(null);
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `updateWidget ${err.message}`);
      return left(error);
    }
  }
  async createWidget(homePage: Url.T): Promise<Either<Errors.T, UUID.T>> {
    try {
      const accountID = this.authService.state.get();
      if (!UUID.Is(accountID))
        return left(Errors.Unauthenticated.C(Name, "get"));
      const widget = Widget.Settings.Model.C(accountID, homePage);
      const res = await axios.post(
        Config.GetEndpoint(Widget.Settings.UseCases.Create.Route),
        Widget.Settings.UseCases.Create.Command.Encode(
          Widget.Settings.UseCases.Create.Command.C(widget)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        await this.get(widget.id);
        return right(widget.id);
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `createWidget ${err.message}`);
      return left(error);
    }
  }
  async deleteWidget(id: UUID.T): Promise<Either<Errors.T, null>> {
    try {
      const res = await axios.post(
        Config.GetEndpoint(Widget.Settings.UseCases.Delete.Route),
        Widget.Settings.UseCases.Delete.Command.Encode(
          Widget.Settings.UseCases.Delete.Command.C(id)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        this.getByAccount();
        return right(null);
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        return left(this.authService.onAPIError(error));
      }
    } catch (err) {
      const error = Errors.Adapter.C(Name, `deleteWidget ${err.message}`);
      return left(error);
    }
  }
}
