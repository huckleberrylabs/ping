import { C } from ".";
import { FireStore } from "../../driven-adapters";
import { isRight, isLeft } from "fp-ts/lib/Either";
import * as WA from "@huckleberryai/web-analytics";
import { NonEmptyString } from "@huckleberryai/core";

describe("web-analytics repository", () => {
  const event = WA.Client.Logging.Event.C(
    "debug",
    "message" as NonEmptyString.T,
    ["test" as NonEmptyString.T, "integration" as NonEmptyString.T]
  );
  const store = FireStore.C();
  test("noop", async () => {
    expect(true).toBeTruthy();
  });
  if (isLeft(store)) return;
  const repo = C(store.right);
  test("it saves a new event", async () => {
    const maybeSaved = await repo.save(event.id, event);
    expect(isRight(maybeSaved)).toBeTruthy();
  });
  test("it fails to save event with existing id", async () => {
    const maybeSaved = await repo.save(event.id, event);
    expect(isLeft(maybeSaved)).toBeTruthy();
  });
  test("it removes an existing event", async () => {
    const maybeRemoved = await repo.remove(event.id);
    expect(isLeft(maybeRemoved)).toBeTruthy();
  });
});
