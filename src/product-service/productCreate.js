import { insertProduct } from './db-operations/insertProduct';

export const handler = async (event) => {
  try {
    const result = await insertProduct(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return error;
  }
};
