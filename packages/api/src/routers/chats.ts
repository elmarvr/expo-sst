import { z } from "zod";
import { emit, privateProcedure, router } from "../trpc";
import { db, table } from "@acme/db";
import { observable } from "@trpc/server/observable";

export const chatRouter = router({
  send: privateProcedure
    .input(
      z.object({
        roomId: z.number(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await db
        .insert(table.chats)
        .values({
          userId: ctx.user.id,
          message: input.message,
        })
        .returning({
          id: table.chats.id,
          userId: table.chats.userId,
          message: table.chats.message,
        })
        .execute();

      emit.chats.onSend({
        roomId: input.roomId,
        userId: ctx.user.id,
        message: input.message,
      });

      return message;
    }),

  onSend: privateProcedure.subscription(async () => {
    return observable<Omit<Required<Chat>, "id">>(() => {});
  }),
});

export type Chat = typeof table.chats.$inferSelect;
