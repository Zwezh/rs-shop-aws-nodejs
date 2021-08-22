import { products } from './data/products-data.mock';

export const handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const product = products.find((item) => item.id === +id);
    return product
      ? {
          statusCode: 200,
          body: JSON.stringify(product)
        }
      : {
          statusCode: 404,
          body: 'A product with the specified ID was not found.'
        };
  } catch (error) {
    throw 'Unexpected error';
  }
};
