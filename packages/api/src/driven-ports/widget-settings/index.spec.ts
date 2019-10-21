import { C } from ".";
import { FireStore } from "../../driven-adapters";
import { isRight } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { Settings } from "@huckleberryai/widget";

describe("widget-settings repository", () => {
  test("it retrieves by id", async () => {
    const store = FireStore.C();
    if (isRight(store)) {
      const repo = C(store.right);
      const maybeWidgetSettings = await repo.get(
        "d805c6fa-44c4-412c-b6d7-2828da2aba2d" as UUID.T
      );
      expect(isRight(maybeWidgetSettings)).toBeTruthy();
      if (isRight(maybeWidgetSettings))
        expect(Settings.Codec.is(maybeWidgetSettings.right)).toBeTruthy();
    }
  });
});
