import { WidgetSettingsRepository } from ".";
import { FireStore } from "../../driven-adapters";
import { isRight } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { Settings } from "@huckleberryai/widget";

describe("widget-settings repository", () => {
  test("it retrieves by id", async () => {
    const store = FireStore.C();
    if (isRight(store)) {
      const repo = WidgetSettingsRepository(store.right);
      const maybeWidgetSettings = await repo.get(
        "e67baf99-ccdf-4f96-8cc7-84d62dde25d4" as UUID.T
      );
      expect(isRight(maybeWidgetSettings)).toBeTruthy();
      if (isRight(maybeWidgetSettings))
        expect(Settings.Codec.is(maybeWidgetSettings.right)).toBeTruthy();
    }
  });
});
