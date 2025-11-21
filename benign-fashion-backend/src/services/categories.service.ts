import { db } from "../config/database";
import { categoriesModel, NewCategory } from "../schemas";
import { eq } from "drizzle-orm";

export const createCategory = async (data: NewCategory) => {
  const [newCategory] = await db.insert(categoriesModel).values(data).$returningId();
  return { id: newCategory, ...data };
};

export const getCategories = async () => {
  return await db.select().from(categoriesModel);
};

export const getCategoryById = async (id: number) => {
  return await db.query.categoriesModel.findFirst({
    where: eq(categoriesModel.id, id),
    with: { products: true },
  });
};

export const updateCategory = async (id: number, data: Partial<NewCategory>) => {
  await db.update(categoriesModel).set(data).where(eq(categoriesModel.id, id));
  return getCategoryById(id);
};

export const deleteCategory = async (id: number) => {
  await db.delete(categoriesModel).where(eq(categoriesModel.id, id));
  return { success: true };
};
