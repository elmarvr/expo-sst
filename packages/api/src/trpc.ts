import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createEmitter } from "@acme/ws/emitter";

import type { Context } from "./context";
import type { AppRouter } from "./routers/_app";

export const emit = createEmitter<AppRouter>();

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
      session: ctx.session,
    },
  });
});

export const privateProcedure = t.procedure.use(isAuthed);

export const publicProcedure = t.procedure;
