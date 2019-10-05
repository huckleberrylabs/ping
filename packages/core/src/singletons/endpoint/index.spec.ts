import { APIURLS, GetAPIURL, EVENTS_ENDPOINT, GetEventsEndpoint } from ".";

describe("Endpoints", () => {
  test(`API URL should be ${APIURLS.test}`, () => {
    expect(GetAPIURL()).toBe(APIURLS.test);
  });
  test(`Events URL should return`, () => {
    expect(GetEventsEndpoint()).toBe(APIURLS.test + EVENTS_ENDPOINT);
  });
});
