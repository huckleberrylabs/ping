import "reflect-metadata";
import { DocumentStore } from ".";

describe("FireStore", () => {
  test("it initializes correctly", async () => {
    if (process.env.GCLOUD_CREDENTIALS) {
      const dataStore = new DocumentStore();
      expect(dataStore.store).toBeTruthy();
    } else {
      expect(true).toBeTruthy();
    }
  });
});
