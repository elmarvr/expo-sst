import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { observable } from "@trpc/server/observable";
import { createEmitter } from "@acme/ws/emitter";

const ws = createEmitter<AppRouter>();

const start = Date.now();
export const appRouter = router({
  uptime: router({
    read: publicProcedure.input(z.number()).subscription(async () => {
      return observable<{ uptime: number }>(() => {});
    }),
    dispatch: publicProcedure.mutation(async () => {
      const now = Date.now();

      ws.uptime.read.emit({ uptime: now - start });
    }),
  }),

  auth: authRouter,
});

export type AppRouter = typeof appRouter;
