import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  cognitoId: text("cognito_id").notNull().unique(),
  email: text("email").notNull().unique(),
});

export const session = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: integer("expires_at").notNull(),
});
