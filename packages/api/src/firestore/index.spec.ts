import "reflect-metadata";
import { FireStore } from ".";

describe("FireStore", () => {
  test("it initializes correctly", async () => {
    if (process.env.GCLOUD_CREDENTIALS) {
      const dataStore = new FireStore();
      expect(dataStore.store).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });
});
