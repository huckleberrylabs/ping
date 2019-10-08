import { Log, Logger } from ".";
import { Type } from "@huckleberryai/core";

describe("log", () => {
  test("it constructs", () => {
    expect(Log()).toBeTruthy();
  });
  test("it logs", () => {
    const log = Log();
    const logger = Logger(log);
    logger("test-message", "info", ["test-tag"], "log:origin:log-test" as Type);
    expect(log.length === 1).toBeTruthy();
  });
});
