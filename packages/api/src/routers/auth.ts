import { z } from "zod";
import { lucia, signInWithIdToken } from "../lib/lucia";
import { privateProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  signInWithIdToken: publicProcedure
    .input(
      z.object({
        idToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return signInWithIdToken(input.idToken);
    }),

  currentUser: privateProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  signOut: privateProcedure.mutation(async ({ ctx }) => {
    return lucia.invalidateSession(ctx.session.id);
  }),
});
