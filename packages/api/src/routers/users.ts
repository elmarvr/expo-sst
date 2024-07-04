import { privateProcedure, router } from "../trpc";

export const userRouter = router({
  list: privateProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({});
  }),
});
