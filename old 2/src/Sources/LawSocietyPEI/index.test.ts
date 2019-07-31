//@ts-ignore
import Factories from "../Factories";
import LawSocietyPEI from "./index";

describe("LawSocietyPEI", () => {
  test("extract", async () => {
    expect.assertions(1);
    const factories = new Factories("test");
    const lawsocietypei = new LawSocietyPEI(factories);
    const result = await lawsocietypei.extract();
    expect(result).toBeTruthy();
  });
});
