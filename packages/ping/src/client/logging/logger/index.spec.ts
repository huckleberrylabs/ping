import * as Log from "../log";
import * as Logger from ".";

describe("log", () => {
  test("it logs", () => {
    const log = Log.C();
    const logger = Logger.C(log);
    logger("info", "test-message", ["test-tag"]);
    expect(log.length === 1).toBeTruthy();
  });
});
