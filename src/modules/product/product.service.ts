import prisma from '../../utils/prisma';
import { CreateProductInput } from './product.schema';

export const createProduct = async (
  data: CreateProductInput & { ownerId: number }
) => {
  return prisma.product.create({
    data,
  });
};

export const getProducts = () => {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
};
