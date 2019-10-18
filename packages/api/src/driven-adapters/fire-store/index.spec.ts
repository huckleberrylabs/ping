import { C } from ".";

describe("FireStore", () => {
  test("it initializes correctly", async () => {
    if (process.env.GCLOUD_CREDENTIALS) {
      expect(C()).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });
});
