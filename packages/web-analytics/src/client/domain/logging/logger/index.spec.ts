import { Log } from "../log";
import { Logger } from ".";

describe("log", () => {
  test("it logs", () => {
    const log = Log();
    const logger = Logger(log);
    logger("info", "test-message", ["test-tag"]);
    expect(log.length === 1).toBeTruthy();
  });
});
