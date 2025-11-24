import { Router } from "express";
import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/create", upload.array("photoUrls", 10), createProductController);
router.get("/get", getProductsController);
router.get("/get/:id", getProductByIdController);
router.put("/update/:id", upload.array("photoUrls", 10), updateProductController);

router.delete("/delete/:id", deleteProductController);

export default router;
