import { FireStore } from ".";

describe("FireStore", () => {
  test("it initializes correctly", async () => {
    if (process.env.GCLOUD_CREDENTIALS) {
      expect(FireStore()).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });
});
