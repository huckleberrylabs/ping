import { Post, Beacon, EndpointFromEvent } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { Event } from "../event";
import { Type, UUID, Url, IsJSON } from "../../values";
import { map, flatten, isLeft, isRight } from "fp-ts/lib/Either";

describe("http-client", () => {
  test("it posts", async () => {
    if (false) {
      pipe(
        await Post("https://httpstat.us/200" as Url, {
          howdy: "partner",
        }),
        map(res => expect(IsJSON(res)).toBeTruthy()),
        result => expect(isRight(result)).toBeTruthy()
      );
      pipe(
        await Post("https://httpstat.us/500" as Url, {
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
      Event(
        "core:event:test" as Type,
        "core:origin:event-test" as Type,
        "my-test-corr-id" as UUID,
        "my-test-parent-id" as UUID,
        "my-test-agent-id" as UUID
      ),
      map(EndpointFromEvent),
      flatten,
      map(url =>
        expect(url).toBe(
          "http://localhost:8000/core-event-test?agent_id=my-test-agent-id&corr_id=my-test-corr-id&parent_id=my-test-parent-id"
        )
      )
    );
  });
});
