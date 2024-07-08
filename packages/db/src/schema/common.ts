import { relations } from "drizzle-orm";
import { users } from "./auth";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const roomRelations = relations(rooms, ({ many }) => ({
  members: many(members),
}));

export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").references(() => rooms.id),
  userId: integer("user_id").references(() => users.id),
});

export const chats = sqliteTable("chats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").references(() => rooms.id),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
});

export const chatRelations = relations(chats, ({ one }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [chats.roomId],
    references: [rooms.id],
  }),
}));
