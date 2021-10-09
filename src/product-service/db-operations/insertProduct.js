import { Client } from 'pg';
import { dbOptions } from '../db-options';
import { inputDataValidator } from '../validators/inputDataValidator';

export const insertProduct = async (product) => {
  const { title, description, price, count } = product;
  if (!inputDataValidator(title, description, +price, +count)) {
    throw {
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
        values('${title}', '${description}', ${+price})
      returning id
    )
    insert into stocks (product_id, count)
      values((select id from new_product), ${+count})
      returning (select id from new_product)
    `);
    return result;
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Unexpected error'
    };
  } finally {
    client.end();
  }
};
