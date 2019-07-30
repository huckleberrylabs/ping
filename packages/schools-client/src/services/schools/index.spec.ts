import { SchoolService } from ".";

describe("School Service", () => {
  const schoolService = new SchoolService();
  test("it returns all the schools", async () => {
    const schools = await schoolService.getAll();
    expect(schools).toBeTruthy();
  });
});
