import { RETSClient } from "./index";

describe("RETS client", () => {
  const retsClient = new RETSClient(
    "http://sample.data.crea.ca/Login.svc/Login",
    "CXLHfDVrziCfvwgCuL8nUahC",
    "mFqMsCSPdnb5WO1gpEEtDCHH"
  );
  test("can GET login", async () => {
    await retsClient.login();
    console.log(retsClient.cookie);
    expect(retsClient.cookie).toBeTruthy();
  });
  test("can GET metadata", async () => {
    const result = await retsClient.getMetadata();
    expect(result).toBeUndefined();
  });
  test("can GET object", async () => {
    const result = await retsClient.getObject();
    expect(result).toBeUndefined();
  });
  test("can GET search", async () => {
    const result = await retsClient.search();
    expect(result).toBeUndefined();
  });
  test("can GET logout", async () => {
    const result = await retsClient.logout();
    expect(result).toBeUndefined();
  });
});
