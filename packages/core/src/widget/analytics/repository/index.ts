import { Either, right, left, isLeft, isRight } from "fp-ts/lib/Either";
import { IAnalyticsRepository, IFireStore } from "../../../interfaces";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import * as Model from "../model";

export const Name = "widget:analytics:repository" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IAnalyticsRepository => ({
  add: async (widget, event): Promise<Either<Errors.Adapter.T, null>> => {
    try {
      await store
        .collection(Name + ":" + widget)
        .doc(UUID.Encode(event.id))
        .create(Model.Encode(event));
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `add: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  getByWidget: async (
    widget
  ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Model.T[]>> => {
    try {
      const queryRef = await store.collection(Name + ":" + widget).get();
      if (queryRef.empty)
        return left(
          Errors.NotFound.C(Name, `getByWidget: ${widget}`, "No widgets found.")
        );
      const json = queryRef.docs.map(doc => doc.data());
      const maybeWidgets = json.map(Model.Decode);
      if (maybeWidgets.some(isLeft)) {
        return left(
          Errors.Adapter.C(
            Name,
            `getByWidget: ${widget} has ${
              maybeWidgets.filter(isLeft).length
            } decode errors`,
            "A database error occured, please try again later or contact support."
          )
        );
      } else {
        return right(maybeWidgets.filter(isRight).map(event => event.right));
      }
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `add: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
});
