import { Client } from 'pg';
import { dbOptions } from './db-options';

export const handler = async (event) => {
  const { title, description, price, count } = JSON.parse(event.body);
  if (!isValidInputData(title, description, price, count)) {
    return {
      statusCode: 400,
      body: 'Data for new product is invalid'
    };
  }
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const { rows: result } = await client.query(`
    with new_product as (
      insert into products(title, description, price)
        values('${title}', '${description}', ${price})
      returning id
    )
    insert into stocks (product_id, count)
      values((select id from new_product), ${count})
      returning (select id from new_product)
    `);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Unexpected error'
    };
  } finally {
    client.end();
  }
};

const isValidInputData = (title, description, price, count) => {
  if (!title || !description || !price || !count) return false;
  if (!isCorrectNumberValue(price)) return false;
  if (!isCorrectNumberValue(count)) return false;
  if (title.length === 0 || description.length === 0) return false;
  return true;
};

const isCorrectNumberValue = (value) =>
  typeof value === 'number' &&
  value > 0 &&
  value % 1 === 0 &&
  Math.pow(2, 32) - 1 > value;
