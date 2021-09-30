export const inputDataValidator = (title, description, price, count) => {
  if (!title || !description || !price || !count) return false;
  if (!isCorrectNumberValue(price)) return false;
  if (!isCorrectNumberValue(count)) return false;
  if (title.length === 0 || description.length === 0) return false;
  return true;
};

export const isCorrectNumberValue = (value) =>
  typeof value === 'number' &&
  value > 0 &&
  value % 1 === 0 &&
  Math.pow(2, 32) - 1 > value;
