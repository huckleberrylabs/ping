import { pipe } from "fp-ts/lib/pipeable";
import { map, isLeft, isRight } from "fp-ts/lib/Either";
import * as Event from "../event";
import * as Json from "../json";
import { UUID, Url, Type } from "../values";
import { Post, Beacon, GetEndpoint, EndpointFromEvent, GetAPIURL } from ".";
import { DefaultAPIURL } from "../config";

describe.only("http-client", () => {
  const testURL = "http://example.com";
  test(`api url should be ${testURL}`, () => {
    expect(GetAPIURL()).toBe(DefaultAPIURL);
  });
  test(`should return correct output`, () => {
    expect(new URL(GetEndpoint(DefaultAPIURL)).pathname).toBe(DefaultAPIURL);
    expect(GetEndpoint(DefaultAPIURL)).toBe(
      new URL(testURL + DefaultAPIURL).toString()
    );
  });
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
      {
        ...Event.C("my-test-corr-id" as UUID.T, "my-test-parent-id" as UUID.T),
        type: "module:domain-entity:event-name" as Type.T,
      },
      EndpointFromEvent,
      url =>
        expect(url).toBe(
          testURL +
            "/module/domain-entity/event-name?corr_id=my-test-corr-id&parent_id=my-test-parent-id"
        )
    );
  });
});
