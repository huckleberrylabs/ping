import { Either, right, left } from "fp-ts/lib/Either";
import { UUID, Errors, Phone, Url, Results } from "@huckleberryai/core";
import { Handler } from "./handler";
import * as Query from "./query";
import * as Settings from "../../entity";

describe("widget:settings:get-by-id:handler", () => {
  const settings = Settings.C(
    "+1 647 295 1647" as Phone.T,
    "http://localhost" as Url.T
  );
  const repo = {
    async get(
      id: UUID.T
    ): Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Settings.T>> {
      if (id !== settings.id) return left(Errors.NotFound.C());
      return right(settings);
    },
  };

  test("returns settings if widget exists", async () => {
    const query = Query.C(settings.id);
    const result = await Handler(repo)(query);
    expect(result.type).toBe(Results.OKWithData.Name);
    if (result.type === "core:result:ok-with-data") {
      expect(Settings.Is(result.data)).toBeTruthy();
      expect(result.data.color).toBe(settings.color);
      expect(result.data.enabled).toBe(settings.enabled);
      expect(result.data.homePage).toBe(settings.homePage);
      expect(result.data.id).toBe(settings.id);
      expect(result.data.phone).toBe(settings.phone);
      expect(result.data.type).toBe(settings.type);
    }
  });
  test("returns NotFound if widget doesnt exist", async () => {
    const query = Query.C("fake_id" as UUID.T);
    const result = await Handler(repo)(query);
    expect(result.type).toBe(Results.NotFound.Name);
  });
});
