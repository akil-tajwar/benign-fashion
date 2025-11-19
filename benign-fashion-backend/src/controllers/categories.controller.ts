import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categories.service";

export const categorySchema = z.object({
  id: z.number().int().optional(),     // auto-increment, so optional
  name: z.string().min(1).max(100),
  categoryType: z.enum(['men', 'kids']),
  isCategoryHead: z.boolean().default(false),
});

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = categorySchema.parse(req.body);
    console.log("🚀 ~ createCategoryController ~ req.body:", req.body)
    const category = await createCategory(data);
    res.status(201).json({ status: "success", data: category });
  } catch (err) {
    next(err);
  }
};

export const getCategoriesController = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCategories();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const category = await getCategoryById(id);
    res.json({ status: "success", data: category });
  } catch (err) {
    next(err);
  }
};

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const data = categorySchema.partial().parse(req.body);
    const updated = await updateCategory(id, data);
    res.json({ status: "success", data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteCategory(id);
    res.json({ status: "success", data: result });
  } catch (err) {
    next(err);
  }
};
