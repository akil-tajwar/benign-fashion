import { db } from "../config/database";
import { categories, NewCategory } from "../schemas";
import { eq } from "drizzle-orm";

export const createCategory = async (data: NewCategory) => {
  const [newCategory] = await db.insert(categories).values(data).$returningId();
  return { id: newCategory, ...data };
};

export const getCategories = async () => {
  return await db.select().from(categories);
};

export const getCategoryById = async (id: number) => {
  return await db.query.categories.findFirst({
    where: eq(categories.id, id),
    with: { products: true },
  });
};

export const updateCategory = async (id: number, data: Partial<NewCategory>) => {
  await db.update(categories).set(data).where(eq(categories.id, id));
  return getCategoryById(id);
};

export const deleteCategory = async (id: number) => {
  await db.delete(categories).where(eq(categories.id, id));
  return { success: true };
};
