import { db } from "@acme/db";
import { privateProcedure, router } from "../trpc";
import { getImageUrl } from "../lib/s3";

export const userRouter = router({
  list: privateProcedure.query(async ({}) => {
    const users = await db.query.users.findMany({});

    return users.map(({ avatarKey, cognitoId, ...user }) => ({
      ...user,
      avatar: avatarKey ? getImageUrl(avatarKey) : null,
    }));
  }),
});
