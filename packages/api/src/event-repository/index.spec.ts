import { IoCContainer } from "../ioc-container";
import { EventRepository } from ".";
import { Event, ID } from "@huckleberryai/core";

describe("FireStore", () => {
  test("it initializes correctly", async () => {
    if (process.env.GCLOUD_CREDENTIALS) {
      const repo = IoCContainer.get(EventRepository);
      const ORIGIN_ID = new ID();
      const event = new Event(ORIGIN_ID);
      await repo.add(event);
      const event2 = await repo.getByID(event.id);
      if (event2) {
        expect(event.id.equals(event2.id)).toBeTruthy();
      } else {
        throw new Error("Event not Saved");
      }
    } else {
      expect(true).toBeTruthy();
    }
  });
});
