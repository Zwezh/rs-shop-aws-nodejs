import { handler } from "../products";


test("Products Status code 200", async () => {
  const expected = 200;
  const actual = await handler(null);
  expect(actual.statusCode).toBe(expected);
});


test("Products count", async () => {
  const expected = 38;
  const actual = await handler(null);
  const mockSize = JSON.parse(actual.body).length;
  expect(mockSize).toBe(expected);
});
