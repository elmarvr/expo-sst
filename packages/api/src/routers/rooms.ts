import { z } from "zod";
import { and, db, eq, inArray, table } from "@acme/db";
import { privateProcedure, router } from "../trpc";

export const roomRouter = router({
  list: privateProcedure.query(async ({ ctx }) => {
    const members = await db.query.members.findMany({
      where: eq(table.members.userId, ctx.user.id),
      columns: {
        roomId: true,
      },
    });

    const roomIds = members.flatMap((member) => member.roomId ?? []);

    return db.query.rooms.findMany({
      where: inArray(table.rooms.id, roomIds),
    });
  }),

  create: privateProcedure
    .input(z.object({ name: z.string(), userIds: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      const [room] = await db
        .insert(table.rooms)
        .values({
          name: input.name,
        })
        .returning({
          id: table.rooms.id,
        })
        .execute();

      const memberIds = [ctx.user.id, ...input.userIds];

      await db
        .insert(table.members)
        .values(
          memberIds.map((userId) => ({
            roomId: room.id,
            userId,
          }))
        )
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
      await db
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
      await db
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
