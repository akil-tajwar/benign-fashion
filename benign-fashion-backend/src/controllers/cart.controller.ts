import { Request, Response, NextFunction } from "express";
import * as cartService from "../services/cart.service";



export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId; // populated by auth middleware
    const { productId } = req.body;

    if (!userId || !productId) {
      res.status(400).json({ message: "userId and productId are required" });
      return;
    }

    const result = await cartService.addToCart(userId, productId);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("❌ Error in addToCartController:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};



// export const removeFromCartController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const userId = req.user?.userId;
//     const productId = Number(req.params.productId);

//     if (!userId || !productId) {
//       res.status(400).json({ message: "userId and productId are required" });
//       return;
//     }

//     const result = await cartService.removeFromCart(userId, productId);
//     res.status(200).json(result);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// this is delete carts controller
export const removeFromCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId; // Match addToCartController style
    const productId = Number(req.params.productId);

    if (!userId || !productId) {
      res.status(400).json({ message: "userId and productId are required" });
      return;
    }

    const result = await cartService.removeFromCart(userId, productId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("❌ Error in removeFromCartController:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const getUserCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const cartItems = await cartService.getUserCart(userId);
    res.status(200).json(cartItems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
