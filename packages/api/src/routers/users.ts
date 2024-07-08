import { db, ne, table } from "@acme/db";
import { privateProcedure, router } from "../trpc";
import { getImageUrl } from "../lib/s3";

export const userRouter = router({
  list: privateProcedure.query(async ({ ctx }) => {
    const users = await db.query.users.findMany({
      where: ne(table.users.id, ctx.user.id),
    });

    return users.map(({ avatarKey, cognitoId, ...user }) => ({
      ...user,
      avatar: avatarKey ? getImageUrl(avatarKey) : null,
    }));
  }),
});
