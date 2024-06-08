import { db } from "@acme/db";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { getSessionFromBearerToken } from "./lib/lucia";

export async function createContext({
  event,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  const { user, session } = await getSessionFromBearerToken(
    event.headers["Authorisation"] ?? ""
  );

  return {
    db,
    user,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
