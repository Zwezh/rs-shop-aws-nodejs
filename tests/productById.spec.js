import { handler } from '../productById';

test('Product Status code 200', async () => {
  const expected = 200;
  const actual = await handler({ pathParameters: { id: 273302 } });
  expect(actual.statusCode).toBe(expected);
});

test('Product is exist by id', async () => {
  const expected = 'The Mist';
  const actual = await handler({ pathParameters: { id: 273302 } });
  const originalName = JSON.parse(actual.body).originalName;
  expect(originalName).toBe(expected);
});
