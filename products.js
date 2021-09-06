import { products } from './data/products-data.mock';

export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products)
  };
};
