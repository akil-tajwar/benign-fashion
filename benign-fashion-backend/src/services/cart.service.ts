
import { eq, and } from "drizzle-orm";
import { db } from "../config/database";
import { carts, products } from "../schemas";
import { url } from "inspector";




// Add product to cart (increase quantity if already exists)
export const addToCart = async (userId: number, productId: number) => {
  // check if product already in cart
  const existing = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.productId, productId)))
    .limit(1);

  if (existing.length > 0) {
    // ✅ increment quantity
    await db
      .update(carts)
      .set({ quantity: existing[0].quantity + 1 })
      .where(eq(carts.id, existing[0].id));

    return { message: "Product quantity updated in cart" };
  }

  // insert new cart item with quantity 1
  await db.insert(carts).values({
    userId,
    productId,
    quantity: 1,
  });

  return { message: "Product added to cart" };
};


// export const removeFromCart = async (userId: number, productId: number) => {
//   await db
//     .delete(carts)
//     .where(and(eq(carts.userId, userId), eq(carts.productId, productId)));

//   return { message: "Product removed from cart" };
// };

//this is carts delete service for one by one quantity

export const removeFromCart = async (userId: number, productId: number) => {
  // Check if product exists in cart
  const existing = await db
    .select()
    .from(carts)
    .where(and(eq(carts.userId, userId), eq(carts.productId, productId)))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Product not found in cart");
  }

  const currentQuantity = existing[0].quantity;

  if (currentQuantity > 1) {
    // ✅ Decrement quantity by 1
    await db
      .update(carts)
      .set({ quantity: currentQuantity - 1 })
      .where(eq(carts.id, existing[0].id));

    return { 
      message: "Product quantity decreased", 
      quantity: currentQuantity - 1 
    };
  } else {
    // ✅ Remove product completely when quantity is 1
    await db
      .delete(carts)
      .where(eq(carts.id, existing[0].id));

    return { message: "Product removed from cart" };
  }
};


export const getUserCart = async (userId: number) => {
  const cartItems = await db
    .select({
      cartId: carts.id,
      productId: carts.productId,
      name: products.name,
      price: products.price,
      quantity: carts.quantity,       // ✅ include quantity
      url:products.photos,
      createdAt: carts.createdAt,
    })
    .from(carts)
    .innerJoin(products, eq(carts.productId, products.id))
    .where(eq(carts.userId, userId));

  return cartItems;
};
