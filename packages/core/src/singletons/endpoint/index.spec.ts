import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import { GetAPIURL, GetEndpoint } from ".";

describe("endpoints", () => {
  const testURL = "http://localhost:8000";
  test(`api url should be ${testURL}`, () => {
    pipe(
      GetAPIURL(),
      map(a => expect(a).toBe(testURL))
    );
  });
  test(`should return correct output`, () => {
    pipe(
      GetEndpoint("/test-endpoint"),
      map(a => {
        const url = new URL(testURL);
        url.pathname = "/test-endpoint";
        expect(a.toString()).toBe(url.toString());
      })
    );
  });
});
