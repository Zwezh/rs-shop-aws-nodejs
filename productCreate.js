import { Client } from 'pg';
import { dbOptions } from './db-options';

export const handler = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const { title, description, price, count } = JSON.parse(event.body);
    if (!title || !description || !price || !count)
      throw 'Data for new product is invalid';
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
    if (error !== 'Data for new product is invalid') {
      return {
        statusCode: 500,
        body: 'Unexpected error'
      };
    } else {
      return {
        statusCode: 400,
        body: error
      };
    }
  } finally {
    client.end();
  }
};
