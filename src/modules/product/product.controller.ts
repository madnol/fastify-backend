import { FastifyRequest } from 'fastify';
import { createProduct, getProducts } from './product.service';
import { CreateProductInput } from './product.schema';

export const createProductHandler = async (
  request: FastifyRequest<{
    Body: CreateProductInput;
  }>
) => {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });

  return product;
};

export const getProductsHandler = async () => {
  const products = await getProducts();
  return products;
};
