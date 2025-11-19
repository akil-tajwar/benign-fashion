
import { sql } from "drizzle-orm";
import { productReviews } from "../schemas";
import { db } from "../config/database";

export const addReview = async (
  userId: number,
  productId: number,
  rating: number,
  comment?: string
) => {
  const [review] = await db
    .insert(productReviews)
    .values({
      userId,
      productId,
      rating,
      comment,
    })
    .$returningId();
  return review;
};

export const getReviewsByProduct = async (productId: number) => {
  return await db
    .select()
    .from(productReviews)
    .where(sql`${productReviews.productId} = ${productId}`);
};

export const deleteReview = async (reviewId: number, userId: number, isAdmin = false) => {
  // Only delete if owner OR admin
  if (isAdmin) {
    return await db.delete(productReviews).where(sql`${productReviews.id} = ${reviewId}`);
  }

  return await db
    .delete(productReviews)
    .where(sql`${productReviews.id} = ${reviewId} AND ${productReviews.userId} = ${userId}`);
};
