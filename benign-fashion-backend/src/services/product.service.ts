import { db } from "../config/database";
import { productsModel, photosModel } from "../schemas";
import { eq, and } from "drizzle-orm";

// ======================================================
// CREATE PRODUCT + PHOTOS
// ======================================================
export const createProduct = async (data: {
  product: any;
  photoUrls: { url: string }[];
}) => {
  return await db.transaction(async (tx) => {
    // 1️⃣ Insert product
    const [inserted] = await tx
      .insert(productsModel)
      .values(data.product)
      .$returningId();

    const productId = inserted.id;

    // 2️⃣ Insert photos
    if (data.photoUrls?.length > 0) {
      await tx.insert(photosModel).values(
        data.photoUrls.map((p) => ({
          productId,
          url: p.url,
        }))
      );
    }

    // 3️⃣ Return result
    const product = await tx.query.productsModel.findFirst({
      where: eq(productsModel.id, productId),
      with: { photos: true }
    });

    return product;
  });
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================
export const getProducts = async (filters?: {
  categoryId?: number;
  subCategoryId?: number;
  isAvailable?: boolean;
}) => {
  const conditions = [];

  if (filters?.categoryId !== undefined) {
    conditions.push(eq(productsModel.categoryId, filters.categoryId));
  }
  if (filters?.subCategoryId !== undefined) {
    conditions.push(eq(productsModel.subCategoryId, filters.subCategoryId));
  }
  if (filters?.isAvailable !== undefined) {
    conditions.push(eq(productsModel.isAvailable, filters.isAvailable));
  }

  return await db.query.productsModel.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    with: { photos: true }
  });
};

// ======================================================
// GET PRODUCT BY ID
// ======================================================
export const getProductById = async (id: number) => {
  return await db.query.productsModel.findFirst({
    where: eq(productsModel.id, id),
    with: { photos: true }
  });
};

// ======================================================
// UPDATE PRODUCT + REPLACE PHOTOS
// ======================================================
export const updateProduct = async (
  id: number,
  data: {
    product?: any;
    photoUrls?: { url: string }[];
  }
) => {
  return await db.transaction(async (tx) => {
    // 1️⃣ Update product fields
    if (data.product) {
      await tx
        .update(productsModel)
        .set(data.product)
        .where(eq(productsModel.id, id));
    }

    // 2️⃣ Replace photos if provided
    if (Array.isArray(data.photoUrls)) {
      // delete previous photos
      await tx.delete(photosModel).where(eq(photosModel.productId, id));

      // insert new photos
      if (data.photoUrls.length > 0) {
        await tx.insert(photosModel).values(
          data.photoUrls.map((p) => ({
            productId: id,
            url: p.url,
          }))
        );
      }
    }

    // 3️⃣ Return updated record
    return await tx.query.productsModel.findFirst({
      where: eq(productsModel.id, id),
      with: { photos: true }
    });
  });
};

// ======================================================
// DELETE PRODUCT
// ======================================================
export const deleteProduct = async (id: number) => {
  await db.delete(productsModel).where(eq(productsModel.id, id));
  return { message: "Product deleted successfully" };
};
