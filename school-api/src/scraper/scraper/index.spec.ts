import { mapData, rankingsData } from ".";

test("Returns School Names", async () => {
  const result = await mapData();
  console.log(result);
  expect(Array.isArray(result)).toBeTruthy();
  expect(result.length).toBeGreaterThan(0);
  expect(typeof result[0]).toBeTruthy();
});

test("Returns School Rankings", async () => {
  const result = await rankingsData();
  console.log(result);
  expect(Array.isArray(result)).toBeTruthy();
  expect(result.length).toBeGreaterThan(0);
  expect(typeof result[0].name === "string").toBeTruthy();
  expect(typeof result[0].rank === "number").toBeTruthy();
});
