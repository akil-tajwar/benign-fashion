import { eq, and } from "drizzle-orm";
import { NewProduct, products } from "../schemas";
import { db } from "../config/database";


export const createProduct = async (data: NewProduct) => {
  const [newProduct] = await db.insert(products).values(data).$returningId();

  // Return full product data
  return {
    id: newProduct,
    ...data,
  };
};

export const getProducts = async (filters?: { categoryId?: number; isActive?: boolean }) => {
  const conditions = [];

  if (filters?.categoryId !== undefined) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.isActive !== undefined) {
    conditions.push(eq(products.isActive, filters.isActive));
  }

  return await db
    .select()
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined);
};


export const getProductById = async (
  id: number,
  options?: { withReviews?: boolean; withCategory?: boolean }
) => {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      ...(options?.withCategory ? { category: true } : {}),
      ...(options?.withReviews ? { reviews: true } : {}),
    },
  });
  return product;
};


export const updateProduct = async (id: number, data: Partial<NewProduct>) => {
  await db.update(products).set(data).where(eq(products.id, id));
  return await db.query.products.findFirst({ where: eq(products.id, id) });
};


export const deleteProduct = async (id: number) => {
  await db.delete(products).where(eq(products.id, id));
  return { message: "Product deleted successfully" };
};
