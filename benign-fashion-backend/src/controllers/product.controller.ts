import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service";

export const productSchema = z.object({
  product: z.object({
    id: z.number().optional(),
    productCode: z.string().max(20).optional(),
    name: z.string().max(150),
    description: z.string().nullable().optional(),
    price: z.number(),
    discount: z.number().default(0),
    categoryId: z.number(),
    subCategoryId: z.number(),
    isAvailable: z.boolean().default(true),
    createdAt: z.string().optional(),
  }),

  photoUrls: z.array(
    z.object({
      id: z.number().optional(),
      productId: z.number().optional(),
      url: z.string(),
    })
  ),
});

// ======================== CREATE ========================

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = {
      product: {
        ...req.body.product,
        price: Number(req.body.product.price),
        discount: Number(req.body.product.discount),
        categoryId: Number(req.body.product.categoryId),
        subCategoryId: Number(req.body.product.subCategoryId),
        isAvailable:
          req.body.product.isAvailable === "true" ||
          req.body.product.isAvailable === true,
      },
      photoUrls: req.body.photoUrls || [],
    };

    const validated = productSchema.parse(body);

    const product = await createProduct(validated);

    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

// ======================== GET ALL ========================

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ======================== GET ONE ========================

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await getProductById(Number(req.params.id));

    if (!product) {
      res.status(404).json({ status: "error", message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ======================== UPDATE ========================

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = productSchema.partial().parse(req.body);

    const updated = await updateProduct(Number(req.params.id), validated);

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ======================== DELETE ========================

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteProduct(Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
};
