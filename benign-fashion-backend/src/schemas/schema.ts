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
export const categoriesModel = mysqlTable("categories", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  categoryType: mysqlEnum("category_type", ["men", "kids"]),
  isCategoryHead: boolean("is_category_head").notNull(),
});

// ================= PRODUCTS =================
export const productsModel = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  productCode: varchar("product_code", { length: 20 }).unique(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  price: int("price").notNull(),
  discount: int("discount").notNull().default(0),
  categoryId: int("category_id")
    .notNull()
    .references(() => categoriesModel.id, { onDelete: "cascade" }),
  subCategoryId: int("sub_category_id")
    .notNull()
    .references(() => categoriesModel.id, { onDelete: "cascade" }),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= PHOTOS =================
export const photosModel = mysqlTable("photos", {
  id: int("id").primaryKey().autoincrement(),
  productId: int("product_id")
    .notNull()
    .references(() => productsModel.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
});

// ================= ORDERS =================
export const ordersModel = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => userModel.userId, { onDelete: "cascade" }),
  productId: int("product_id")
    .notNull()
    .references(() => productsModel.id, { onDelete: "cascade" }),
  size: mysqlEnum("size", ["M", "L", "XL", "XXL"]).notNull(),
  quantity: int("quantity").notNull().default(1),
  status: mysqlEnum("status", ["pending", "paid", "delivered"]).default(
    "pending"
  ),
  method: mysqlEnum("method", ["cash", "bkash", "nagad", "rocket"]).notNull(),
  transactionId: varchar("transaction_id", { length: 255 }),
  totalAmount: int("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= RELATIONS =================
// User ↔ Role
export const userRelations = relations(userModel, ({ one, many }) => ({
  role: one(roleModel, {
    fields: [userModel.roleId],
    references: [roleModel.roleId],
  }),
  orders: many(ordersModel),
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
export const productRelations = relations(productsModel, ({ one, many }) => ({
  category: one(categoriesModel, {
    fields: [productsModel.categoryId],
    references: [categoriesModel.id],
  }),
  photos: many(photosModel),
}));

export const photosRelations = relations(photosModel, ({ one }) => ({
  product: one(productsModel, {
    fields: [photosModel.productId],
    references: [productsModel.id],
  }),
}));

export const categoryRelations = relations(categoriesModel, ({ many }) => ({
  products: many(productsModel),
}));

export const orderRelations = relations(ordersModel, ({ one }) => ({
  user: one(userModel, {
    fields: [ordersModel.userId],
    references: [userModel.userId],
  }),
  product: one(productsModel, {
    fields: [ordersModel.productId],
    references: [productsModel.id],
  }),
}));

export const photoRelations = relations(photosModel, ({ one }) => ({
  product: one(productsModel, {
    fields: [photosModel.productId],
    references: [productsModel.id],
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
export type Category = typeof categoriesModel.$inferSelect;
export type NewCategory = typeof categoriesModel.$inferInsert;
export type Product = typeof productsModel.$inferSelect;
export type NewProduct = typeof productsModel.$inferInsert;
export type Order = typeof ordersModel.$inferSelect;
export type NewOrder = typeof ordersModel.$inferInsert;
