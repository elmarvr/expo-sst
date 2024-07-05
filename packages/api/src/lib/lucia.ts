import { webcrypto } from "node:crypto";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Resource } from "sst";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db, table, eq } from "@acme/db";
import { getImageUrl, uploadImagefromUrl } from "./s3";

globalThis.crypto = webcrypto;

export const lucia = new Lucia(
  new DrizzleSQLiteAdapter(db, table.sessions, table.users),
  {
    getUserAttributes(attrs) {
      return {
        id: attrs.id,
        name: attrs.name,
        email: attrs.email,
        avatar: attrs.avatarKey ? getImageUrl(attrs.avatarKey) : null,
      };
    },
  }
);

export function getSessionFromBearerToken(authorization: string) {
  const sessionId = lucia.readBearerToken(authorization);

  if (!sessionId) {
    return { user: null, session: null };
  }

  return lucia.validateSession(sessionId);
}

export async function signInWithIdToken(idToken: string) {
  const payload = await jwtVerifier.verify(idToken);

  let user = await db.query.users.findFirst({
    where: eq(table.users.cognitoId, payload.sub),
  });

  if (!user) {
    const avatarKey = await uploadImagefromUrl(payload.picture as string);

    const result = await db
      .insert(table.users)
      .values({
        cognitoId: payload.sub,
        email: payload.email as string,
        name: payload.name as string,
        avatarKey,
      })
      .returning();

    user = result[0];
  }

  const session = await lucia.createSession(user.id, {});

  return {
    sessionToken: session.id,
  };
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: number;

    DatabaseUserAttributes: typeof table.users.$inferSelect;
  }
}

export const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: Resource.UserPool.id,
  clientId: process.env.COGNTIO_CLIENT_ID!,
  tokenUse: "id",
});
