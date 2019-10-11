import { Post, Beacon, EndpointFromEvent } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import * as Event from "../event";
import { Type, UUID, Url, Json } from "../values";
import { map, isLeft, isRight } from "fp-ts/lib/Either";

describe("http-client", () => {
  test("it posts", async () => {
    if (false) {
      pipe(
        await Post("https://httpstat.us/200" as Url.T, {
          howdy: "partner",
        }),
        map(res => expect(Json.Is(res)).toBeTruthy()),
        result => expect(isRight(result)).toBeTruthy()
      );
      pipe(
        await Post("https://httpstat.us/500" as Url.T, {
          howdy: "partner",
        }),
        res => expect(isLeft(res)).toBeTruthy()
      );
    }
  });
  test("it beacons", () => {
    expect(Beacon).toBeTruthy();
  });
  test("it creates endpoints from events", () => {
    pipe(
      Event.C(
        "core:event:test" as Type.T,
        "my-test-corr-id" as UUID.T,
        "my-test-parent-id" as UUID.T
      ),
      EndpointFromEvent,
      map(url =>
        expect(url).toBe(
          "http://localhost:8000/core-event-test?corr_id=my-test-corr-id&parent_id=my-test-parent-id"
        )
      )
    );
  });
});
