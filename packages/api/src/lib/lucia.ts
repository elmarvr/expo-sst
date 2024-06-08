import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Resource } from "sst";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db, eq, table } from "@acme/db";
import { Lucia } from "lucia";
import { webcrypto } from "node:crypto";

globalThis.crypto = webcrypto;

export const lucia = new Lucia(
  new DrizzlePostgreSQLAdapter(db, table.session, table.user),
  {
    getUserAttributes(attrs) {
      return {
        id: attrs.id,
        email: attrs.email,
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

  let user = await db.query.user.findFirst({
    where: eq(table.user.cognitoId, payload.sub),
  });

  if (!user) {
    const result = await db
      .insert(table.user)
      .values({
        cognitoId: payload.sub,
        email: payload.email as string,
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

    DatabaseUserAttributes: typeof table.user.$inferSelect;
  }
}

export const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: Resource.UserPool.id,
  clientId: process.env.COGNTIO_CLIENT_ID!,
  tokenUse: "id",
});
