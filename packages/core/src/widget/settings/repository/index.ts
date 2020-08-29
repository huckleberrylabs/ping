import { left, right, isLeft, isRight } from "fp-ts/lib/Either";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { IWidgetRepository, IFireStore } from "../../../interfaces";
import * as Model from "../model";

export const Name = "widget:repository:settings" as NameSpaceCaseString.T;

export const C = (store: IFireStore): IWidgetRepository => ({
  get: async id => {
    try {
      const json = (
        await store
          .collection(Name)
          .doc(UUID.Encode(id))
          .get()
      ).data();
      if (!json)
        return left(Errors.NotFound.C(Name, `get: ${id}`, `Widget not found.`));
      const settings = Model.Decode(json);
      if (isLeft(settings))
        return left(
          Errors.Adapter.C(
            Name,
            `get: ${id}`,
            "A database error occured, please try again later or contact support."
          )
        );
      return settings;
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `get: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  getByAccount: async account => {
    try {
      const queryRef = await store
        .collection(Name)
        .where("account", "==", UUID.Encode(account))
        .get();
      if (queryRef.empty)
        return left(
          Errors.NotFound.C(
            Name,
            `getByAccount: ${account}`,
            "No widgets found."
          )
        );
      const json = queryRef.docs.map(doc => doc.data());
      const maybeWidgets = json.map(Model.Decode);
      if (maybeWidgets.some(isLeft)) {
        return left(
          Errors.Adapter.C(
            Name,
            `getByAccount: ${account} has ${
              maybeWidgets.filter(isLeft).length
            } decode errors`,
            "A database error occured, please try again later or contact support."
          )
        );
      } else {
        return right(maybeWidgets.filter(isRight).map(widget => widget.right));
      }
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `getByAccount: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  add: async widget => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(widget.id))
        .create(Model.Encode(widget));
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
  update: async widget => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(widget.id))
        .update(Model.Encode(widget));
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `update: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  exists: async id => {
    try {
      const exists = (
        await store
          .collection(Name)
          .doc(UUID.Encode(id))
          .get()
      ).exists;
      if (!exists) {
        return left(
          Errors.NotFound.C(Name, `exists: ${id}`, "Widget not found.")
        );
      } else {
        return right(null);
      }
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `exists: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
  remove: async id => {
    try {
      await store
        .collection(Name)
        .doc(UUID.Encode(id))
        .delete();
      return right(null);
    } catch (error) {
      return left(
        Errors.Adapter.C(
          Name,
          `remove: ${error.message}`,
          "A database error occured, please try again later or contact support."
        )
      );
    }
  },
});
