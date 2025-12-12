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
export const createProductController = async (req: Request, res: Response) => {
  try {
    // Check if product field exists
    if (!req.body.product) {
      res.status(400).json({
        error: "Product data is required",
        receivedFields: Object.keys(req.body),
        bodyContent: req.body,
      });
    }

    const product = JSON.parse(req.body.product);
    const files = req.files as Express.Multer.File[] | undefined;

    const createdProduct = await createProduct({
      product,
      photoUrls: files,
    });

    res.json({ success: true, data: createdProduct });
  } catch (err) {
    console.error("Error details:", err);
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON in product field" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ======================== GET ALL ========================

export const getProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subCategoryId } = req.params;
    const id = subCategoryId ? Number(subCategoryId) : undefined;

    const products = await getProducts(id);

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
