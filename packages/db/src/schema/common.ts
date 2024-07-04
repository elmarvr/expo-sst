import {
  text,
  serial,
  pgTable,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";
import { baseTable } from "../utils";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const roomRelations = relations(rooms, ({ many }) => ({
  members: many(members),
}));

export const members = pgTable(
  "members",
  {
    roomId: serial("room_id").references(() => rooms.id),
    userId: serial("user_id").references(() => users.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.userId] }),
    };
  }
);

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  roomId: serial("room_id").references(() => rooms.id),
  userId: serial("user_id").references(() => users.id),
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
