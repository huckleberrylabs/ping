import { IoC } from "../../structural";
import { EventRepository } from ".";
import { Event, UUID, TypeName } from "@huckleberryai/core";

describe("FireStore", () => {
  test("it initializes correctly", async () => {
    if (process.env.GCLOUD_CREDENTIALS) {
      const repo = IoC.get(EventRepository);
      const ORIGIN_ID = UUID();
      const event = Event(TypeName("TestEvent"), ORIGIN_ID);
      await repo.add(event);
      const event2 = await repo.getByID(event.id);
      if (event2) {
        expect(event.id === event2.id).toBeTruthy();
      } else {
        throw new Error("Event not Saved");
      }
    } else {
      expect(true).toBeTruthy();
    }
  });
});
