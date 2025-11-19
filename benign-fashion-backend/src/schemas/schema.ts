import { relations, sql } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
  text,
  mysqlEnum,
  json,
} from "drizzle-orm/mysql-core";

// ================= ROLES =================
export const roleModel = mysqlTable("roles", {
  roleId: int("role_id").primaryKey().autoincrement(),
  roleName: varchar("role_name", { length: 50 }).notNull(),
});

export const permissionsModel = mysqlTable("permissions", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

export const rolePermissionsModel = mysqlTable("role_permissions", {
  roleId: int("role_id")
    .notNull()
    .references(() => roleModel.roleId, { onDelete: "cascade" }),
  permissionId: int("permission_id")
    .notNull()
    .references(() => permissionsModel.id, { onDelete: "cascade" }),
});

export const userRolesModel = mysqlTable("user_roles", {
  userId: int("user_id")
    .notNull()
    .references(() => userModel.userId, { onDelete: "cascade" }),
  roleId: int("role_id")
    .notNull()
    .references(() => roleModel.roleId, { onDelete: "cascade" }),
});

// ================= USERS =================
export const userModel = mysqlTable("users", {
  userId: int("user_id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  active: boolean("active").notNull().default(true),
  roleId: int("role_id").references(() => roleModel.roleId, {
    onDelete: "set null",
  }),
  fullName: varchar("full_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }).unique(),
  address: varchar("address", { length: 255 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
});

// ================= CATEGORIES =================
export const categories = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  categoryType: mysqlEnum("category_type", ["men", "kids"]),
  isCategoryHead: boolean("is_category_head").notNull(),
});

// ================= PRODUCTS =================
export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  productCode: int("product_code").unique(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  photos: json("photos").$type<string[]>().notNull(),
  price: int("price").notNull(),
  discount: int("discount").notNull().default(0),
  categoryId: int("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= CARTS =================
export const carts = mysqlTable("carts", {
  id: int("id").primaryKey().autoincrement(),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: int("user_id")
    .notNull()
    .references(() => userModel.userId, { onDelete: "cascade" }),
  quantity: int("quantity").notNull().default(1), // ✅ added quantity
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= ORDERS =================
export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => userModel.userId, { onDelete: "cascade" }),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: int("quantity").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "paid",
    "delivered",
  ]).default("pending"),
  totalAmount: int("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= PAYMENTS =================
export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => userModel.userId, { onDelete: "cascade" }),
  orderId: int("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  method: mysqlEnum("method", ["cash", "bkash", "nagad", "rocket"]).notNull(),
  totalAmount: int("total_amount").notNull(),
  transactionId: varchar("transaction_id", { length: 255 }),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default(
    "pending"
  ),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= RELATIONS =================
// User ↔ Role
export const userRelations = relations(userModel, ({ one, many }) => ({
  role: one(roleModel, {
    fields: [userModel.roleId],
    references: [roleModel.roleId],
  }),
  carts: many(carts),
  orders: many(orders),
  payments: many(payments),
  userRoles: many(userRolesModel),
}));

export const roleRelations = relations(roleModel, ({ many }) => ({
  users: many(userModel),
  rolePermissions: many(rolePermissionsModel),
  userRoles: many(userRolesModel),
}));

export const permissionRelations = relations(permissionsModel, ({ many }) => ({
  rolePermissions: many(rolePermissionsModel),
}));

export const rolePermissionsRelations = relations(
  rolePermissionsModel,
  ({ one }) => ({
    role: one(roleModel, {
      fields: [rolePermissionsModel.roleId],
      references: [roleModel.roleId],
    }),
    permission: one(permissionsModel, {
      fields: [rolePermissionsModel.permissionId],
      references: [permissionsModel.id],
    }),
  })
);

export const userRolesRelations = relations(userRolesModel, ({ one }) => ({
  user: one(userModel, {
    fields: [userRolesModel.userId],
    references: [userModel.userId],
  }),
  role: one(roleModel, {
    fields: [userRolesModel.roleId],
    references: [roleModel.roleId],
  }),
}));

// Product relations
export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  carts: many(carts),
  orders: many(orders),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const cartRelations = relations(carts, ({ one }) => ({
  product: one(products, {
    fields: [carts.productId],
    references: [products.id],
  }),
  user: one(userModel, {
    fields: [carts.userId],
    references: [userModel.userId],
  }),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(userModel, {
    fields: [orders.userId],
    references: [userModel.userId],
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  payments: many(payments),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  user: one(userModel, {
    fields: [payments.userId],
    references: [userModel.userId],
  }),
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// ================= TYPES =================
export type User = typeof userModel.$inferSelect;
export type NewUser = typeof userModel.$inferInsert;
export type Role = typeof roleModel.$inferSelect;
export type NewRole = typeof roleModel.$inferInsert;
export type Permission = typeof permissionsModel.$inferSelect;
export type NewPermission = typeof permissionsModel.$inferInsert;
export type UserRole = typeof userRolesModel.$inferSelect;
export type NewUserRole = typeof userRolesModel.$inferInsert;
export type RolePermission = typeof rolePermissionsModel.$inferSelect;
export type NewRolePermission = typeof rolePermissionsModel.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
