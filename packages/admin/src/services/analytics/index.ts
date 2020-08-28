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
} from "@huckleberrylabs/ping-core";

export enum AnalyticsStates {
  UNINITIALIZED = "Uninitialized",
  LOADING = "Loading",
  IDLE = "Idle",
}

export const Name = "services:widget" as NameSpaceCaseString.T;

export class AnalyticsService {
  readonly map = new Observable<Map<UUID.T, Widget.Analytics.Model.T[]>>(
    new Map()
  );
  readonly state = new Observable<Errors.T | AnalyticsStates>(
    AnalyticsStates.UNINITIALIZED
  );
  constructor(private authService: AuthService) {}
  async get(
    widget: UUID.T
  ): Promise<Either<Errors.T, Widget.Analytics.Model.T[]>> {
    const events = this.map.get().get(widget);
    if (events) return right(events);
    this.state.set(AnalyticsStates.LOADING);
    try {
      const res = await axios.post(
        Config.GetEndpoint(Widget.Analytics.UseCases.GetByWidget.Route),
        Widget.Analytics.UseCases.GetByWidget.Query.Encode(
          Widget.Analytics.UseCases.GetByWidget.Query.C(widget)
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        if (Array.isArray(res.data)) {
          const events = res.data.map(Widget.Analytics.Model.Decode);
          if (events.some(isLeft)) {
            const error = Errors.Adapter.C(
              Name,
              `get: ${widget} has ${
                events.filter(isLeft).length
              } decode errors`,
              "A server error occured, please try again later or contact support."
            );
            this.state.set(error);
            return left(error);
          } else {
            const evts = events.filter(isRight).map((event) => event.right);
            const map = this.map.get();
            map.set(widget, evts);
            this.map.set(map);
            this.state.set(AnalyticsStates.IDLE);
            return right(evts);
          }
        } else {
          const error = Errors.Adapter.C(
            Name,
            `_get: ${widget} unexpected data: ${JSON.stringify(res.data)} `,
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
      const error = Errors.Adapter.C(Name, `get ${err.message}`);
      this.state.set(error);
      return left(error);
    }
  }
}
