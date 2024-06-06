import { db, table, eq } from "@acme/db";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Resource } from "sst";

const verifier = CognitoJwtVerifier.create({
  userPoolId: Resource.UserPool.id,
  clientId: process.env.COGNTIO_CLIENT_ID!,
  tokenUse: "id",
});

export async function signInWithIdToken(idToken: string) {
  const payload = await verifier.verify(idToken);

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

  const session = await db
    .insert(table.session)
    .values({
      userId: user.id,
      expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    })
    .returning();

  return { user, session };
}

export async function validateSession(sessionId: number) {
  const session = await db.query.session.findFirst({
    where: eq(table.session.id, sessionId),
    with: {
      user: true,
    },
  });

  //check expiration date
}

export function invalidateSession(sessionId: number) {
  return db.delete(table.session).where(eq(table.session.id, sessionId));
}
