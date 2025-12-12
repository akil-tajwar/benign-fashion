import { db } from "../config/database";
import { productsModel, photosModel, categoriesModel } from "../schemas";
import { eq, and, sql, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import fs from "fs";
import path from "path";

// ======================================================
// CREATE PRODUCT + PHOTOS
// ======================================================
export interface CreateProductWithFiles {
  product: {
    id?: number;
    productCode?: string;
    name: string;
    description?: string | null;
    price: number;
    discount?: number;
    categoryId: number;
    subCategoryId: number;
    isAvailable?: boolean;
    createdAt?: string;
  };
  photoUrls?: Express.Multer.File[]; // multer files
}

export const createProduct = async (data: CreateProductWithFiles) => {
  return await db.transaction(async (tx) => {
    // Insert product
    const [inserted] = await tx
      .insert(productsModel)
      .values({
        ...data.product,
        createdAt: data.product.createdAt
          ? new Date(data.product.createdAt)
          : undefined,
      })
      .$returningId();

    const productId = inserted.id;

    // Save uploaded files and insert photo records
    if (data.photoUrls && data.photoUrls.length > 0) {
      const baseUrl = process.env.API_BASE_URL || "http://localhost:4000";

      const photosData = data.photoUrls.map((file) => ({
        productId,
        url: `${baseUrl}/uploads/${file.filename}`, // Full URL
      }));

      await tx.insert(photosModel).values(photosData);
    }

    // Return product with photos
    const product = await tx.query.productsModel.findFirst({
      where: eq(productsModel.id, productId),
      with: { photos: true },
    });

    return product;
  });
};

// ======================================================
// GET ALL PRODUCTS
// ======================================================

export const getProducts = async (subCategoryId?: number) => {
  const subcat = alias(categoriesModel, "subcat");

  const products = await db
    .select({
      id: productsModel.id,
      productCode: productsModel.productCode,
      name: productsModel.name,
      description: productsModel.description,
      price: productsModel.price,
      discount: productsModel.discount,
      isAvailable: productsModel.isAvailable,
      isFlashSale: productsModel.isFlashSale,
      availableSize: productsModel.availableSize,
      createdAt: productsModel.createdAt,

      categoryId: productsModel.categoryId,
      categoryName: categoriesModel.name,
      categoryType: categoriesModel.categoryType, // ✅ added

      subCategoryId: productsModel.subCategoryId,
      subCategoryName: subcat.name,
      subCategoryType: subcat.categoryType, // ✅ optional (only if you want)
    })
    .from(productsModel)
    .innerJoin(
      categoriesModel,
      eq(productsModel.categoryId, categoriesModel.id)
    )
    .innerJoin(subcat, eq(productsModel.subCategoryId, subcat.id))
    .where(
      subCategoryId ? eq(productsModel.subCategoryId, subCategoryId) : undefined
    )
    .execute();

  const productIds = products.map((p) => p.id);

  const photos = await db
    .select()
    .from(photosModel)
    .where(inArray(photosModel.productId, productIds));

  return products.map((p) => ({
    product: {
      id: p.id,
      productCode: p.productCode,
      name: p.name,
      description: p.description,
      price: p.price,
      discount: p.discount,
      categoryId: p.categoryId,
      subCategoryId: p.subCategoryId,
      isAvailable: p.isAvailable,
      isFlashSale: p.isFlashSale,
      availableSize: p.availableSize,
      createdAt: p.createdAt,

      categoryName: p.categoryName,
      categoryType: p.categoryType,

      subCategoryName: p.subCategoryName,
      subCategoryType: p.subCategoryType,
    },

    photoUrls: photos
      .filter((photo) => photo.productId === p.id)
      .map((photo) => ({
        id: photo.id,
        productId: photo.productId,
        url: photo.url,
      })),
  }));
};

// ======================================================
// GET PRODUCT BY ID
// ======================================================
export const getProductById = async (id: number) => {
  // Alias for subcategory
  const subcat = alias(categoriesModel, "subcat");

  // Fetch single product with category + subcategory
  const product = await db
    .select({
      id: productsModel.id,
      productCode: productsModel.productCode,
      name: productsModel.name,
      description: productsModel.description,
      price: productsModel.price,
      discount: productsModel.discount,
      isAvailable: productsModel.isAvailable,
      isFlashSale: productsModel.isFlashSale,
      availableSize: productsModel.availableSize,
      createdAt: productsModel.createdAt,

      categoryId: productsModel.categoryId,
      categoryName: categoriesModel.name,

      subCategoryId: productsModel.subCategoryId,
      subCategoryName: subcat.name,
    })
    .from(productsModel)
    .innerJoin(
      categoriesModel,
      eq(productsModel.categoryId, categoriesModel.id)
    )
    .innerJoin(subcat, eq(productsModel.subCategoryId, subcat.id))
    .where(eq(productsModel.id, id))
    .then((res) => res[0]); // Only one result

  if (!product) return null;

  // Fetch photos for this product
  const photos = await db
    .select()
    .from(photosModel)
    .where(eq(photosModel.productId, id));

  // Return in same structure as getProducts
  return {
    product: {
      id: product.id,
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      isAvailable: product.isAvailable,
      isFlashSale: product.isFlashSale,
      availableSize: product.availableSize,
      createdAt: product.createdAt,
      categoryName: product.categoryName,
      subCategoryName: product.subCategoryName,
    },

    photoUrls: photos.map((photo) => ({
      id: photo.id,
      productId: photo.productId,
      url: photo.url,
    })),
  };
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
      with: { photos: true },
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
