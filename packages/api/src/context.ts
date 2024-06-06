import { db } from "@acme/db";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

export async function createContext({}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  return {
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
