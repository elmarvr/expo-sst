import { z } from "zod";
import { table } from "@acme/db";
import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = router({
  todo: router({
    create: publicProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const [newTodo] = await ctx.db
          .insert(table.todo)
          .values(input)
          .returning()
          .execute();

        return newTodo;
      }),
    list: publicProcedure.query(async ({ ctx }) => {
      const todos = await ctx.db.query.todo.findMany();

      return todos;
    }),
  }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
