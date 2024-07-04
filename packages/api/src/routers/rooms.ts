import { z } from "zod";
import { and, eq, table } from "@acme/db";
import { privateProcedure, router } from "../trpc";

export const roomRouter = router({
  create: privateProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [room] = await ctx.db
        .insert(table.rooms)
        .values({
          name: input.name,
        })
        .returning({
          id: table.rooms.id,
        })
        .execute();

      await ctx.db
        .insert(table.members)
        .values({
          roomId: room.id,
          userId: ctx.user.id,
        })
        .execute();

      return room;
    }),

  join: privateProcedure
    .input(
      z.object({
        roomId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(table.members)
        .values({
          roomId: input.roomId,
          userId: ctx.user.id,
        })
        .execute();
    }),

  leave: privateProcedure
    .input(
      z.object({
        roomId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(table.members)
        .where(
          and(
            eq(table.members.roomId, input.roomId),
            eq(table.members.userId, ctx.user.id)
          )
        )
        .execute();
    }),
});
