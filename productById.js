import { Client } from 'pg';
import { dbOptions } from './db-options';

export const handler = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const { id } = event.pathParameters;
    const { rows: result } = await client.query(`
          select id, title, description, price, count 
            from products 
            inner join stocks 
            on products.id = stocks.product_id
            where products.id = '${id}'
    `);
    return {
      statusCode: 200,
      body: JSON.stringify(result[0])
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error
    };
  } finally {
    client.end();
  }
};