import { GetContext, CONTEXTS } from ".";

describe("context", () =>
  test(`should be ${CONTEXTS.test}`, () =>
    expect(GetContext()).toBe(CONTEXTS.test)));
