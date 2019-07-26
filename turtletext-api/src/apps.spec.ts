import { apps } from "./apps";

describe("Apps Database", () => {
  test("Returns all of the Apps", async () => {
    expect(apps.length).toBeGreaterThanOrEqual(1);
  });
});
